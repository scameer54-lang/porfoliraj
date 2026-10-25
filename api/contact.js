import mysql from 'mysql2/promise'

let pool
let schemaReady = false

function getPool() {
  if (!process.env.DATABASE_URL) return null
  if (!pool) pool = mysql.createPool(process.env.DATABASE_URL)
  return pool
}

async function ensureSchema(db) {
  if (schemaReady) return
  await db.execute(`CREATE TABLE IF NOT EXISTS contact_messages (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL, email VARCHAR(254) NOT NULL, message TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_contact_messages_created_at (created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  schemaReady = true
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed.' })
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (name.length < 2 || name.length > 80) return res.status(400).json({ ok: false, error: 'Please enter your name.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' })
  if (message.length < 10 || message.length > 4000) return res.status(400).json({ ok: false, error: 'Please add a little more detail to your message.' })
  const db = getPool()
  if (!db) return res.status(503).json({ ok: false, error: 'The contact service is not configured yet.' })
  try {
    await ensureSchema(db)
    await db.execute('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)', [name, email, message])
    return res.status(201).json({ ok: true })
  } catch (error) {
    console.error('contact_insert_failed', error)
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' })
  }
}
