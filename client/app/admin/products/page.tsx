'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  description: string
  price: number
  material: string
  fabric_category?: string
  size: string
  colors?: string[]
  images: string[]
  stock: number
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    material: '',
    fabric_category: '',
    size: '',
    stock: ''
  })
  const [colors, setColors] = useState<string[]>([])
  const [colorInput, setColorInput] = useState('')
  
  const fabricCategories = ['Wash n Wear', 'Blended', 'Boski', 'Soft Cotton', 'Giza Moon Cotton']
  const [files, setFiles] = useState<FileList | null>(null)

  useEffect(() => {
    verifyAdmin()
  }, [])

  const verifyAdmin = async () => {
    try {
      await apiClient.api.get('/admin/verify')
      fetchProducts()
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getReadyMadeProducts()
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('material', formData.material)
      if (formData.fabric_category) {
        data.append('fabric_category', formData.fabric_category)
      }
      data.append('size', formData.size)
      data.append('stock', formData.stock)
      
      if (colors.length > 0) {
        data.append('colors', JSON.stringify(colors))
      } else {
        data.append('colors', JSON.stringify([]))
      }

      if (files) {
        Array.from(files).forEach((file) => {
          data.append('files', file)
        })
      }

      if (editingProduct) {
        await apiClient.updateReadyMadeProduct(editingProduct.id.toString(), data)
      } else {
        await apiClient.createReadyMadeProduct(data)
      }

      setShowForm(false)
      setEditingProduct(null)
      setFormData({ name: '', description: '', price: '', material: '', fabric_category: '', size: '', stock: '' })
      setColors([])
      setColorInput('')
      setFiles(null)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      material: product.material,
      fabric_category: product.fabric_category || '',
      size: product.size,
      stock: product.stock.toString()
    })
    setColors(product.colors || [])
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await apiClient.deleteReadyMadeProduct(id.toString())
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  if (loading && !showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
      <header className="bg-white dark:bg-dark-surface shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg">
              <FiArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Manage Products
            </h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              <FiPlus />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto bg-white dark:bg-dark-surface rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  placeholder="e.g., Premium Black Suit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (Rs) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Material *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    placeholder="e.g., Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    placeholder="e.g., M, L, XL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fabric Category (Optional)
                </label>
                <select
                  value={formData.fabric_category}
                  onChange={(e) => setFormData({ ...formData, fabric_category: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                >
                  <option value="">Select category...</option>
                  {fabricCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Colors (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (colorInput.trim() && !colors.includes(colorInput.trim())) {
                          setColors([...colors, colorInput.trim()])
                          setColorInput('')
                        }
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    placeholder="Press Enter to add"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (colorInput.trim() && !colors.includes(colorInput.trim())) {
                        setColors([...colors, colorInput.trim()])
                        setColorInput('')
                      }
                    }}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    {colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => setColors(colors.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Images * {editingProduct && '(Leave empty to keep existing)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required={!editingProduct}
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    setFormData({ name: '', description: '', price: '', material: '', fabric_category: '', size: '', stock: '' })
                    setColors([])
                    setColorInput('')
                    setFiles(null)
                  }}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
                <div className="relative aspect-[3/4] bg-gray-50 dark:bg-gray-900">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      +{product.images.length - 1} more
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      Rs {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Stock: {product.stock}
                    </span>
                  </div>
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Colors ({product.colors.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {product.colors.slice(0, 3).map((color, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 rounded"
                          >
                            {color}
                          </span>
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                            +{product.colors.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showForm && products.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl mb-4">
              No products yet
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <FiPlus />
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  )
}