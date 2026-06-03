import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const { cliente_id, servicio_id } = req.query
  let citas = db.data.citas

  if (cliente_id) citas = citas.filter(c => c.cliente_id === cliente_id)
  if (servicio_id) citas = citas.filter(c => c.servicio_id === servicio_id)

  res.json(citas)
})

router.get('/:id', (req, res) => {
  const cita = db.data.citas.find(c => c.id === req.params.id)
  if (!cita) return res.status(404).json({ error: 'Cita no encontrada' })
  res.json(cita)
})

router.post('/', async (req, res) => {
  const { cliente_id, servicio_id, fecha, hora } = req.body

  if (!cliente_id || !servicio_id || !fecha || !hora) {
    return res.status(400).json({ error: 'cliente_id, servicio_id, fecha y hora son requeridos' })
  }

  const clienteExiste = db.data.clientes.some(c => c.id === cliente_id)
  if (!clienteExiste) return res.status(404).json({ error: 'Cliente no encontrado' })

  const servicioExiste = db.data.servicios.some(s => s.id === servicio_id)
  if (!servicioExiste) return res.status(404).json({ error: 'Servicio no encontrado' })

  const cita = {
    id: crypto.randomUUID(),
    cliente_id,
    servicio_id,
    fecha,
    hora,
    estado: 'pendiente',
    createdAt: new Date().toISOString()
  }

  db.data.citas.push(cita)
  await db.write()
  res.status(201).json(cita)
})

router.put('/:id', async (req, res) => {
  const index = db.data.citas.findIndex(c => c.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Cita no encontrada' })

  const { cliente_id, servicio_id, fecha, hora, estado } = req.body

  if (cliente_id) {
    const clienteExiste = db.data.clientes.some(c => c.id === cliente_id)
    if (!clienteExiste) return res.status(404).json({ error: 'Cliente no encontrado' })
  }

  if (servicio_id) {
    const servicioExiste = db.data.servicios.some(s => s.id === servicio_id)
    if (!servicioExiste) return res.status(404).json({ error: 'Servicio no encontrado' })
  }

  db.data.citas[index] = {
    ...db.data.citas[index],
    ...(cliente_id && { cliente_id }),
    ...(servicio_id && { servicio_id }),
    ...(fecha && { fecha }),
    ...(hora && { hora }),
    ...(estado && { estado })
  }
  await db.write()
  res.json(db.data.citas[index])
})

router.delete('/:id', async (req, res) => {
  const index = db.data.citas.findIndex(c => c.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Cita no encontrada' })

  db.data.citas.splice(index, 1)
  await db.write()
  res.status(204).send()
})

export default router
