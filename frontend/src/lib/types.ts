export interface User {
  id: string
  email: string | null
  name: string | null
  pictureUrl: string | null
  provider: string | null
}

export interface AuthConfig {
  googleEnabled: boolean
  devLoginEnabled: boolean
}

export interface ReceiptItem {
  name: string
  quantity: number | null
  unitPrice: number | null
  totalPrice: number | null
}

export interface Receipt {
  id: string
  merchantRaw: string | null
  merchantNormalized: string
  receiptDate: string | null
  uploadTimestamp: string
  subtotal: number | null
  tax: number | null
  total: number | null
  currency: string | null
  imageUrl: string | null
  imageStorageKey: string
  status: string
  confidence: number | null
  manuallyCorrected: boolean
  items: ReceiptItem[]
}

export interface ReceiptGroup {
  merchantNormalized: string
  receipts: Receipt[]
  count: number
  totalSpend: number
}

export interface MonthlySpend {
  month: string
  total: number
}

export interface MerchantSpend {
  merchantNormalized: string
  total: number
}

export interface DashboardSummary {
  receiptCount: number
  merchantCount: number
  totalSpend: number
  monthlySpend: MonthlySpend[]
  merchantSpend: MerchantSpend[]
}
