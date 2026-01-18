'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'

interface CustomFabric {
  id: number
  name: string
  description: string
  price: number
  material: string
  image_url: string
}

interface Measurements {
  neck: string
  shoulder: string
  chest: string
  sleeve: string
  height: string
  biceps: string
  waist: string
  trouser_height: string
}

export default function StitchYourOwnPage() {
  const router = useRouter()
  const [fabrics, setFabrics] = useState<CustomFabric[]>([])
  const [selectedFabric, setSelectedFabric] = useState<CustomFabric | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [measurements, setMeasurements] = useState<Measurements>({
    neck: '',
    shoulder: '',
    chest: '',
    sleeve: '',
    height: '',
    biceps: '',
    waist: '',
    trouser_height: '',
  })
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchCustomFabrics()
  }, [])

  const fetchCustomFabrics = async () => {
    try {
      const response = await apiClient.getCustomFabrics()
      setFabrics(response.data)
      if (response.data.length > 0) {
        setSelectedFabric(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching custom fabrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMeasurementChange = (field: keyof Measurements, value: string) => {
    setMeasurements({ ...measurements, [field]: value })
  }

  const handleAddToCart = () => {
    if (!selectedFabric) return

    // Validate measurements
    const requiredFields = Object.entries(measurements)
    const emptyFields = requiredFields.filter(([_, value]) => !value)
    
    if (emptyFields.length > 0) {
      alert('Please fill in all measurement fields')
      return
    }

    addItem({
      id: `custom-${selectedFabric.id}-${Date.now()}`,
      type: 'custom',
      name: `Custom Suit - ${selectedFabric.name}`,
      price: selectedFabric.price,
      quantity: quantity,
      image: getImageUrl(selectedFabric.image_url),
      details: {
        fabric: selectedFabric.name,
        material: selectedFabric.material,
        measurements: measurements
      }
    })

    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Stitch Your Own Suit
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Fabric Selection */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Fabric
          </h2>

          <div className="space-y-4 mb-8">
            {fabrics.map((fabric) => (
              <button
                key={fabric.id}
                onClick={() => setSelectedFabric(fabric)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedFabric?.id === fabric.id
                    ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-dark-surface'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(fabric.image_url)}
                      alt={fabric.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {fabric.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {fabric.description}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      Rs {fabric.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiMinus className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>

              <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiPlus className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Measurements Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Enter Your Measurements
          </h2>

          <div className="space-y-6">
            {/* Kameez/Kurta Measurements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Kameez/Kurta Measurements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Neck (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.neck}
                    onChange={(e) => handleMeasurementChange('neck', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 15"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Shoulder (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.shoulder}
                    onChange={(e) => handleMeasurementChange('shoulder', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 18"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Chest (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.chest}
                    onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 40"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Sleeve (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.sleeve}
                    onChange={(e) => handleMeasurementChange('sleeve', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 24"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.height}
                    onChange={(e) => handleMeasurementChange('height', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 42"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Biceps (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.biceps}
                    onChange={(e) => handleMeasurementChange('biceps', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 14"
                  />
                </div>
              </div>
            </div>

            {/* Trouser Measurements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Trouser Measurements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Waist (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.waist}
                    onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 32"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Trouser Height (inches)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.trouser_height}
                    onChange={(e) => handleMeasurementChange('trouser_height', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 42"
                  />
                </div>
              </div>
            </div>

            {/* Total Price */}
            {selectedFabric && (
              <div className="p-4 bg-gray-100 dark:bg-dark-surface rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    Rs {(selectedFabric.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedFabric}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
