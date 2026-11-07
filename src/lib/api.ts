import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Merchant {
  id: string
  name: string
  email: string
  payout_address: string
  webhook_url?: string
  api_key: string
  created_at: string
}

export interface Payment {
  id: string
  payment_id: string
  merchant_id: string
  amount: string
  currency: string
  customer_wallet?: string
  merchant_wallet: string
  status: 'created' | 'pending' | 'confirmed' | 'failed' | 'expired'
  order_id?: string
  description?: string
  payment_metadata?: string
  checkout_url?: string
  success_url?: string
  cancel_url?: string
  tx_hash?: string
  block_number?: string
  expires_at?: string
  confirmed_at?: string
  created_at: string
  updated_at: string
}

// API functions
export const merchantApi = {
  create: async (data: { name: string; email: string; payout_address: string; webhook_url?: string }) => {
    const response = await api.post<Merchant>('/merchants/', data)
    return response.data
  },

  get: async (merchantId: string) => {
    const response = await api.get<Merchant>(`/merchants/${merchantId}`)
    return response.data
  },
}

export const paymentApi = {
  create: async (data: {
    amount: number
    currency?: string
    order_id?: string
    description?: string
    metadata?: Record<string, any>
    success_url?: string
    cancel_url?: string
  }, apiKey: string) => {
    const response = await api.post<Payment>('/payments/', data, {
      headers: {
        'X-API-Key': apiKey,
      },
    })
    return response.data
  },

  getStatus: async (paymentId: string) => {
    const response = await api.get<Payment>(`/payments/${paymentId}/status`)
    return response.data
  },

  confirm: async (paymentId: string, txHash: string) => {
    const response = await api.post<Payment>(`/payments/${paymentId}/confirm`, {
      tx_hash: txHash,
    })
    return response.data
  },
}

export const healthApi = {
  check: async () => {
    const response = await api.get<{ status: string; blockchain_connected: boolean; chain_id: number }>('/health')
    return response.data
  },
}
