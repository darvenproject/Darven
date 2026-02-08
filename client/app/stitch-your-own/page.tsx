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

        {/* LEFT COLUMN: Fabric & Quantity */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Fabric
            </h2>

            {/* Fabric Grid - 2 Columns on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fabrics.map((fabric) => (
                <button
                  key={fabric.id}
                  onClick={() => handleFabricSelect(fabric)}
                  className={`group relative flex flex-col p-4 rounded-xl border-2 transition-all duration-300 ease-out
                    
                    /* Hover Effects: Lift, Shadow, and Background Shift */
                    hover:-translate-y-1 hover:shadow-xl hover:bg-white dark:hover:bg-gray-800/40
                    
                    /* Selected State */
                    ${selectedFabric?.id === fabric.id
                      ? 'border-gray-900 dark:border-white bg-white dark:bg-dark-surface shadow-md z-10'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-transparent'
                    }`}
                >
                  {/* Image Container with Zoom Effect */}
                  <div className="w-full h-36 relative rounded-lg overflow-hidden mb-4 shadow-sm">
                    <img
                      src={getImageUrl(fabric.image_url)}
                      alt={fabric.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    
                    {/* Overlay Shimmer on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Selected Checkmark */}
                    {selectedFabric?.id === fabric.id && (
                      <div className="absolute top-2 right-2 bg-gray-900 dark:bg-white p-1.5 rounded-full shadow-lg animate-in fade-in zoom-in duration-300">
                        <FiCheck className="w-3.5 h-3.5 text-white dark:text-gray-900" />
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="text-left flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors group-hover:text-black dark:group-hover:text-white">
                      {fabric.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {fabric.description}
                    </p>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xl font-black text-gray-900 dark:text-white">
                        Rs {fabric.price.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] uppercase tracking-tighter font-bold text-gray-500 dark:text-gray-400 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-gray-900 transition-colors">
                        {fabric.colors?.length || 0} Colors Available
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity - Matching the tactile feel */}
          <div className="p-6 bg-gray-50 dark:bg-dark-bg/30 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-[0.1em]">
              Quantity
            </label>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-900 dark:hover:border-white hover:shadow-md transition-all active:scale-90"
              >
                <FiMinus className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>

              <span className="text-3xl font-black text-gray-900 dark:text-white min-w-[40px] text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-900 dark:hover:border-white hover:shadow-md transition-all active:scale-90"
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
  <div className="p-6 bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-white/10">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
      <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">1</span>
      Select Color <span className="text-red-500">*</span>
    </h3>
    
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {selectedFabric.colors.map((color) => {
        const colorHex = getColorHex(color);
        const textColor = getTextColorForBackground(colorHex);
        const isSelected = selectedColor === color;
        
        return (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`group relative rounded-xl border-2 transition-all duration-300
              ${isSelected
                ? 'border-gray-900 dark:border-white shadow-lg scale-105 z-10 bg-white dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white/50 dark:bg-white/5'
              }`}
            style={{ minHeight: '70px' }}
          >
            {/* Background Color Tint */}
            <div 
              className={`absolute inset-0 rounded-[9px] transition-opacity duration-300 
                ${isSelected ? 'opacity-20' : 'opacity-5 group-hover:opacity-10'}`}
              style={{ backgroundColor: colorHex }}
            />
            
            <div className="relative z-10 p-2 flex flex-col items-center justify-center gap-2">
              {/* Color Circle */}
              <div 
                className="w-6 h-6 rounded-full border border-black/10 dark:border-white/20 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: colorHex }}
              >
                {isSelected && (
                  <FiCheck 
                    className="w-3.5 h-3.5" 
                    style={{ color: textColor }}
                  />
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tight text-center leading-tight
                ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {color}
              </span>
            </div>
          </button>
        );
      })}
    </div>
    
    {selectedColor && (
      <div className="mt-6 p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-900/10 dark:border-white/10 animate-in fade-in slide-in-from-top-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Tailoring in: <span className="font-bold text-gray-900 dark:text-white">{selectedColor}</span>
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
            <div className="p-6">
              <button
                onClick={handleAddToCart}
                disabled={!selectedFabric || !selectedColor}
                className="group relative w-full overflow-hidden py-4 px-8 rounded-xl font-bold text-lg 
                          transition-all duration-300 ease-out
                          bg-gray-900 text-white hover:bg-black hover:shadow-xl hover:scale-[1.02]
                          dark:bg-white dark:text-gray-900 dark:hover:bg-gray-50 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                          active:scale-[0.98]
                          disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
                          flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                <FiShoppingCart className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                <span className="relative z-10">
                  {!selectedFabric ? 'Select a Fabric' : !selectedColor ? 'Select a Color' : 'Add to Cart'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
