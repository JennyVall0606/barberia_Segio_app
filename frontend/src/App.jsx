import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Clientes from './pages/Clientes'
import Servicios from './pages/Servicios'
import Citas from './pages/Citas'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/citas" element={<Citas />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
