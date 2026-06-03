import { Link } from 'react-router-dom'

const features = [
  {
    icon: '👤',
    title: 'Gestión de Clientes',
    desc: 'Registra y administra tu cartera de clientes con toda su información de contacto.',
    to: '/clientes',
  },
  {
    icon: '💈',
    title: 'Catálogo de Servicios',
    desc: 'Define los servicios que ofreces, su precio y duración para una atención perfecta.',
    to: '/servicios',
  },
  {
    icon: '📅',
    title: 'Agenda de Citas',
    desc: 'Organiza las citas de tus clientes y mantén el control de tu jornada diaria.',
    to: '/citas',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-900 text-white py-24 px-4 text-center">
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Bienvenido a
        </p>
        <h1 className="text-5xl font-extrabold mb-4">Barbería Clásica</h1>
        <p className="text-stone-300 text-lg max-w-xl mx-auto mb-8">
          Tradición, estilo y precisión en cada corte. Gestiona tu negocio de
          manera profesional desde un solo lugar.
        </p>
        <Link
          to="/citas"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Ver citas de hoy
        </Link>
      </section>

      {/* Divider ornament */}
      <div className="flex items-center justify-center py-6 bg-stone-100">
        <span className="text-brand-400 text-3xl">✂</span>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-stone-800 mb-10">
          Todo lo que necesitas en un solo sistema
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon, title, desc, to }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-brand-600 transition-colors">
                {title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-center text-sm py-6">
        © {new Date().getFullYear()} Barbería Clásica · Todos los derechos reservados
      </footer>
    </div>
  )
}
