import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

const defaultData = { clientes: [], servicios: [], citas: [] }
const adapter = new JSONFile(file)
export const db = new Low(adapter, defaultData)

await db.read()
