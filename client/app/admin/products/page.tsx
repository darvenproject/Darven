'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX, FiImage } from 'react-icons/fi'
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

type ProductDestination = 'ready-made' | 'new-collection' | 'waist-coat'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [newCollectionProducts, setNewCollectionProducts] = useState<Product[]>([])
  const [waistCoatProducts, setWaistCoatProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productDestination, setProductDestination] = useState<ProductDestination>('ready-made')
  const [activeTab, setActiveTab] = useState<ProductDestination>('ready-made')
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
  const fabricCategories = ['Wash n Wear', 'Blended', 'Boski', 'Soft Cotton', 'Giza Moon Cotton', 'Banarsi']
  const [files, setFiles] = useState<FileList | null>(null)

  // ─── NEW: existing image management ───────────────────────────────────────
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [imageMode, setImageMode] = useState<'add' | 'replace'>('add')
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    verifyAdmin()
  }, [])

  const verifyAdmin = async () => {
    try {
      await apiClient.verifyAdmin()
      fetchProducts()
    } catch (error: any) {
      if (error?.response?.status === 401) {
        router.push('/login')
      } else {
        fetchProducts()
      }
    }
  }

  const fetchProducts = async () => {
    try {
      const [readyMadeRes, newCollectionRes, waistCoatRes] = await Promise.all([
        apiClient.getReadyMadeProducts(),
        apiClient.getNewCollectionProducts(),
        apiClient.getWaistCoatProducts(),
      ])
      setProducts(readyMadeRes.data)
      setNewCollectionProducts(newCollectionRes.data)
      setWaistCoatProducts(waistCoatRes.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (data: FormData) => {
    if (productDestination === 'new-collection') {
      await apiClient.createNewCollectionProduct(data)
    } else if (productDestination === 'waist-coat') {
      await apiClient.createWaistCoatProduct(data)
    } else {
      await apiClient.createReadyMadeProduct(data)
    }
  }

  const updateProduct = async (id: string, data: FormData) => {
    if (productDestination === 'new-collection') {
      await apiClient.updateNewCollectionProduct(id, data)
    } else if (productDestination === 'waist-coat') {
      await apiClient.updateWaistCoatProduct(id, data)
    } else {
      await apiClient.updateReadyMadeProduct(id, data)
    }
  }

  const deleteProduct = async (id: string, destination: ProductDestination) => {
    if (destination === 'new-collection') {
      await apiClient.deleteNewCollectionProduct(id)
    } else if (destination === 'waist-coat') {
      await apiClient.deleteWaistCoatProduct(id)
    } else {
      await apiClient.deleteReadyMadeProduct(id)
    }
  }

  const destinationLabels: Record<ProductDestination, string> = {
    'ready-made': 'Ready Made',
    'new-collection': 'New Collection',
    'waist-coat': 'Waist Coat',
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
      if (formData.fabric_category) data.append('fabric_category', formData.fabric_category)
      data.append('size', formData.size)
      data.append('stock', formData.stock)
      data.append('colors', colors.length > 0 ? JSON.stringify(colors) : JSON.stringify([]))

      // ─── NEW: send image management info ────────────────────────────────
      if (editingProduct) {
        data.append('image_mode', imageMode)
        if (imagesToDelete.length > 0) {
          data.append('images_to_delete', JSON.stringify(imagesToDelete))
        }
        // Send remaining existing images so backend knows what to keep
        const remainingImages = existingImages.filter(img => !imagesToDelete.includes(img))
        data.append('existing_images', JSON.stringify(remainingImages))
      }
      // ────────────────────────────────────────────────────────────────────

      if (files) {
        Array.from(files).forEach((file) => data.append('files', file))
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id.toString(), data)
      } else {
        await createProduct(data)
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setProductDestination('ready-made')
    setFormData({ name: '', description: '', price: '', material: '', fabric_category: '', size: '', stock: '' })
    setColors([])
    setColorInput('')
    setFiles(null)
    setExistingImages([])
    setImagesToDelete([])
    setImageMode('add')
  }

  const handleEdit = (product: Product, destination: ProductDestination) => {
    setEditingProduct(product)
    setProductDestination(destination)
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
    // ─── NEW: load existing images ───────────────────────────────────────
    setExistingImages(product.images || [])
    setImagesToDelete([])
    setImageMode('add')
    // ────────────────────────────────────────────────────────────────────
    setFiles(null)
    setShowForm(true)
  }

  const handleDelete = async (id: number, destination: ProductDestination) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id.toString(), destination)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setProductDestination(activeTab)
    setFormData({ name: '', description: '', price: '', material: '', fabric_category: '', size: '', stock: '' })
    setColors([])
    setColorInput('')
    setFiles(null)
    setExistingImages([])
    setImagesToDelete([])
    setImageMode('add')
    setShowForm(true)
  }

  // ─── NEW: toggle marking an existing image for deletion ─────────────────
  const toggleImageDelete = (img: string) => {
    setImagesToDelete(prev =>
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    )
  }
  // ──────────────────────────────────────────────────────────────────────────

  const displayedProducts =
    activeTab === 'new-collection'
      ? newCollectionProducts
      : activeTab === 'waist-coat'
        ? waistCoatProducts
        : products

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
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <FiArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Products</h1>
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="container mx-auto px-4 pb-0 flex gap-0 border-t border-gray-100">
          <button
            onClick={() => { setActiveTab('ready-made'); setShowForm(false) }}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'ready-made'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Ready Made
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('new-collection'); setShowForm(false) }}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'new-collection'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            New Collection
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {newCollectionProducts.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('waist-coat'); setShowForm(false) }}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'waist-coat'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Waist Coat
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {waistCoatProducts.length}
            </span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            {/* Product Destination */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6 border-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-3">Publish to</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['ready-made', 'new-collection', 'waist-coat'] as ProductDestination[]).map((destination) => (
                  <button
                    key={destination}
                    type="button"
                    onClick={() => setProductDestination(destination)}
                    className={`py-3 px-4 rounded-lg border-2 text-sm font-semibold transition-colors ${
                      productDestination === destination
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {destinationLabels[destination]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This product will appear on the {destinationLabels[productDestination]} page.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                  placeholder="e.g., Premium Black Suit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material *</label>
                  <input
                    type="text"
                    required
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                    placeholder="e.g., Cotton"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                  <input
                    type="text"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                    placeholder="e.g., M, L, XL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Category (Optional)</label>
                <select
                  value={formData.fabric_category}
                  onChange={(e) => setFormData({ ...formData, fabric_category: e.target.value })}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                >
                  <option value="">Select category...</option>
                  {fabricCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors (Optional)</label>
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
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900"
                    placeholder="Type color and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (colorInput.trim() && !colors.includes(colorInput.trim())) {
                        setColors([...colors, colorInput.trim()])
                        setColorInput('')
                      }
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                    {colors.map((color, index) => (
                      <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm">
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

              {/* ─── NEW: Image Management Section ──────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images {!editingProduct && '*'}
                </label>

                {/* When editing: show existing images */}
                {editingProduct && existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Current Images ({existingImages.length - imagesToDelete.length} kept
                      {imagesToDelete.length > 0 && `, ${imagesToDelete.length} will be removed`})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {existingImages.map((img, idx) => {
                        const markedForDelete = imagesToDelete.includes(img)
                        return (
                          <div key={idx} className="relative group aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={getImageUrl(img)}
                              alt={`Product image ${idx + 1}`}
                              className={`w-full h-full object-cover transition-opacity ${markedForDelete ? 'opacity-30' : 'opacity-100'}`}
                              onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                            />
                            {/* Delete / restore button */}
                            <button
                              type="button"
                              onClick={() => toggleImageDelete(img)}
                              className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow transition-all ${
                                markedForDelete
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100'
                              }`}
                              title={markedForDelete ? 'Keep this image' : 'Remove this image'}
                            >
                              {markedForDelete ? '↺' : <FiX className="w-3 h-3" />}
                            </button>
                            {markedForDelete && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">Remove</span>
                              </div>
                            )}
                            {idx === 0 && !markedForDelete && (
                              <div className="absolute bottom-1 left-1 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                Main
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* When editing: mode selector */}
                {editingProduct && (
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode('add')}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                        imageMode === 'add'
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <FiPlus className="inline w-4 h-4 mr-1" />
                      Add More Images
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('replace')}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                        imageMode === 'replace'
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <FiImage className="inline w-4 h-4 mr-1" />
                      Replace All Images
                    </button>
                  </div>
                )}

                {imageMode === 'replace' && editingProduct && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700 font-semibold">⚠ All current images will be replaced with the new ones you upload.</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required={!editingProduct}
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900"
                />

                {files && files.length > 0 && (
                  <p className="mt-1 text-xs text-green-700 font-semibold">
                    ✓ {files.length} new image{files.length > 1 ? 's' : ''} selected
                    {editingProduct && imageMode === 'add' ? ' (will be added to existing)' : ''}
                  </p>
                )}

                {editingProduct && !files && imageMode === 'add' && (
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to keep existing images as-is (minus any you marked for removal above).
                  </p>
                )}
              </div>
              {/* ────────────────────────────────────────────────────────────────── */}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : `Add to ${destinationLabels[productDestination]}`}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative aspect-[3/4] bg-gray-50">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        +{product.images.length - 1} more
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">Rs {product.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                    </div>
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Colors ({product.colors.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {product.colors.slice(0, 3).map((color, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{color}</span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs px-2 py-1 text-gray-500">+{product.colors.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product, activeTab)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, activeTab)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayedProducts.length === 0 && (
              <div className="text-center py-12 sm:py-20">
                <p className="text-gray-600 text-lg sm:text-xl mb-4">
                  No {activeTab === 'new-collection' ? 'new collection' : activeTab === 'waist-coat' ? 'waist coat' : 'ready made'} products yet
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FiPlus />
                  Add Your First Product
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}