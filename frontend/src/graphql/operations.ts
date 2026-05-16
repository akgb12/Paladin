import { gql } from '@apollo/client'

export const RECEIPT_FIELDS = gql`
  fragment ReceiptFields on Receipt {
    id
    merchantRaw
    merchantNormalized
    receiptDate
    uploadTimestamp
    subtotal
    tax
    total
    currency
    imageUrl
    imageStorageKey
    status
    confidence
    manuallyCorrected
    items {
      name
      quantity
      unitPrice
      totalPrice
    }
  }
`

export const GET_RECEIPTS = gql`
  ${RECEIPT_FIELDS}
  query GetReceipts {
    receipts {
      ...ReceiptFields
    }
  }
`

export const GET_RECEIPT = gql`
  ${RECEIPT_FIELDS}
  query GetReceipt($id: ID!) {
    receipt(id: $id) {
      ...ReceiptFields
    }
  }
`

export const GET_RECEIPT_GROUPS = gql`
  ${RECEIPT_FIELDS}
  query GetReceiptGroups {
    receiptGroups {
      merchantNormalized
      count
      totalSpend
      receipts {
        ...ReceiptFields
      }
    }
  }
`

export const SEARCH_RECEIPTS = gql`
  ${RECEIPT_FIELDS}
  query SearchReceipts($input: ReceiptSearchInput!) {
    searchReceipts(input: $input) {
      ...ReceiptFields
    }
  }
`

export const GET_DASHBOARD_SUMMARY = gql`
  query GetDashboardSummary {
    dashboardSummary {
      receiptCount
      merchantCount
      totalSpend
      monthlySpend {
        month
        total
      }
      merchantSpend {
        merchantNormalized
        total
      }
    }
  }
`

export const UPLOAD_RECEIPT = gql`
  ${RECEIPT_FIELDS}
  mutation UploadReceipt($input: UploadReceiptInput!) {
    uploadReceipt(input: $input) {
      ...ReceiptFields
    }
  }
`

export const UPDATE_RECEIPT = gql`
  ${RECEIPT_FIELDS}
  mutation UpdateReceipt($input: UpdateReceiptInput!) {
    updateReceipt(input: $input) {
      ...ReceiptFields
    }
  }
`

export const DELETE_RECEIPT = gql`
  mutation DeleteReceipt($id: ID!) {
    deleteReceipt(id: $id)
  }
`
