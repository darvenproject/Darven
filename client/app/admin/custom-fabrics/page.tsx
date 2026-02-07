'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import Link from 'next/link'

interface CustomFabric {
  id: number
  name: string
  description: string
  price: number
  material: string
  colors?: string[]
  image_url: string
}

export default function AdminCustomFabricsPage() {
  const router = useRouter()
  const [fabrics, setFabrics] = useState<CustomFabric[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFabric, setEditingFabric] = useState<CustomFabric | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    material: ''
  })
  const [colors, setColors] = useState<string[]>([])
  const [colorInput, setColorInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

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
      const response = await apiClient.getCustomFabrics()
      setFabrics(response.data)
    } catch (error) {
      console.error('Error fetching custom fabrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
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
      
      // Add colors as JSON string
      if (colors.length > 0) {
        data.append('colors', JSON.stringify(colors))
      }

      if (file) {
        data.append('file', file)
      }

      if (editingFabric) {
        await apiClient.api.put(`/custom-fabrics/${editingFabric.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await apiClient.api.post('/custom-fabrics', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      setShowForm(false)
      setEditingFabric(null)
      setFormData({ name: '', description: '', price: '', material: '' })
      setColors([])
      setColorInput('')
      setFile(null)
      setPreviewUrl('')
      await fetchFabrics()
    } catch (error) {
      console.error('Error saving custom fabric:', error)
      alert('Failed to save custom fabric')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (fabric: CustomFabric) => {
    setEditingFabric(fabric)
    setFormData({
      name: fabric.name,
      description: fabric.description,
      price: fabric.price.toString(),
      material: fabric.material
    })
    setColors(fabric.colors || [])
    setPreviewUrl(getImageUrl(fabric.image_url))
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this custom fabric option?')) return

    try {
      await apiClient.api.delete(`/custom-fabrics/${id}`)
      fetchFabrics()
    } catch (error) {
      console.error('Error deleting custom fabric:', error)
      alert('Failed to delete custom fabric')
    }
  }

  if (loading && !showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
      <header className="bg-white dark:bg-dark-surface shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg">
              <FiArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Custom Stitch
            </h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <FiPlus />
              Add Fabric Option
            </button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingFabric ? 'Edit Custom Fabric' : 'Add New Custom Fabric'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fabric Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="e.g., Premium Cotton"
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="Describe the fabric quality and features"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (Rs) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="3000"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Full suit stitching price
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Material *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., Cotton, Lawn"
                  />
                </div>
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
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., White, Black, Navy Blue (press Enter to add)"
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
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => setColors(colors.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add colors that customers can choose from when ordering this fabric
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fabric Image * {editingFabric && '(Leave empty to keep existing image)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingFabric}
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
                {previewUrl && (
                  <div className="mt-4 relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingFabric ? 'Update Fabric' : 'Add Fabric'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingFabric(null)
                    setFormData({ name: '', description: '', price: '', material: '' })
                    setColors([])
                    setColorInput('')
                    setFile(null)
                    setPreviewUrl('')
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> These fabric options will be available for customers when they order custom stitched suits on the "Stitch Your Own" page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fabrics.map((fabric) => (
                <div key={fabric.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(fabric.image_url)}
                      alt={fabric.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {fabric.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {fabric.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Rs {fabric.price.toLocaleString()}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {fabric.material}
                          </p>
                        </div>
                      </div>
                      {fabric.colors && fabric.colors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Available Colors ({fabric.colors.length}):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {fabric.colors.slice(0, 5).map((color, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 rounded"
                              >
                                {color}
                              </span>
                            ))}
                            {fabric.colors.length > 5 && (
                              <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                                +{fabric.colors.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(fabric)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiEdit2 />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(fabric.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {fabrics.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">
                  No custom fabric options yet
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <FiPlus />
                  Add Your First Fabric Option
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
