import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import api from '../api/client'
import Modal from '../components/Modal'
import ErrorAlert from '../components/ErrorAlert'

const emptyForm = { nombre: '', telefono: '', email: '' }

export default function Clientes() {
  const { state, dispatch } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true })
    api.get('/clientes')
      .then(r => dispatch({ type: 'SET_CLIENTES', payload: r.data }))
      .catch(() => dispatch({ type: 'SET_ERROR', payload: 'Error al cargar clientes' }))
  }, [])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(cliente) {
    setEditing(cliente)
    setForm({ nombre: cliente.nombre, telefono: cliente.telefono, email: cliente.email })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditing(null)
    setForm(emptyForm)
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const { data } = await api.put(`/clientes/${editing.id}`, form)
        dispatch({ type: 'UPDATE_CLIENTE', payload: data })
      } else {
        const { data } = await api.post('/clientes', form)
        dispatch({ type: 'ADD_CLIENTE', payload: data })
      }
      closeModal()
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar el cliente' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      dispatch({ type: 'DELETE_CLIENTE', payload: id })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar el cliente' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Clientes</h1>
        <button
          onClick={openNew}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo cliente
        </button>
      </div>

      <ErrorAlert />

      {state.loading ? (
        <p className="text-center text-stone-400 py-16">Cargando...</p>
      ) : state.clientes.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-5xl mb-4">👤</p>
          <p>No hay clientes registrados aún.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {state.clientes.map(c => (
                <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-stone-800">{c.nombre}</td>
                  <td className="px-4 py-3 text-stone-600">{c.telefono}</td>
                  <td className="px-4 py-3 text-stone-600">{c.email}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-xs px-3 py-1 rounded-md border border-stone-300 hover:bg-stone-100 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar cliente' : 'Nuevo cliente'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
            <Field label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeModal} className="text-sm px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="text-sm px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  )
}
