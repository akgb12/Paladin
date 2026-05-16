import { useState, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { UPLOAD_RECEIPT, GET_RECEIPTS, GET_RECEIPT_GROUPS, GET_DASHBOARD_SUMMARY } from '../graphql/operations'
import { Receipt } from '../lib/types'
import { cn, formatCurrency, formatDate } from '../lib/utils'
import StatusBadge from '../components/StatusBadge'
import MerchantAvatar from '../components/MerchantAvatar'

export default function UploadReceipt() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<Receipt | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const [uploadReceipt, { loading, error }] = useMutation<{ uploadReceipt: Receipt }>(UPLOAD_RECEIPT, {
    refetchQueries: [GET_RECEIPTS, GET_RECEIPT_GROUPS, GET_DASHBOARD_SUMMARY],
  })

  function handleFile(f: File) {
    setFile(f)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !preview) return
    const base64 = preview.split(',')[1]
    const res = await uploadReceipt({
      variables: {
        input: {
          fileName: file.name,
          contentType: file.type || 'image/jpeg',
          base64Image: base64,
        },
      },
    })
    if (res.data) setResult(res.data.uploadReceipt)
  }

  function handleReset() {
    setFile(null)
    setPreview(null)
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="tag-mono">// STEP 01 — FEED THE KNIGHT</span>
          <h1 className="font-display font-extrabold text-4xl text-ink-900 mt-1">Upload a receipt</h1>
          <p className="text-ink-600 mt-1">Drop a photo. Walk away. The vault does the rest.</p>
        </div>
        <img src="/paladin-logo.png" alt="" className="h-20 hidden sm:block animate-floaty" />
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'relative rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition',
              dragOver
                ? 'border-mint-500 bg-mint-100 scale-[1.01]'
                : 'border-ink-900 hover:border-gold-600 hover:bg-gold-50',
            )}
          >
            {preview ? (
              <div className="p-6 flex items-center justify-center bg-parchment-100">
                <img src={preview} alt="Receipt preview" className="max-h-80 object-contain rounded-lg border-2 border-ink-900 shadow-brutal" />
              </div>
            ) : (
              <div className="py-16 px-6 text-center relative">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gold-gradient flex items-center justify-center border-2 border-ink-900 shadow-brutal mb-4 animate-floaty">
                  <svg className="w-8 h-8 text-ink-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
                  </svg>
                </div>
                <p className="font-display font-extrabold text-xl text-ink-900">DROP RECEIPT HERE</p>
                <p className="text-sm text-ink-600 mt-2 font-mono">or <span className="underline decoration-gold-500 decoration-2 underline-offset-2">click to browse</span> · PNG · JPG · WebP</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-ink-400 mt-4">⚔ MAX 10MB ⚔</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-parchment-100 rounded-xl border-2 border-ink-900">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-white border-2 border-ink-900 flex items-center justify-center text-ink-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink-900 truncate">{file.name}</p>
                  <p className="text-xs text-ink-500 font-mono">{(file.size / 1024).toFixed(1)} KB · {file.type}</p>
                </div>
              </div>
              <button type="button" onClick={handleReset} className="text-xs text-ink-600 hover:text-ink-900 font-mono uppercase tracking-wider font-bold">Remove</button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-100 border-2 border-rose-700 rounded-xl text-sm text-rose-800 font-mono">
              ⚠ ERROR: {error.message}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={!file || loading} className="btn-primary flex-1 !text-base !py-3">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                  </svg>
                  Extracting…
                </>
              ) : (
                <>
                  Upload & Extract
                  <span>⚔</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <ResultCard result={result} onReset={handleReset} onView={() => navigate(`/receipts/${result.id}`)} />
      )}
    </div>
  )
}

function ResultCard({ result, onReset, onView }: { result: Receipt; onReset: () => void; onView: () => void }) {
  const currency = result.currency ?? 'USD'
  return (
    <div className="card overflow-hidden">
      <div className="p-6 sm:p-8 bg-mint-100 border-b-2 border-ink-900 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-9xl rotate-12 opacity-10">✓</div>
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <MerchantAvatar name={result.merchantNormalized} size="lg" />
            <div>
              <p className="tag-mono text-mint-600">// EXTRACTION COMPLETE</p>
              <h2 className="font-display font-extrabold text-3xl text-ink-900 mt-0.5">{result.merchantNormalized}</h2>
              <p className="text-sm text-ink-700 font-mono">{formatDate(result.receiptDate)}</p>
            </div>
          </div>
          <StatusBadge status={result.status} />
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Subtotal" value={formatCurrency(result.subtotal, currency)} />
          <Stat label="Tax" value={formatCurrency(result.tax, currency)} />
          <Stat label="Total" value={formatCurrency(result.total, currency)} accent />
          <Stat label="Confidence" value={result.confidence != null ? `${(result.confidence * 100).toFixed(0)}%` : '—'} />
        </div>

        {result.items.length > 0 && (
          <div>
            <p className="label">Line Items</p>
            <div className="rounded-xl border-2 border-ink-900 overflow-hidden divide-y-2 divide-ink-200">
              {result.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm bg-white hover:bg-parchment-100/60 transition">
                  <div>
                    <p className="text-ink-900 font-semibold">{item.name}</p>
                    <p className="text-xs text-ink-500 font-mono">Qty {item.quantity ?? 1} · {formatCurrency(item.unitPrice)} ea</p>
                  </div>
                  <span className="text-ink-900 font-bold font-mono">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={onView} className="btn-primary flex-1">
            View Full Receipt →
          </button>
          <button onClick={onReset} className="btn-secondary">
            Upload Another
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      'rounded-xl p-3 border-2 border-ink-900',
      accent ? 'bg-gold-gradient shadow-brutal-sm' : 'bg-parchment-100',
    )}>
      <p className="text-[10px] uppercase tracking-[0.18em] font-bold font-mono text-ink-700">{label}</p>
      <p className={cn('mt-0.5 font-display font-extrabold text-ink-900', accent ? 'text-xl' : 'text-base')}>{value}</p>
    </div>
  )
}
