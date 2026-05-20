import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/statistics', label: 'Estadísticas', icon: '📊' },
  { to: '/comparison', label: 'Comparación', icon: '🌡️' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="font-bold text-lg tracking-tight">
            CheckMyWeather
          </NavLink>

          <button
            className="sm:hidden p-2 rounded hover:bg-white/20"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden sm:flex gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded text-sm font-medium transition ${
                    isActive ? 'bg-white/20' : 'hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {open && (
          <div className="sm:hidden pb-3 space-y-1">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm font-medium transition ${
                    isActive ? 'bg-white/20' : 'hover:bg-white/10'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {icon} {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
