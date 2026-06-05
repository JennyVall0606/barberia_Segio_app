import express from 'express'
import cors from 'cors'
import clientesRouter from './routes/clientes.js'
import serviciosRouter from './routes/servicios.js'
import citasRouter from './routes/citas.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())



app.use('/api/clientes', clientesRouter)
app.use('/api/servicios', serviciosRouter)
app.use('/api/citas', citasRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Barbería API corriendo', version: '1.0.0' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
