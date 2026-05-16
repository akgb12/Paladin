import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { GET_RECEIPT, UPDATE_RECEIPT, DELETE_RECEIPT, GET_RECEIPTS, GET_RECEIPT_GROUPS, GET_DASHBOARD_SUMMARY } from '../graphql/operations'
import { Receipt, ReceiptItem } from '../lib/types'
import { cn, formatCurrency, formatDate } from '../lib/utils'
import StatusBadge from '../components/StatusBadge'
import MerchantAvatar from '../components/MerchantAvatar'

export default function ReceiptDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<Receipt> | null>(null)

  const { data, loading, error } = useQuery<{ receipt: Receipt }>(GET_RECEIPT, {
    variables: { id },
    onCompleted: (d) => {
      if (d.receipt) setForm({ ...d.receipt })
    },
  })

  const [updateReceipt, { loading: saving }] = useMutation(UPDATE_RECEIPT, {
    refetchQueries: [{ query: GET_RECEIPT, variables: { id } }, GET_RECEIPTS, GET_RECEIPT_GROUPS, GET_DASHBOARD_SUMMARY],
    onCompleted: () => setEditing(false),
  })

  const [deleteReceipt] = useMutation(DELETE_RECEIPT, {
    refetchQueries: [GET_RECEIPTS, GET_RECEIPT_GROUPS, GET_DASHBOARD_SUMMARY],
    onCompleted: () => navigate('/library'),
  })

  if (loading) return <DetailSkeleton />
  if (error) return <p className="text-rose-600 font-mono">ERROR: {error.message}</p>
  if (!data?.receipt) return <p className="text-ink-500 font-mono">Receipt not found.</p>

  const receipt = data.receipt
  const currency = receipt.currency ?? 'USD'

  function handleSave() {
    if (!form) return
    updateReceipt({
      variables: {
        input: {
          id: receipt.id,
          merchantNormalized: form.merchantNormalized,
          receiptDate: form.receiptDate,
          subtotal: form.subtotal != null ? Number(form.subtotal) : undefined,
          tax: form.tax != null ? Number(form.tax) : undefined,
          total: form.total != null ? Number(form.total) : undefined,
          currency: form.currency,
          items: form.items?.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    })
  }

  function updateItem(index: number, field: keyof ReceiptItem, value: string) {
    if (!form?.items) return
    const updated = form.items.map((item, i) => {
      if (i !== index) return item
      const numFields: (keyof ReceiptItem)[] = ['quantity', 'unitPrice', 'totalPrice']
      return { ...item, [field]: numFields.includes(field) ? (value === '' ? null : parseFloat(value)) : value }
    })
    setForm({ ...form, items: updated })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/library" className="btn-ghost text-sm font-mono uppercase font-bold tracking-wider">
          ← Back to vault
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={receipt.status} />
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="btn-secondary text-sm !py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => { if (confirm('Delete this receipt?')) deleteReceipt({ variables: { id: receipt.id } }) }}
                className="btn-danger text-sm !py-2"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} disabled={saving} className="btn-mint text-sm !py-2">
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button onClick={() => { setEditing(false); setForm({ ...receipt }) }} className="btn-secondary text-sm !py-2">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl border-2 border-ink-900 bg-ink-900 text-parchment-50 shadow-brutal-lg">
        <div className="absolute inset-0 bg-tile opacity-50" aria-hidden />
        <div className="absolute -top-20 -right-16 h-60 w-60 rounded-full bg-gold-500/40 blur-3xl" />
        <div className="absolute -bottom-16 left-0 h-52 w-52 rounded-full bg-mint-400/15 blur-3xl" />

        <div className="relative p-8">
          <div className="flex items-center gap-5">
            <MerchantAvatar name={receipt.merchantNormalized} size="lg" />
            <div className="min-w-0">
              <p className="tag-mono text-gold-300">// {receipt.id}</p>
              <h1 className="font-display font-extrabold text-4xl mt-1 leading-tight">{receipt.merchantNormalized}</h1>
              <p className="text-parchment-100/80 text-sm mt-1 font-mono">
                {formatDate(receipt.receiptDate)}
                {receipt.merchantRaw && receipt.merchantRaw !== receipt.merchantNormalized && (
                  <> · <span className="text-parchment-200/60">{receipt.merchantRaw}</span></>
                )}
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <HeroStat label="Subtotal" value={formatCurrency(receipt.subtotal, currency)} />
            <HeroStat label="Tax" value={formatCurrency(receipt.tax, currency)} />
            <HeroStat label="Total" value={formatCurrency(receipt.total, currency)} accent />
            <HeroStat label="Confidence" value={receipt.confidence != null ? `${(receipt.confidence * 100).toFixed(0)}%` : '—'} />
          </div>
        </div>
      </section>

      <div className="card p-6 sm:p-8 space-y-6">
        <div>
          <span className="tag-mono">// CORE FIELDS</span>
          <h2 className="font-display font-extrabold text-2xl text-ink-900 mt-1">Details</h2>
          <p className="text-sm text-ink-600 font-mono">Anything wrong? Hit edit and fix it.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
          <EditableField
            label="Merchant"
            value={form?.merchantNormalized ?? ''}
            editing={editing}
            onChange={(v) => setForm({ ...form, merchantNormalized: v })}
          />
          <EditableField
            label="Receipt Date"
            value={form?.receiptDate ?? ''}
            editing={editing}
            type="date"
            displayValue={formatDate(receipt.receiptDate)}
            onChange={(v) => setForm({ ...form, receiptDate: v })}
          />
          <EditableField
            label="Currency"
            value={form?.currency ?? ''}
            editing={editing}
            onChange={(v) => setForm({ ...form, currency: v })}
          />
          <EditableField
            label="Subtotal"
            value={form?.subtotal != null ? String(form.subtotal) : ''}
            editing={editing}
            type="number"
            displayValue={formatCurrency(receipt.subtotal, currency)}
            onChange={(v) => setForm({ ...form, subtotal: v === '' ? null : parseFloat(v) })}
          />
          <EditableField
            label="Tax"
            value={form?.tax != null ? String(form.tax) : ''}
            editing={editing}
            type="number"
            displayValue={formatCurrency(receipt.tax, currency)}
            onChange={(v) => setForm({ ...form, tax: v === '' ? null : parseFloat(v) })}
          />
          <EditableField
            label="Total"
            value={form?.total != null ? String(form.total) : ''}
            editing={editing}
            type="number"
            displayValue={formatCurrency(receipt.total, currency)}
            onChange={(v) => setForm({ ...form, total: v === '' ? null : parseFloat(v) })}
          />
        </div>
      </div>

      {(form?.items ?? receipt.items).length > 0 && (
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="tag-mono">// LINE ITEMS</span>
              <h2 className="font-display font-extrabold text-2xl text-ink-900 mt-1">The Haul</h2>
              <p className="text-sm text-ink-600 font-mono">{(form?.items ?? receipt.items).length} items</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-ink-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-parchment-100 border-b-2 border-ink-900">
                <tr className="text-left text-ink-700">
                  <th className="px-4 py-2.5 font-mono font-bold text-[10px] uppercase tracking-wider">Item</th>
                  <th className="px-3 py-2.5 font-mono font-bold text-[10px] uppercase tracking-wider text-right w-20">Qty</th>
                  <th className="px-3 py-2.5 font-mono font-bold text-[10px] uppercase tracking-wider text-right w-24">Unit</th>
                  <th className="px-4 py-2.5 font-mono font-bold text-[10px] uppercase tracking-wider text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink-100">
                {(form?.items ?? receipt.items).map((item, i) => (
                  <tr key={i} className="bg-white hover:bg-gold-50 transition">
                    {editing ? (
                      <>
                        <td className="px-4 py-2"><input className="input !py-1.5" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="input !py-1.5 text-right" type="number" value={item.quantity ?? ''} onChange={(e) => updateItem(i, 'quantity', e.target.value)} /></td>
                        <td className="px-3 py-2"><input className="input !py-1.5 text-right" type="number" step="0.01" value={item.unitPrice ?? ''} onChange={(e) => updateItem(i, 'unitPrice', e.target.value)} /></td>
                        <td className="px-4 py-2"><input className="input !py-1.5 text-right font-bold" type="number" step="0.01" value={item.totalPrice ?? ''} onChange={(e) => updateItem(i, 'totalPrice', e.target.value)} /></td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2.5 text-ink-900 font-semibold">{item.name}</td>
                        <td className="px-3 py-2.5 text-right text-ink-700 font-mono">{item.quantity ?? 1}</td>
                        <td className="px-3 py-2.5 text-right text-ink-700 font-mono">{formatCurrency(item.unitPrice, currency)}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-ink-900 font-mono">{formatCurrency(item.totalPrice, currency)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Meta label="Receipt ID" value={receipt.id} mono />
        <Meta label="Storage key" value={receipt.imageStorageKey} mono />
        <Meta label="Uploaded" value={new Date(receipt.uploadTimestamp).toLocaleString()} />
      </div>
    </div>
  )
}

function HeroStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      'rounded-2xl p-3 border-2 border-ink-900',
      accent ? 'bg-gold-gradient text-ink-900' : 'bg-parchment-50 text-ink-900',
    )}>
      <p className="text-[10px] uppercase tracking-[0.18em] font-bold font-mono text-ink-700">{label}</p>
      <p className={cn('mt-0.5 font-display font-extrabold', accent ? 'text-xl' : 'text-base')}>{value}</p>
    </div>
  )
}

interface EditableFieldProps {
  label: string
  value: string
  editing: boolean
  type?: string
  displayValue?: string
  onChange: (v: string) => void
}

function EditableField({ label, value, editing, type = 'text', displayValue, onChange }: EditableFieldProps) {
  return (
    <div>
      <p className="label">{label}</p>
      {editing ? (
        <input
          type={type}
          step={type === 'number' ? '0.01' : undefined}
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-ink-900 font-semibold font-mono">{(displayValue ?? value) || '—'}</p>
      )}
    </div>
  )
}

function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="label !mb-0.5">{label}</p>
      <p className={cn('truncate text-xs', mono ? 'font-mono text-ink-700' : 'text-ink-800')}>{value}</p>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="h-44 rounded-3xl bg-ink-100 border-2 border-ink-300" />
      <div className="h-60 rounded-2xl bg-ink-100 border-2 border-ink-300" />
      <div className="h-40 rounded-2xl bg-ink-100 border-2 border-ink-300" />
    </div>
  )
}
