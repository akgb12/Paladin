import { NavLink, Link } from 'react-router-dom'
import { cn } from '../lib/utils'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/library', label: 'Library' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-parchment-50/85 backdrop-blur-md border-b-2 border-ink-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-400 blur-xl opacity-50 rounded-full group-hover:opacity-80 transition" />
            <div className="relative h-11 w-11 rounded-xl bg-white border-2 border-ink-900 flex items-center justify-center shadow-brutal-sm overflow-hidden">
              <img src="/paladin-logo.png" alt="Paladin" className="h-10 w-10 object-contain group-hover:animate-wiggle" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-extrabold text-xl tracking-tight text-ink-900">PALADIN</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-ink-500 font-mono font-bold">Receipt Vault</span>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-0.5 p-1 bg-white border-2 border-ink-900 rounded-xl shadow-brutal-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider font-mono transition-colors',
                  isActive
                    ? 'bg-ink-900 text-parchment-50'
                    : 'text-ink-600 hover:text-ink-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/upload" className="hidden sm:inline-flex btn-primary text-sm !py-2 !px-3.5">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
          New Receipt
        </Link>

        <div className="sm:hidden flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-2.5 py-1 rounded-md text-xs font-bold uppercase font-mono',
                  isActive ? 'bg-ink-900 text-parchment-50' : 'text-ink-500',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}
