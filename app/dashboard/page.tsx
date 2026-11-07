'use client'

import { useState } from 'react'
import Link from 'next/link'
import { merchantApi, paymentApi } from '@/lib/api'
import { useAppKitAccount } from '@reown/appkit/react'

export default function Dashboard() {
  const { address, isConnected } = useAppKitAccount()
  const [merchantData, setMerchantData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [creatingPayment, setCreatingPayment] = useState(false)

  // Form states
  const [merchantForm, setMerchantForm] = useState({
    name: '',
    email: '',
    webhook_url: '',
  })

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: '',
    order_id: '',
  })

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

    setLoading(true)
    try {
      const merchant = await merchantApi.create({
        name: merchantForm.name,
        email: merchantForm.email,
        payout_address: address,
        webhook_url: merchantForm.webhook_url || undefined,
      })
      setMerchantData(merchant)
      alert('Merchant created successfully!')
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!merchantData?.api_key) return

    setCreatingPayment(true)
    try {
      const payment = await paymentApi.create(
        {
          amount: parseFloat(paymentForm.amount),
          description: paymentForm.description,
          order_id: paymentForm.order_id || undefined,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/dashboard`,
        },
        merchantData.api_key
      )

      // Copy checkout URL to clipboard
      navigator.clipboard.writeText(payment.checkout_url || '')
      alert(`Payment link created! Copied to clipboard:\n${payment.checkout_url}`)

      // Reset form
      setPaymentForm({ amount: '', description: '', order_id: '' })
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.detail || error.message}`)
    } finally {
      setCreatingPayment(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to access the dashboard</p>
          <appkit-button />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              PayLink
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <appkit-button />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Merchant Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Merchant */}
          {!merchantData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create Merchant Account</h2>
              <form onSubmit={handleCreateMerchant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={merchantForm.name}
                    onChange={(e) => setMerchantForm({ ...merchantForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="My Business"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={merchantForm.email}
                    onChange={(e) => setMerchantForm({ ...merchantForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={merchantForm.webhook_url}
                    onChange={(e) => setMerchantForm({ ...merchantForm, webhook_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://your-app.com/webhook"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Merchant Account'}
                </button>
              </form>
            </div>
          )}

          {/* Merchant Info */}
          {merchantData && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Merchant Info</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="text-lg font-medium">{merchantData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium">{merchantData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payout Address</p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">{merchantData.payout_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">API Key</p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded break-all">{merchantData.api_key}</p>
                  </div>
                </div>
              </div>

              {/* Create Payment */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create Payment Link</h2>
                <form onSubmit={handleCreatePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (USDT)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="100.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentForm.description}
                      onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Payment for Order #123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={paymentForm.order_id}
                      onChange={(e) => setPaymentForm({ ...paymentForm, order_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="ORDER-123"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingPayment}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {creatingPayment ? 'Creating...' : 'Create Payment Link'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
