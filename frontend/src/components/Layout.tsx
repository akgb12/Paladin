import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const marqueeItems = [
  'KEEP YOUR RECEIPTS',
  '✦',
  'GUARD YOUR GOLD',
  '✦',
  'STORE EVERY DOLLAR',
  '✦',
  'NO MORE SHOEBOXES',
  '✦',
  'BUILT FOR HOARDERS OF PAPER',
  '✦',
  'A KNIGHT FOR YOUR FINANCES',
  '✦',
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        <Outlet />
      </main>

      <div className="bg-ink-900 text-parchment-50 border-y-2 border-ink-900 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-3">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex items-center gap-6 pr-6 shrink-0">
              {marqueeItems.map((item, i) => (
                <span key={`${dup}-${i}`} className={
                  item === '✦'
                    ? 'text-gold-400 text-xl'
                    : 'font-mono font-bold tracking-[0.3em] text-sm'
                }>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-parchment-50/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-ink-500 flex items-center justify-between">
          <span>Paladin · Receipt Vault</span>
          <span>Local Build · v0.1</span>
        </div>
      </footer>
    </div>
  )
}
