import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UploadReceipt from './pages/UploadReceipt'
import ReceiptLibrary from './pages/ReceiptLibrary'
import ReceiptDetail from './pages/ReceiptDetail'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadReceipt />} />
        <Route path="/library" element={<ReceiptLibrary />} />
        <Route path="/receipts/:id" element={<ReceiptDetail />} />
      </Route>
    </Routes>
  )
}
