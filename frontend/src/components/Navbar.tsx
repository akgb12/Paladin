import { NavLink, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { useAuth } from '../auth/AuthContext'

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

        <div className="flex items-center gap-2">
          <Link to="/upload" className="hidden sm:inline-flex btn-primary text-sm !py-2 !px-3.5">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
            New Receipt
          </Link>
          <UserMenu />
        </div>

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

function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!user) return null

  const initials = (user.name || user.email || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 pl-1 pr-2 sm:pr-3 rounded-xl border-2 border-ink-900 bg-white shadow-brutal-sm hover:bg-parchment-50 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.pictureUrl ? (
          <img src={user.pictureUrl} alt="" className="h-7 w-7 rounded-lg object-cover border border-ink-900" />
        ) : (
          <span className="h-7 w-7 rounded-lg bg-gold-gradient border border-ink-900 flex items-center justify-center font-mono font-bold text-[11px] text-ink-900">
            {initials}
          </span>
        )}
        <span className="hidden md:inline text-xs font-mono font-bold uppercase tracking-wider text-ink-900 max-w-[7rem] truncate">
          {user.name || user.email || 'Knight'}
        </span>
        <svg className={cn('w-3 h-3 text-ink-500 transition', open && 'rotate-180')} viewBox="0 0 12 12" fill="currentColor">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border-2 border-ink-900 shadow-brutal overflow-hidden z-40">
          <div className="px-4 py-3 bg-parchment-50/60 border-b-2 border-ink-900/10">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500">Signed in as</p>
            <p className="text-sm font-bold text-ink-900 truncate">{user.name || 'Knight'}</p>
            {user.email && <p className="text-xs text-ink-500 truncate font-mono">{user.email}</p>}
          </div>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-ink-900 hover:bg-rose-50 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a2 2 0 012-2h6a2 2 0 012 2v2a1 1 0 11-2 0V4H5v12h6v-2a1 1 0 112 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              <path d="M14.293 6.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L15.586 11H9a1 1 0 110-2h6.586l-1.293-1.293a1 1 0 010-1.414z"/>
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
