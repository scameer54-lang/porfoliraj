import express from 'express'
import { createServer as createViteServer } from 'vite'
import mysql from 'mysql2/promise'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const port = Number(process.env.PORT || 3000)
const isProduction = process.env.NODE_ENV === 'production'
const app = express()
let pool
let databaseReady = false

app.use(express.json({ limit: '32kb' }))

function getPool() {
  if (!process.env.DATABASE_URL) return null
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined,
    })
  }
  return pool
}

async function ensureSchema() {
  const db = getPool()
  if (!db) return false
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      email VARCHAR(254) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_contact_messages_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)
  databaseReady = true
  return true
}

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'jack3d', database: databaseReady ? 'ready' : 'pending' })
})

app.post('/api/contact', async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ ok: false, error: 'Please enter your name.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' })
  }
  if (message.length < 10 || message.length > 4000) {
    return res.status(400).json({ ok: false, error: 'Please add a little more detail to your message.' })
  }

  const db = getPool()
  if (!db || !databaseReady) {
    return res.status(503).json({ ok: false, error: 'The contact service is warming up. Please try again shortly.' })
  }

  try {
    await db.execute('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)', [name, email, message])
    return res.status(201).json({ ok: true })
  } catch (error) {
    console.error('contact_insert_failed', error)
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' })
  }
})

async function start() {
  try {
    await ensureSchema()
  } catch (error) {
    console.error('database_startup_failed', error)
  }

  if (isProduction) {
    app.use(express.static(path.join(root, 'dist')))
    app.use((_req, res) => res.sendFile(path.join(root, 'dist', 'index.html')))
  } else {
    const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: 'spa' })
    app.use(vite.middlewares)
  }

  app.listen(port, '0.0.0.0', () => console.log(`Jack server listening on ${port}`))
}

start()
