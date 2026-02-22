'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import Link from 'next/link'

interface Fabric {
  id: number
  name: string
  description: string
  price_per_meter: number
  material: string
  fabric_category?: string
  colors?: string[]
  images: string[]
  stock_meters: number
}

export default function AdminFabricsPage() {
  const router = useRouter()
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_meter: '',
    material: '',
    fabric_category: '',
    stock_meters: ''
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
      fetchFabrics()
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchFabrics = async () => {
    try {
      const response = await apiClient.getFabrics()
      setFabrics(response.data)
    } catch (error) {
      console.error('Error fetching fabrics:', error)
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
      data.append('price_per_meter', formData.price_per_meter)
      data.append('material', formData.material)
      if (formData.fabric_category) {
        data.append('fabric_category', formData.fabric_category)
      }
      data.append('stock_meters', formData.stock_meters)
      
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

      if (editingFabric) {
        await apiClient.updateFabric(editingFabric.id.toString(), data)
      } else {
        await apiClient.createFabric(data)
      }

      setShowForm(false)
      setEditingFabric(null)
      setFormData({ name: '', description: '', price_per_meter: '', material: '', fabric_category: '', stock_meters: '' })
      setColors([])
      setColorInput('')
      setFiles(null)
      fetchFabrics()
    } catch (error) {
      console.error('Error saving fabric:', error)
      alert('Failed to save fabric')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (fabric: Fabric) => {
    setEditingFabric(fabric)
    setFormData({
      name: fabric.name,
      description: fabric.description,
      price_per_meter: fabric.price_per_meter.toString(),
      material: fabric.material,
      fabric_category: fabric.fabric_category || '',
      stock_meters: fabric.stock_meters.toString()
    })
    setColors(fabric.colors || [])
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fabric?')) return

    try {
      await apiClient.deleteFabric(id.toString())
      fetchFabrics()
    } catch (error) {
      console.error('Error deleting fabric:', error)
      alert('Failed to delete fabric')
    }
  }

  if (loading && !showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100:bg-dark-bg rounded-lg">
              <FiArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Manage Fabrics
            </h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              <FiPlus />
              <span className="hidden sm:inline">Add Fabric</span>
            </button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {editingFabric ? 'Edit Fabric' : 'Add New Fabric'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabric Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900:border-white"
                  placeholder="e.g., Premium Cotton Fabric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900:border-white"
                  placeholder="Describe the fabric quality..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Meter (Rs) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price_per_meter}
                    onChange={(e) => setFormData({ ...formData, price_per_meter: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900:border-white"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock (Meters) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    value={formData.stock_meters}
                    onChange={(e) => setFormData({ ...formData, stock_meters: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900:border-white"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900:border-white"
                    placeholder="e.g., Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (Optional)
                  </label>
                  <select
                    value={formData.fabric_category}
                    onChange={(e) => setFormData({ ...formData, fabric_category: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900:border-white"
                  >
                    <option value="">Select category...</option>
                    {fabricCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900:border-white"
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
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                    {colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabric Images * {editingFabric && '(Leave empty to keep existing)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required={!editingFabric}
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-bold hover:bg-gray-800:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingFabric ? 'Update Fabric' : 'Add Fabric'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingFabric(null)
                    setFormData({ name: '', description: '', price_per_meter: '', material: '', fabric_category: '', stock_meters: '' })
                    setColors([])
                    setColorInput('')
                    setFiles(null)
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100:bg-dark-bg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {fabrics.map((fabric) => (
              <div key={fabric.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {fabric.images && fabric.images.length > 0 ? (
                    <img
                      src={getImageUrl(fabric.images[0])}
                      alt={fabric.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {fabric.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {fabric.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      Rs {fabric.price_per_meter.toLocaleString()}/m
                    </span>
                    <span className="text-sm text-gray-600">
                      {fabric.stock_meters}m
                    </span>
                  </div>
                  {fabric.colors && fabric.colors.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">
                        Colors ({fabric.colors.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {fabric.colors.slice(0, 3).map((color, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {color}
                          </span>
                        ))}
                        {fabric.colors.length > 3 && (
                          <span className="text-xs px-2 py-1 text-gray-500">
                            +{fabric.colors.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(fabric)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(fabric.id)}
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

        {!showForm && fabrics.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-600 text-lg sm:text-xl mb-4">
              No fabrics yet
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800:bg-gray-100 transition-colors"
            >
              <FiPlus />
              Add Your First Fabric
            </button>
          </div>
        )}
      </div>
    </div>
  )
}