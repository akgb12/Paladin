import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UploadReceipt from './pages/UploadReceipt'
import ReceiptLibrary from './pages/ReceiptLibrary'
import ReceiptDetail from './pages/ReceiptDetail'
import Login from './pages/Login'
import { useAuth } from './auth/AuthContext'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 animate-pulse">Loading vault…</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadReceipt />} />
        <Route path="/library" element={<ReceiptLibrary />} />
        <Route path="/receipts/:id" element={<ReceiptDetail />} />
      </Route>
    </Routes>
  )
}
