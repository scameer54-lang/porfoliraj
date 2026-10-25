import mysql from 'mysql2/promise'

let pool

export default async function handler(_req, res) {
  if (!process.env.DATABASE_URL) return res.status(200).json({ ok: true, service: 'raj', database: 'not-configured' })
  try {
    if (!pool) pool = mysql.createPool(process.env.DATABASE_URL)
    await pool.query('SELECT 1')
    return res.status(200).json({ ok: true, service: 'raj', database: 'ready' })
  } catch (error) {
    console.error('health_database_failed', error)
    return res.status(503).json({ ok: false, service: 'raj', database: 'unavailable' })
  }
}
