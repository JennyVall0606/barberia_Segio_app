import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(db.data.servicios)
})

router.get('/:id', (req, res) => {
  const servicio = db.data.servicios.find(s => s.id === req.params.id)
  if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' })
  res.json(servicio)
})



router.post('/', async (req, res) => {
  const { nombre, descripcion, precio, duracion } = req.body
  if (!nombre || precio == null) return res.status(400).json({ error: 'nombre y precio son requeridos' })

  const servicio = {
    id: crypto.randomUUID(),
    nombre,
    descripcion: descripcion ?? '',
    precio: Number(precio),
    duracion: Number(duracion) || 30,
    createdAt: new Date().toISOString()
  }

  db.data.servicios.push(servicio)
  await db.write()
  res.status(201).json(servicio)
})

router.put('/:id', async (req, res) => {
  const index = db.data.servicios.findIndex(s => s.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Servicio no encontrado' })

  const { nombre, descripcion, precio, duracion } = req.body
  db.data.servicios[index] = {
    ...db.data.servicios[index],
    nombre,
    descripcion,
    precio: Number(precio),
    duracion: Number(duracion)
  }
  await db.write()
  res.json(db.data.servicios[index])
})

router.delete('/:id', async (req, res) => {
  const index = db.data.servicios.findIndex(s => s.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Servicio no encontrado' })

  db.data.servicios.splice(index, 1)
  await db.write()
  res.status(204).send()
})

export default router
