import { createContext, useContext, useReducer } from 'react'

const initialState = {
  clientes: [],
  servicios: [],
  citas: [],
  loading: false,
  error: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }

    // Clientes
    case 'SET_CLIENTES':
      return { ...state, clientes: action.payload, loading: false }
    case 'ADD_CLIENTE':
      return { ...state, clientes: [...state.clientes, action.payload] }
    case 'UPDATE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      }
    case 'DELETE_CLIENTE':
      return {
        ...state,
        clientes: state.clientes.filter(c => c.id !== action.payload),
      }

    // Servicios
    case 'SET_SERVICIOS':
      return { ...state, servicios: action.payload, loading: false }
    case 'ADD_SERVICIO':
      return { ...state, servicios: [...state.servicios, action.payload] }
    case 'UPDATE_SERVICIO':
      return {
        ...state,
        servicios: state.servicios.map(s =>
          s.id === action.payload.id ? action.payload : s
        ),
      }
    case 'DELETE_SERVICIO':
      return {
        ...state,
        servicios: state.servicios.filter(s => s.id !== action.payload),
      }

    // Citas
    case 'SET_CITAS':
      return { ...state, citas: action.payload, loading: false }
    case 'ADD_CITA':
      return { ...state, citas: [...state.citas, action.payload] }
    case 'CANCEL_CITA':
      return {
        ...state,
        citas: state.citas.map(c =>
          c.id === action.payload ? { ...c, estado: 'cancelada' } : c
        ),
      }

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
