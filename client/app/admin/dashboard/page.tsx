'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiPackage, FiDollarSign, FiShoppingBag, FiImage, FiLogOut, FiMenu, FiX, FiHome, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle, FiEye, FiTrash2 } from 'react-icons/fi'
import { apiClient } from '@/lib/api'

interface OrderItem {
  id: string
  type: string
  name: string
  price: number
  quantity: number
  image: string
  details?: any
}

interface Order {
  id: number
  customer_name: string
  phone: string
  address: string
  postal_code: string
  city: string
  state: string
  landmark?: string
  items: OrderItem[]
  subtotal: number
  delivery_charges: number
  total: number
  status: string
  created_at: string
}

interface Revenue {
  total_revenue: number
  pending_orders: number
  completed_orders: number
  total_orders: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [revenue, setRevenue] = useState<Revenue | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    verifyAdmin()
  }, [])

  const verifyAdmin = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      console.log('Token from storage:', token ? 'exists' : 'missing')
      
      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/login')
        return
      }
      
      const response = await apiClient.verifyAdmin()
      console.log('Verify response:', response.data)
      fetchData()
    } catch (error) {
      console.error('Verification error:', error)
      localStorage.removeItem('admin_token')
      router.push('/login')
    }
  }

  const fetchData = async () => {
    try {
      const [ordersRes, revenueRes] = await Promise.all([
        apiClient.getOrders(),
        apiClient.getRevenue()
      ])
      setOrders(ordersRes.data)
      setRevenue(revenueRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await apiClient.updateOrderStatus(orderId.toString(), status)
      fetchData()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      await apiClient.deleteOrder(orderId.toString())
      fetchData()
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/login')
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const closeModal = () => {
    setShowOrderModal(false)
    setSelectedOrder(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'pending')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 shadow-2xl transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FiShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Darven</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md"
            >
              <FiHome className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FiShoppingBag className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </Link>

            <Link
              href="/admin/fabrics"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FiPackage className="w-5 h-5" />
              <span className="font-medium">Fabrics</span>
            </Link>

            <Link
              href="/admin/custom-fabrics"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FiPackage className="w-5 h-5" />
              <span className="font-medium">Custom Stitch</span>
            </Link>

            <Link
              href="/admin/landing"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FiImage className="w-5 h-5" />
              <span className="font-medium">Landing Images</span>
            </Link>
          </nav>

          <nav className="mt-6 space-y-1">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Size Management
            </h3>
            <Link
              href="/admin/sizes"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FiPackage className="w-5 h-5" />
              <span className="font-medium">Size Charts</span>
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Online</span>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Revenue Card */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
                <FiTrendingUp className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-white">
                Rs {revenue?.total_revenue.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                  {revenue?.pending_orders || 0}
                </span>
              </div>
              <p className="text-yellow-100 text-sm font-medium mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-white">
                {revenue?.pending_orders || 0}
              </p>
            </div>
          </div>

          {/* Completed Orders Card */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                  {revenue?.completed_orders || 0}
                </span>
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Completed Orders</p>
              <p className="text-3xl font-bold text-white">
                {revenue?.completed_orders || 0}
              </p>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-white" />
                </div>
                <FiTrendingUp className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-white">
                {revenue?.total_orders || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Now removed as navigation is in sidebar */}

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all customer orders</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                  {orders.length} Total
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {order.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customer_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {order.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        Rs {order.total.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status.toLowerCase()}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-2 ${
                          order.status.toLowerCase() === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                            : order.status.toLowerCase() === 'completed'
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        }`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="completed">✓ Completed</option>
                        <option value="cancelled">✗ Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium hover:shadow-md"
                        >
                          <FiEye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium hover:shadow-md"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <FiPackage className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No orders yet</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Orders will appear here once customers place them</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Order #{selectedOrder.id}
                </h2>
                <p className="text-blue-100 text-sm mt-1">Complete order information</p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white hover:rotate-90"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Customer Information */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedOrder.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Customer Information
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery details</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">City</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">State</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Postal Code</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.postal_code}</p>
                  </div>
                  {selectedOrder.landmark && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Landmark</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.landmark}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">Type: {item.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Price: Rs {item.price.toLocaleString()} × {item.quantity}
                        </p>
                        
                        {/* Display details based on type */}
                        {item.details && item.type === 'ready-made' && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>Material: {item.details.material}</p>
                            <p>Size: {item.details.size}</p>
                          </div>
                        )}
                        
                        {item.details && item.type === 'fabric' && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>Material: {item.details.material}</p>
                            <p>Length: {item.details.length} meters</p>
                            {item.details.price_per_meter && (
                              <p>Price per meter: Rs {item.details.price_per_meter.toLocaleString()}</p>
                            )}
                          </div>
                        )}
                        
                        {item.details && item.type === 'custom' && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>Fabric: {item.details.fabric}</p>
                            <p>Material: {item.details.material}</p>
                            {item.details.color && (
                              <p className="font-medium">Color: <span className="text-gray-900 dark:text-white">{item.details.color}</span></p>
                            )}
                            {item.details.measurements && (
                              <details className="mt-2 cursor-pointer">
                                <summary className="font-medium hover:text-gray-900 dark:hover:text-white">
                                  📏 View Measurements
                                </summary>
                                <div className="mt-2 pl-4 space-y-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                                  <p>Neck: {item.details.measurements.neck}"</p>
                                  <p>Shoulder: {item.details.measurements.shoulder}"</p>
                                  <p>Chest: {item.details.measurements.chest}"</p>
                                  <p>Sleeve: {item.details.measurements.sleeve}"</p>
                                  <p>Height: {item.details.measurements.height}"</p>
                                  <p>Biceps: {item.details.measurements.biceps}"</p>
                                  <p>Waist: {item.details.measurements.waist}"</p>
                                  <p>Trouser Height: {item.details.measurements.trouser_height}"</p>
                                </div>
                              </details>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Order Summary
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Rs {selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Delivery Charges</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Rs {selectedOrder.delivery_charges.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">
                      Rs {selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.status.toLowerCase() === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : selectedOrder.status.toLowerCase() === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
