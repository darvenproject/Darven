'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus, FiCheck, FiScissors } from 'react-icons/fi'
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
  customCollar: string
  customShoulder: string
  customChest: string
  customSleeves: string
  customKameezLength: string
  cuffs: 'yes' | 'no' | ''
  collarType: 'sherwani' | 'shirt' | ''
  bottomWear: 'pajama' | 'shalwar' | ''
  color: string
  customShalwarLength: string
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
  const [meters, setMeters] = useState(4) // Default 4 meters for a suit
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

  useEffect(() => {
    fetchCustomFabrics()
  }, [])

  const fetchCustomFabrics = async () => {
    try {
      const response = await apiClient.getCustomFabrics()
      setFabrics(response.data)
      if (response.data.length > 0) {
        setSelectedFabric(response.data[0])
        setSelectedColor('')
      }
    } catch (error) {
      console.error('Error fetching custom fabrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFabricSelect = (fabric: CustomFabric) => {
    setSelectedFabric(fabric)
    setSelectedColor('')
    if (fabric.colors && fabric.colors.length === 1) {
      setSelectedColor(fabric.colors[0])
    }
  }

  const handleMeasurementChange = (field: keyof Measurements, value: string) => {
    setMeasurements({ ...measurements, [field]: value })
  }

  const handleAddToCart = () => {
    if (!selectedFabric) return

    if (selectedFabric.colors && selectedFabric.colors.length > 0 && !selectedColor) {
      alert('Please select a color for your fabric')
      return
    }

    if (!measurements.cuffs || !measurements.collarType || !measurements.bottomWear) {
      alert('Please select all options (Cuffs, Collar Type, Bottom Wear)')
      return
    }

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

    const finalColor = selectedColor || 'Standard'
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
      : `Custom Suit - ${selectedFabric.name}`
    
    // Calculate price per meter (original price is for 4 meters)
    const pricePerMeter = selectedFabric.price / 4
    const totalFabricPrice = Math.round(pricePerMeter * meters)
    
    addItem({
      id: `custom-${selectedFabric.id}-${Date.now()}`,
      type: 'custom',
      name: displayName,
      price: totalFabricPrice,
      quantity: quantity,
      image: getImageUrl(selectedFabric.image_url),
      details: {
        fabric: selectedFabric.name,
        material: selectedFabric.material,
        color: finalColor,
        meters: meters,
        measurements: measurementsData
      }
    })

    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Stitch Your Own Suit
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl">
            Choose your premium fabric, select your perfect color, and provide custom measurements for a suit tailored exclusively for you.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          
          {/* LEFT: Fabric Selection */}
          <div className="space-y-6 lg:space-y-8">
            {/* Fabric Grid */}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">
                Choose Your Fabric
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {fabrics.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => handleFabricSelect(fabric)}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:-translate-y-1
                      ${selectedFabric?.id === fabric.id
                        ? 'ring-2 ring-gray-900 shadow-2xl border-2 border-gray-900'
                        : 'border-2 border-gray-200 hover:border-gray-400:border-gray-600 hover:shadow-xl shadow-md'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 bg-gray-50 group-hover:bg-white:bg-gray-800 transition-colors">
                      {/* Image */}
                      <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 border border-gray-300">
                        <img
                          src={getImageUrl(fabric.image_url)}
                          alt={fabric.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {selectedFabric?.id === fabric.id && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                          {fabric.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                          {fabric.description}
                        </p>
                        
                        {/* Price Section - Stacked on Mobile */}
                        <div className="space-y-3">
                          {/* Main Price */}
                          <div>
                            <div className="flex items-baseline gap-1 flex-wrap">
                              <span className="text-2xl sm:text-3xl font-black text-gray-900">
                                Rs {Math.round(fabric.price / 4).toLocaleString()}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 font-bold">
                                /meter
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {fabric.colors?.length || 0} colors available
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meters Selector */}
            <div className="p-5 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
              <label className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                Fabric Meters
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setMeters(Math.max(1, meters - 0.5))}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-95 hover:scale-105 sm:hover:scale-110 hover:shadow-lg"
                >
                  <FiMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="text-center">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900 min-w-[60px] sm:min-w-[80px] inline-block">
                    {meters}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">meters</p>
                </div>

                <button
                  onClick={() => setMeters(meters + 0.5)}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-95 hover:scale-105 sm:hover:scale-110 hover:shadow-lg"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Recommended: 4 meters for a full suit
              </p>
            </div>

            {/* Quantity */}
            <div className="p-5 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
              <label className="block text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                Quantity (Suits)
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-95 hover:scale-105 sm:hover:scale-110 hover:shadow-lg"
                >
                  <FiMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <span className="text-3xl sm:text-4xl font-black text-gray-900 min-w-[40px] sm:min-w-[50px] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-95 hover:scale-105 sm:hover:scale-110 hover:shadow-lg"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Customization */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Customize Your Order
            </h2>

            {/* Step 1: Color Selection */}
            {selectedFabric && selectedFabric.colors && selectedFabric.colors.length > 0 && (
              <div className="p-5 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-black">
                    1
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">
                    Select Color <span className="text-red-500">*</span>
                  </h3>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {selectedFabric.colors.map((color) => {
                    const colorHex = getColorHex(color)
                    const textColor = getTextColorForBackground(colorHex)
                    const isSelected = selectedColor === color

                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 sm:hover:scale-110 ${
                          isSelected
                            ? 'ring-2 ring-gray-900 scale-105 shadow-lg'
                            : 'hover:shadow-md border border-gray-200'
                        }`}
                        style={{ minHeight: '70px' }}
                      >
                        <div className="absolute inset-0 rounded-lg sm:rounded-xl" style={{ backgroundColor: colorHex, opacity: 0.1 }} />
                        <div className="relative p-2 sm:p-3 flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                          <div
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-200 flex items-center justify-center"
                            style={{ backgroundColor: colorHex }}
                          >
                            {isSelected && (
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: textColor }} />
                            )}
                          </div>
                          <span className={`text-[8px] sm:text-[9px] font-bold uppercase text-center leading-tight ${
                            isSelected ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {color}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Measurements */}
            <div className="p-5 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-black">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  Kameez Measurements
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { field: 'customCollar', label: 'Collar', placeholder: '15' },
                  { field: 'customShoulder', label: 'Shoulder', placeholder: '17.5' },
                  { field: 'customChest', label: 'Chest', placeholder: '23' },
                  { field: 'customSleeves', label: 'Sleeves', placeholder: '23.5' },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                      {label} (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements[field as keyof Measurements]}
                      onChange={(e) => handleMeasurementChange(field as keyof Measurements, e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white hover:border-gray-400:border-gray-600 transition-all text-sm sm:text-base"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                    Length (inches) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.customKameezLength}
                    onChange={(e) => handleMeasurementChange('customKameezLength', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white transition-colors text-sm sm:text-base"
                    placeholder="40"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Options */}
            <div className="p-5 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-black">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  Kurta Options
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                    Cuffs
                  </label>
                  <select
                    value={measurements.cuffs}
                    onChange={(e) => handleMeasurementChange('cuffs', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white hover:border-gray-400:border-gray-600 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                    Collar Type
                  </label>
                  <select
                    value={measurements.collarType}
                    onChange={(e) => handleMeasurementChange('collarType', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white hover:border-gray-400:border-gray-600 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <option value="">Select collar type</option>
                    <option value="sherwani">Sherwani Collar</option>
                    <option value="shirt">Shirt Collar</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                    Bottom Wear
                  </label>
                  <select
                    value={measurements.bottomWear}
                    onChange={(e) => handleMeasurementChange('bottomWear', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white hover:border-gray-400:border-gray-600 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <option value="">Select bottom wear</option>
                    <option value="pajama">Pajama</option>
                    <option value="shalwar">Shalwar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Bottom Wear Measurements */}
            {measurements.bottomWear === 'shalwar' && (
              <div className="p-5 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-black">
                    4
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">
                    Shalwar Measurements
                  </h3>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                    Length (inches) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.customShalwarLength}
                    onChange={(e) => handleMeasurementChange('customShalwarLength', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white transition-colors text-sm sm:text-base"
                    placeholder="40"
                  />
                </div>
              </div>
            )}

            {measurements.bottomWear === 'pajama' && (
              <div className="p-5 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-black">
                    4
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">
                    Pajama Measurements
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                      Length (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customPajamaLength}
                      onChange={(e) => handleMeasurementChange('customPajamaLength', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white transition-colors text-sm sm:text-base"
                      placeholder="40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                      Waist (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customWaist}
                      onChange={(e) => handleMeasurementChange('customWaist', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white transition-colors text-sm sm:text-base"
                      placeholder="32"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-2">
                      Thigh (inches) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.customThigh}
                      onChange={(e) => handleMeasurementChange('customThigh', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-900:border-white transition-colors text-sm sm:text-base"
                      placeholder="24"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total & Add to Cart */}
            {selectedFabric && (
              <div className="sticky bottom-0 p-5 sm:p-6 bg-white border-2 border-gray-900 rounded-xl sm:rounded-2xl space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Fabric ({meters} meter{meters !== 1 ? 's' : ''}):</span>
                    <span className="font-bold text-gray-900">
                      Rs {(Math.round((selectedFabric.price / 4) * meters) * quantity).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-2 flex items-center justify-between">
                    <span className="text-lg sm:text-xl font-black text-gray-900">
                      Fabric Total:
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-gray-900">
                      Rs {(Math.round((selectedFabric.price / 4) * meters) * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedFabric || (selectedFabric.colors && selectedFabric.colors.length > 0 && !selectedColor)}
                  className="w-full py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-black text-base sm:text-lg bg-gray-900 text-white hover:bg-black hover:shadow-2xl hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {!selectedFabric ? 'Select a Fabric' : (selectedFabric.colors && selectedFabric.colors.length > 0 && !selectedColor) ? 'Select a Color' : 'Add to Cart'}
                </button>
                
                <p className="text-[10px] sm:text-xs text-center text-gray-500">
                  Stitching charges (Rs 3,500 per suit) will be added at checkout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}