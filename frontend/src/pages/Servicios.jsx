import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import api from '../api/client'
import Modal from '../components/Modal'
import ErrorAlert from '../components/ErrorAlert'

const emptyForm = { nombre: '', precio: '', duracion: '' }

export default function Servicios() {
  const { state, dispatch } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true })
    api.get('/servicios')
      .then(r => dispatch({ type: 'SET_SERVICIOS', payload: r.data }))
      .catch(() => dispatch({ type: 'SET_ERROR', payload: 'Error al cargar servicios' }))
  }, [])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(servicio) {
    setEditing(servicio)
    setForm({
      nombre: servicio.nombre,
      precio: servicio.precio,
      duracion: servicio.duracion,
    })
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
    const payload = {
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      duracion: parseInt(form.duracion, 10),
    }
    try {
      if (editing) {
        const { data } = await api.put(`/servicios/${editing.id}`, payload)
        dispatch({ type: 'UPDATE_SERVICIO', payload: data })
      } else {
        const { data } = await api.post('/servicios', payload)
        dispatch({ type: 'ADD_SERVICIO', payload: data })
      }
      closeModal()
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar el servicio' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este servicio?')) return
    try {
      await api.delete(`/servicios/${id}`)
      dispatch({ type: 'DELETE_SERVICIO', payload: id })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar el servicio' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Servicios</h1>
        <button
          onClick={openNew}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo servicio
        </button>
      </div>

      <ErrorAlert />

      {state.loading ? (
        <p className="text-center text-stone-400 py-16">Cargando...</p>
      ) : state.servicios.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-5xl mb-4">💈</p>
          <p>No hay servicios registrados aún.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.servicios.map(s => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-stone-800">{s.nombre}</h3>
                <span className="text-brand-600 font-bold text-lg">
                  ${Number(s.precio).toFixed(2)}
                </span>
              </div>
              <p className="text-stone-500 text-sm">⏱ {s.duracion} minutos</p>
              <div className="flex gap-2 mt-auto pt-2 border-t border-stone-100">
                <button
                  onClick={() => openEdit(s)}
                  className="flex-1 text-xs py-1.5 rounded-md border border-stone-300 hover:bg-stone-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="flex-1 text-xs py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar servicio' : 'Nuevo servicio'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Precio ($)</label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Duración (minutos)</label>
              <input
                type="number"
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
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
