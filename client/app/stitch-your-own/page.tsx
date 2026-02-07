'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { getColorHex, getTextColorForBackground } from '@/lib/colorMapping'

interface CustomFabric {
  id: number
  name: string
  description: string
  price: number
  material: string
  colors?: string[]
  image_url: string
}

interface Measurements {
  // Custom Kameez measurements
  customCollar: string
  customShoulder: string
  customChest: string
  customSleeves: string
  customKameezLength: string
  
  // Options
  cuffs: 'yes' | 'no' | ''
  collarType: 'sherwani' | 'shirt' | ''
  bottomWear: 'pajama' | 'shalwar' | ''
  color: string
  
  // Custom Shalwar measurements
  customShalwarLength: string
  
  // Custom Pajama measurements
  customPajamaLength: string
  customWaist: string
  customThigh: string
}

export default function StitchYourOwnPage() {
  const router = useRouter()
  const [fabrics, setFabrics] = useState<CustomFabric[]>([])
  const [selectedFabric, setSelectedFabric] = useState<CustomFabric | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [measurements, setMeasurements] = useState<Measurements>({
    customCollar: '',
    customShoulder: '',
    customChest: '',
    customSleeves: '',
    customKameezLength: '',
    cuffs: '',
    collarType: '',
    bottomWear: '',
    color: '',
    customShalwarLength: '',
    customPajamaLength: '',
    customWaist: '',
    customThigh: ''
  })
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchCustomFabrics()
  }, [])

  const fetchCustomFabrics = async () => {
    try {
      const response = await apiClient.getCustomFabrics()
      console.log('Fetched custom fabrics for stitch-your-own:', response.data)
      setFabrics(response.data)
      if (response.data.length > 0) {
        console.log('First fabric colors:', response.data[0].colors)
        setSelectedFabric(response.data[0])
        setSelectedColor('') // Reset color when fabric changes
      }
    } catch (error) {
      console.error('Error fetching custom fabrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFabricSelect = (fabric: CustomFabric) => {
    console.log('Selected fabric:', fabric)
    console.log('Available colors:', fabric.colors)
    setSelectedFabric(fabric)
    setSelectedColor('') // Reset color when changing fabric
    // Auto-select first color if only one color is available
    if (fabric.colors && fabric.colors.length === 1) {
      setSelectedColor(fabric.colors[0])
    }
  }


  const handleMeasurementChange = (field: keyof Measurements, value: string) => {
    setMeasurements({ ...measurements, [field]: value })
  }

  const handleAddToCart = () => {
    if (!selectedFabric) return

    // Validate color selection if colors are available
    if (selectedFabric.colors && selectedFabric.colors.length > 0 && !selectedColor) {
      alert('Please select a color for your fabric')
      return
    }

    // Validate options
    if (!measurements.cuffs || !measurements.collarType || !measurements.bottomWear) {
      alert('Please select all options (Cuffs, Collar Type, Bottom Wear)')
      return
    }

    // Validate custom measurements
    if (!measurements.customCollar || !measurements.customShoulder || !measurements.customChest || 
        !measurements.customSleeves || !measurements.customKameezLength) {
      alert('Please fill in all Kameez measurements (Collar, Shoulder, Chest, Sleeves, Length)')
      return
    }
    
    if (measurements.bottomWear === 'shalwar' && !measurements.customShalwarLength) {
      alert('Please fill in Shalwar length')
      return
    }
    
    if (measurements.bottomWear === 'pajama' && (!measurements.customPajamaLength || !measurements.customWaist || !measurements.customThigh)) {
      alert('Please fill in all Pajama measurements (Length, Waist, Thigh)')
      return
    }

    // Build measurements object with custom measurements only
    const finalColor = selectedColor || 'Standard'; // Use 'Standard' if no color selected/available
    const measurementsData: any = {
      measurementType: 'custom',
      cuffs: measurements.cuffs,
      collarType: measurements.collarType,
      bottomWear: measurements.bottomWear,
      color: finalColor,
      customCollar: measurements.customCollar,
      customShoulder: measurements.customShoulder,
      customChest: measurements.customChest,
      customSleeves: measurements.customSleeves,
      customKameezLength: measurements.customKameezLength,
    }
    
    if (measurements.bottomWear === 'shalwar') {
      measurementsData.customShalwarLength = measurements.customShalwarLength
    } else if (measurements.bottomWear === 'pajama') {
      measurementsData.customPajamaLength = measurements.customPajamaLength
      measurementsData.customWaist = measurements.customWaist
      measurementsData.customThigh = measurements.customThigh
    }

    const displayName = finalColor !== 'Standard' 
      ? `Custom Suit - ${selectedFabric.name} (${finalColor})`
      : `Custom Suit - ${selectedFabric.name}`;
    
    addItem({
      id: `custom-${selectedFabric.id}-${Date.now()}`,
      type: 'custom',
      name: displayName,
      price: selectedFabric.price,
      quantity: quantity,
      image: getImageUrl(selectedFabric.image_url),
      details: {
        fabric: selectedFabric.name,
        material: selectedFabric.material,
        color: finalColor,
        measurements: measurementsData
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
    <div className="container mx-auto px-4 py-8" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y pan-x' }}>
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
                onClick={() => handleFabricSelect(fabric)}
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
                    {fabric.colors && fabric.colors.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {fabric.colors.length} colors available
                      </p>
                    )}
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
            Customize Your Order
          </h2>

          <div className="space-y-6">
            {/* Color Selection - First Step */}
            {selectedFabric && selectedFabric.colors && selectedFabric.colors.length > 0 && (
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Select Color <span className="text-red-500">*</span>
                </h3>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 gap-1.5">
                  {selectedFabric.colors.map((color) => {
                    const colorHex = getColorHex(color);
                    const textColor = getTextColorForBackground(colorHex);
                    const isSelected = selectedColor === color;
                    
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`group relative rounded-md border-2 font-medium transition-all overflow-hidden ${
                          isSelected
                            ? 'border-gray-900 dark:border-white shadow-md scale-105 ring-1 ring-gray-900 dark:ring-white ring-offset-1'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 hover:shadow-sm hover:scale-102'
                        }`}
                        style={{
                          minHeight: '50px'
                        }}
                      >
                        {/* Color Swatch */}
                        <div 
                          className="absolute inset-0 transition-opacity"
                          style={{ 
                            backgroundColor: colorHex,
                            opacity: isSelected ? 0.3 : 0.15
                          }}
                        />
                        
                        {/* Color Circle Indicator */}
                        <div className="relative z-10 p-1.5 flex flex-col items-center justify-center gap-0.5">
                          <div 
                            className={`w-5 h-5 rounded-full border ${isSelected ? 'border-gray-900 dark:border-white' : 'border-gray-400 dark:border-gray-500'} shadow-sm flex items-center justify-center`}
                            style={{ backgroundColor: colorHex }}
                          >
                            {isSelected && (
                              <FiCheck 
                                className="w-3 h-3" 
                                style={{ color: textColor }}
                              />
                            )}
                          </div>
                          <span className={`text-[10px] font-semibold text-center leading-tight ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {color}
                          </span>
                        </div>
                        
                        {/* Shimmer effect on selection */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {selectedColor && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selected: <span className="font-semibold text-gray-900 dark:text-white">{selectedColor}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Kameez Measurements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Kameez Measurements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Collar (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customCollar}
                      onChange={(e) => handleMeasurementChange('customCollar', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Shoulder (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customShoulder}
                      onChange={(e) => handleMeasurementChange('customShoulder', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 17.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Chest (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customChest}
                      onChange={(e) => handleMeasurementChange('customChest', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 23"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Sleeves (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customSleeves}
                      onChange={(e) => handleMeasurementChange('customSleeves', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 23.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Length (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customKameezLength}
                      onChange={(e) => handleMeasurementChange('customKameezLength', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 40"
                    />
                </div>
              </div>
            </div>

            {/* Kurta Options */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Kurta Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Cuffs
                  </label>
                  <select
                    value={measurements.cuffs}
                    onChange={(e) => handleMeasurementChange('cuffs', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Collar Type
                  </label>
                  <select
                    value={measurements.collarType}
                    onChange={(e) => handleMeasurementChange('collarType', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  >
                    <option value="">Select collar type</option>
                    <option value="sherwani">Sherwani Collar</option>
                    <option value="shirt">Shirt Collar</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Bottom Wear
                  </label>
                  <select
                    value={measurements.bottomWear}
                    onChange={(e) => handleMeasurementChange('bottomWear', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  >
                    <option value="">Select bottom wear</option>
                    <option value="pajama">Pajama</option>
                    <option value="shalwar">Shalwar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shalwar Measurements */}
            {measurements.bottomWear === 'shalwar' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Shalwar Measurements
                </h3>
                
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Length (inches) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.customShalwarLength}
                    onChange={(e) => handleMeasurementChange('customShalwarLength', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="e.g., 40"
                  />
                </div>
              </div>
            )}

            {/* Pajama Measurements */}
            {measurements.bottomWear === 'pajama' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Pajama Measurements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Length (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customPajamaLength}
                      onChange={(e) => handleMeasurementChange('customPajamaLength', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Waist (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customWaist}
                      onChange={(e) => handleMeasurementChange('customWaist', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Thigh (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customThigh}
                      onChange={(e) => handleMeasurementChange('customThigh', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      placeholder="e.g., 24"
                    />
                  </div>
                </div>
              </div>
            )}

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
  );
}
