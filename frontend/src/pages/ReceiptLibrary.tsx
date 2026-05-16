import { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GET_RECEIPT_GROUPS, SEARCH_RECEIPTS } from '../graphql/operations'
import { Receipt, ReceiptGroup } from '../lib/types'
import { formatCurrency, formatDate } from '../lib/utils'
import StatusBadge from '../components/StatusBadge'
import MerchantAvatar from '../components/MerchantAvatar'

export default function ReceiptLibrary() {
  const [search, setSearch] = useState({ merchant: '', itemName: '', startDate: '', endDate: '', minTotal: '', maxTotal: '' })
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { data: groupData, loading: groupLoading } = useQuery<{ receiptGroups: ReceiptGroup[] }>(GET_RECEIPT_GROUPS)
  const [searchReceipts, { data: searchData, loading: searchLoading }] = useLazyQuery<{ searchReceipts: Receipt[] }>(SEARCH_RECEIPTS)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const input: Record<string, string | number> = {}
    if (search.merchant) input.merchant = search.merchant
    if (search.itemName) input.itemName = search.itemName
    if (search.startDate) input.startDate = search.startDate
    if (search.endDate) input.endDate = search.endDate
    if (search.minTotal) input.minTotal = parseFloat(search.minTotal)
    if (search.maxTotal) input.maxTotal = parseFloat(search.maxTotal)
    searchReceipts({ variables: { input } })
    setIsSearching(true)
  }

  function handleClear() {
    setSearch({ merchant: '', itemName: '', startDate: '', endDate: '', minTotal: '', maxTotal: '' })
    setIsSearching(false)
  }

  const loading = groupLoading || searchLoading

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="tag-mono">// THE VAULT</span>
          <h1 className="font-display font-extrabold text-4xl text-ink-900 mt-1">Receipt Library</h1>
          <p className="text-ink-600 mt-1">Every paper trail, sorted and stamped.</p>
        </div>
        <Link to="/upload" className="btn-primary text-sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
          New Receipt
        </Link>
      </div>

      <form onSubmit={handleSearch} className="card p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              className="input pl-9 font-mono"
              placeholder="Search merchant…"
              value={search.merchant}
              onChange={(e) => setSearch({ ...search, merchant: e.target.value })}
            />
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-secondary text-sm !py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.828V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.172a1 1 0 00-.293-.707L1.293 6.707A1 1 0 011 6V4z" />
            </svg>
            Filters
          </button>
          <button type="submit" className="btn-mint text-sm !py-2">Search</button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t-2 border-dashed border-ink-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Item name</label>
              <input className="input" placeholder="e.g. Notebook" value={search.itemName} onChange={(e) => setSearch({ ...search, itemName: e.target.value })} />
            </div>
            <div>
              <label className="label">Start date</label>
              <input type="date" className="input" value={search.startDate} onChange={(e) => setSearch({ ...search, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label">End date</label>
              <input type="date" className="input" value={search.endDate} onChange={(e) => setSearch({ ...search, endDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Min total ($)</label>
              <input className="input" placeholder="0" type="number" step="0.01" value={search.minTotal} onChange={(e) => setSearch({ ...search, minTotal: e.target.value })} />
            </div>
            <div>
              <label className="label">Max total ($)</label>
              <input className="input" placeholder="999" type="number" step="0.01" value={search.maxTotal} onChange={(e) => setSearch({ ...search, maxTotal: e.target.value })} />
            </div>
            <div className="flex items-end">
              {isSearching && (
                <button type="button" onClick={handleClear} className="btn-ghost text-sm font-mono uppercase">Clear filters</button>
              )}
            </div>
          </div>
        )}
      </form>

      {loading && <LibrarySkeleton />}

      {!loading && isSearching && searchData && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b-2 border-ink-900 bg-mint-100 flex items-center justify-between">
            <p className="font-mono text-sm font-bold text-ink-900">
              {searchData.searchReceipts.length} RESULT{searchData.searchReceipts.length !== 1 ? 'S' : ''}
            </p>
            <button onClick={handleClear} className="text-xs text-ink-700 hover:text-ink-900 font-mono font-bold uppercase tracking-wider">Clear</button>
          </div>
          {searchData.searchReceipts.length === 0 ? (
            <p className="text-ink-500 text-sm p-8 text-center font-mono">No receipts matched.</p>
          ) : (
            <ReceiptTable receipts={searchData.searchReceipts} />
          )}
        </div>
      )}

      {!loading && !isSearching && (
        <>
          {groupData?.receiptGroups.length === 0 ? (
            <div className="card p-12 text-center">
              <img src="/paladin-logo.png" alt="" className="h-24 mx-auto animate-floaty" />
              <p className="font-display font-extrabold text-xl text-ink-900 mt-3">The vault is empty.</p>
              <p className="text-ink-600 mt-1">Drop in your first receipt — the knight is waiting.</p>
              <Link to="/upload" className="btn-mint inline-flex mt-4">Upload now →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {groupData?.receiptGroups.map((group) => (
                <MerchantGroupCard key={group.merchantNormalized} group={group} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MerchantGroupCard({ group }: { group: ReceiptGroup }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b-2 border-ink-900 flex items-center justify-between gap-3 bg-parchment-100">
        <div className="flex items-center gap-3 min-w-0">
          <MerchantAvatar name={group.merchantNormalized} />
          <div className="min-w-0">
            <h2 className="font-display font-extrabold text-ink-900 text-lg truncate">{group.merchantNormalized}</h2>
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-500">{group.count} RECEIPT{group.count !== 1 ? 'S' : ''}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-extrabold text-xl text-ink-900">{formatCurrency(group.totalSpend)}</p>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-500">Total Spend</p>
        </div>
      </div>
      <ReceiptTable receipts={group.receipts} />
    </div>
  )
}

function ReceiptTable({ receipts }: { receipts: Receipt[] }) {
  return (
    <div className="divide-y-2 divide-ink-100">
      {receipts.map((r) => (
        <Link
          key={r.id}
          to={`/receipts/${r.id}`}
          className="flex items-center gap-4 px-5 py-3.5 hover:bg-gold-50 transition group"
        >
          <div className="w-24 text-xs text-ink-700 font-mono font-bold">{formatDate(r.receiptDate)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-900 group-hover:text-gold-700 truncate">
              {r.merchantNormalized}
            </p>
            {r.merchantRaw && r.merchantRaw !== r.merchantNormalized && (
              <p className="text-xs text-ink-400 font-mono truncate">{r.merchantRaw}</p>
            )}
          </div>
          <StatusBadge status={r.status} />
          <div className="w-24 text-right font-bold text-ink-900 font-mono">{formatCurrency(r.total)}</div>
          <svg className="w-4 h-4 text-ink-400 group-hover:text-gold-700 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  )
}

function LibrarySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="h-32 rounded-2xl bg-ink-100 border-2 border-ink-300" />
      ))}
    </div>
  )
}
