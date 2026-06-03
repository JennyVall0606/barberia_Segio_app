import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(db.data.clientes)
})

router.get('/:id', (req, res) => {
  const cliente = db.data.clientes.find(c => c.id === req.params.id)
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })
  res.json(cliente)
})

router.post('/', async (req, res) => {
  const { nombre, telefono, email } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })

  const cliente = {
    id: crypto.randomUUID(),
    nombre,
    telefono: telefono ?? '',
    email: email ?? '',
    createdAt: new Date().toISOString()
  }

  db.data.clientes.push(cliente)
  await db.write()
  res.status(201).json(cliente)
})

router.put('/:id', async (req, res) => {
  const index = db.data.clientes.findIndex(c => c.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Cliente no encontrado' })

  const { nombre, telefono, email } = req.body
  db.data.clientes[index] = { ...db.data.clientes[index], nombre, telefono, email }
  await db.write()
  res.json(db.data.clientes[index])
})

router.delete('/:id', async (req, res) => {
  const index = db.data.clientes.findIndex(c => c.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Cliente no encontrado' })

  db.data.clientes.splice(index, 1)
  await db.write()
  res.status(204).send()
})

export default router
