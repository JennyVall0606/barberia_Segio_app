import { useApp } from '../context/AppContext'

export default function ErrorAlert() {
  const { state, dispatch } = useApp()
  if (!state.error) return null
  return (
    <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 flex items-center justify-between mb-4">
      <span>{state.error}</span>
      <button
        onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
        className="ml-4 text-red-500 hover:text-red-700 font-bold text-lg leading-none"
      >
        &times;
      </button>
    </div>
  )
}
