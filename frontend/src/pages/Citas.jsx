import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import api from '../api/client'
import Modal from '../components/Modal'
import ErrorAlert from '../components/ErrorAlert'

const emptyForm = { cliente_id: '', servicio_id: '', fecha: '', hora: '' }

const ESTADO_BADGE = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  cancelada: 'bg-red-100 text-red-600',
  completada: 'bg-green-100 text-green-700',
}

export default function Citas() {
  const { state, dispatch } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true })
    Promise.all([
      api.get('/citas'),
      api.get('/clientes'),
      api.get('/servicios'),
    ])
      .then(([citas, clientes, servicios]) => {
        dispatch({ type: 'SET_CITAS', payload: citas.data })
        dispatch({ type: 'SET_CLIENTES', payload: clientes.data })
        dispatch({ type: 'SET_SERVICIOS', payload: servicios.data })
      })
      .catch(() => dispatch({ type: 'SET_ERROR', payload: 'Error al cargar datos' }))
  }, [])

  function openNew() {
    setForm(emptyForm)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setForm(emptyForm)
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      cliente_id: parseInt(form.cliente_id, 10),
      servicio_id: parseInt(form.servicio_id, 10),
      fecha: form.fecha,
      hora: form.hora,
      estado: 'pendiente',
    }
    try {
      const { data } = await api.post('/citas', payload)
      dispatch({ type: 'ADD_CITA', payload: data })
      closeModal()
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al crear la cita' })
    } finally {
      setSaving(false)
    }
  }

  async function handleCancel(id) {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await api.patch(`/citas/${id}`, { estado: 'cancelada' })
      dispatch({ type: 'CANCEL_CITA', payload: id })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cancelar la cita' })
    }
  }

  function getClienteName(id) {
    return state.clientes.find(c => c.id === id)?.nombre ?? `Cliente #${id}`
  }

  function getServicioName(id) {
    return state.servicios.find(s => s.id === id)?.nombre ?? `Servicio #${id}`
  }

  const pendientes = state.citas.filter(c => c.estado === 'pendiente')
  const resto = state.citas.filter(c => c.estado !== 'pendiente')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Citas</h1>
        <button
          onClick={openNew}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva cita
        </button>
      </div>

      <ErrorAlert />

      {state.loading ? (
        <p className="text-center text-stone-400 py-16">Cargando...</p>
      ) : state.citas.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-5xl mb-4">📅</p>
          <p>No hay citas registradas aún.</p>
        </div>
      ) : (
        <>
          {pendientes.length > 0 && (
            <Section title="Pendientes" citas={pendientes} onCancel={handleCancel} getClienteName={getClienteName} getServicioName={getServicioName} />
          )}
          {resto.length > 0 && (
            <Section title="Historial" citas={resto} onCancel={null} getClienteName={getClienteName} getServicioName={getServicioName} />
          )}
        </>
      )}

      {showModal && (
        <Modal title="Nueva cita" onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Cliente</label>
              <select
                name="cliente_id"
                value={form.cliente_id}
                onChange={handleChange}
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">Seleccionar cliente...</option>
                {state.clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Servicio</label>
              <select
                name="servicio_id"
                value={form.servicio_id}
                onChange={handleChange}
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">Seleccionar servicio...</option>
                {state.servicios.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} — ${Number(s.precio).toFixed(2)} ({s.duracion_minutos} min)
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={form.hora}
                  onChange={handleChange}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
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
                {saving ? 'Guardando...' : 'Agendar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Section({ title, citas, onCancel, getClienteName, getServicioName }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">{title}</h2>
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Estado</th>
              {onCancel && <th className="px-4 py-3 text-right">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {citas.map(c => (
              <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-medium text-stone-800">{getClienteName(c.cliente_id)}</td>
                <td className="px-4 py-3 text-stone-600">{getServicioName(c.servicio_id)}</td>
                <td className="px-4 py-3 text-stone-600">{c.fecha}</td>
                <td className="px-4 py-3 text-stone-600">{c.hora}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_BADGE[c.estado] ?? 'bg-stone-100 text-stone-600'}`}>
                    {c.estado}
                  </span>
                </td>
                {onCancel && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onCancel(c.id)}
                      className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
