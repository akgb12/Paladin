import { useQuery } from '@apollo/client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Link } from 'react-router-dom'
import { GET_DASHBOARD_SUMMARY } from '../graphql/operations'
import { DashboardSummary } from '../lib/types'
import { formatCurrency, formatMonth } from '../lib/utils'
import MerchantAvatar from '../components/MerchantAvatar'
import CoinScene from '../components/CoinScene'

export default function Dashboard() {
  const { data, loading, error } = useQuery<{ dashboardSummary: DashboardSummary }>(GET_DASHBOARD_SUMMARY)

  if (loading) return <DashboardSkeleton />
  if (error) return <p className="text-rose-600 font-mono">ERROR: {error.message}</p>

  const summary = data!.dashboardSummary
  const chartData = summary.monthlySpend.map((m) => ({
    month: formatMonth(m.month),
    total: m.total,
  }))
  const topMerchants = summary.merchantSpend.slice(0, 5)
  const maxMerchantSpend = topMerchants[0]?.total ?? 1

  return (
    <div className="space-y-8">
      <Hero summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="tag-mono">// MONTHLY VAULT</span>
              <h2 className="font-display font-extrabold text-2xl text-ink-900 mt-1">Spend by Month</h2>
            </div>
            <span className="chip bg-ink-900 text-parchment-50">{chartData.length} months</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dcbf" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#4b4636', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11, fill: '#4b4636', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(245, 158, 11, 0.12)' }}
                  contentStyle={{ borderRadius: 12, border: '2px solid #0c0b08', boxShadow: '4px 4px 0 0 #0c0b08', fontFamily: 'JetBrains Mono', fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v), 'Total']}
                />
                <Bar dataKey="total" fill="url(#barFill)" radius={[6, 6, 0, 0]} stroke="#0c0b08" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>

        <div className="card p-6">
          <div className="mb-4">
            <span className="tag-mono">// TOP MERCHANTS</span>
            <h2 className="font-display font-extrabold text-2xl text-ink-900 mt-1">Hall of Spend</h2>
          </div>
          {topMerchants.length > 0 ? (
            <div className="space-y-4">
              {topMerchants.map((m, i) => (
                <div key={m.merchantNormalized}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-ink-400">#{String(i + 1).padStart(2, '0')}</span>
                      <MerchantAvatar name={m.merchantNormalized} size="sm" />
                      <span className="text-sm font-semibold text-ink-900 truncate">{m.merchantNormalized}</span>
                    </div>
                    <span className="text-sm font-bold text-ink-900 font-mono">{formatCurrency(m.total)}</span>
                  </div>
                  <div className="h-2 bg-parchment-100 rounded-full overflow-hidden border-2 border-ink-900">
                    <div
                      className="h-full bg-gold-gradient"
                      style={{ width: `${Math.max(8, (m.total / maxMerchantSpend) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500 font-mono">No merchants yet.</p>
          )}
        </div>
      </div>

      {summary.receiptCount === 0 && <EmptyHero />}

      <FeatureStrip />
    </div>
  )
}

function Hero({ summary }: { summary: DashboardSummary }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-ink-900 bg-ink-900 text-parchment-50 shadow-brutal-lg">
      <div className="absolute inset-0 bg-tile opacity-50" aria-hidden />
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold-500/40 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-mint-400/20 blur-3xl" />

      <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-6 p-8 sm:p-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-mint-300 text-ink-900 border-2 border-ink-900 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.18em] shadow-brutal-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-900 animate-pulse" />
            Vault is online
          </div>
          <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl leading-[1.05]">
            EVERY RECEIPT,<br />
            <span className="text-gradient-gold">FORGED IN GOLD.</span>
          </h1>
          <p className="mt-4 text-parchment-100/90 max-w-xl text-[15px] leading-relaxed">
            Drop a photo. We yank out the merchant, the date, the total, and every line item. Then we file it under your name. Forever.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/upload" className="btn-primary !text-base !py-3 !px-5">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
              Upload Receipt
            </Link>
            <Link to="/library" className="btn-secondary !text-base !py-3 !px-5 !bg-parchment-50">
              Browse Library →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <HeroStat label="Receipts" value={summary.receiptCount} />
            <HeroStat label="Merchants" value={summary.merchantCount} />
            <HeroStat label="Total Spend" value={formatCurrency(summary.totalSpend)} isMoney />
          </div>
        </div>

        <div className="relative min-h-[260px] lg:min-h-[340px]">
          <div className="absolute inset-0">
            <CoinScene />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-gold-300">
            ⟁ paladin gold
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroStat({ label, value, isMoney = false }: { label: string; value: string | number; isMoney?: boolean }) {
  return (
    <div className="bg-parchment-50 text-ink-900 border-2 border-ink-900 rounded-2xl p-4 shadow-brutal-sm">
      <p className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-ink-500">{label}</p>
      <p className={`mt-1 font-display font-extrabold ${isMoney ? 'text-xl' : 'text-3xl'} text-ink-900`}>{value}</p>
    </div>
  )
}

function FeatureStrip() {
  const features = [
    { icon: '⚔️', title: 'Mock Textract', desc: 'Receipts get extracted instantly with deterministic sample data.' },
    { icon: '🛡️', title: 'Guarded Storage', desc: 'Every image is filed away under your demo vault.' },
    { icon: '💰', title: 'Merchant Tally', desc: 'Auto-grouped by normalized merchant name and date.' },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {features.map((f) => (
        <div key={f.title} className="card p-5">
          <div className="text-3xl mb-2">{f.icon}</div>
          <p className="font-display font-extrabold text-ink-900 text-lg">{f.title}</p>
          <p className="text-sm text-ink-600 mt-1">{f.desc}</p>
        </div>
      ))}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[260px] flex flex-col items-center justify-center text-sm text-ink-500 font-mono border-2 border-dashed border-ink-300 rounded-xl">
      <span className="text-2xl mb-2">📜</span>
      No spending data yet — upload a receipt!
    </div>
  )
}

function EmptyHero() {
  return (
    <div className="card p-10 text-center relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-40 w-40 bg-gold-200 rounded-full blur-2xl opacity-60" />
      <div className="relative">
        <img src="/paladin-logo.png" alt="" className="h-24 mx-auto animate-floaty" />
        <h3 className="font-display font-extrabold text-2xl text-ink-900 mt-2">Forge your first receipt</h3>
        <p className="text-ink-600 mt-2 max-w-md mx-auto">
          Upload an image and the knight will extract every field automatically. No paper survives.
        </p>
        <Link to="/upload" className="btn-mint mt-5 inline-flex">Begin the quest →</Link>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-72 rounded-3xl bg-ink-100 border-2 border-ink-300" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-ink-100 border-2 border-ink-300" />
        <div className="h-80 rounded-2xl bg-ink-100 border-2 border-ink-300" />
      </div>
    </div>
  )
}
