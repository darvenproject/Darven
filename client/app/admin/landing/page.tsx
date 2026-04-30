'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiUpload, FiTrash2, FiImage } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import Link from 'next/link'

interface LandingImage {
  id: number
  category: string
  image_url: string
  portrait_image_url?: string
  title: string
}

export default function AdminLandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null)
  const [landingImages, setLandingImages] = useState<LandingImage[]>([])
  const [heroImages, setHeroImages] = useState<LandingImage[]>([])
  const [newCollectionImages, setNewCollectionImages] = useState<LandingImage[]>([])
  const [sectionImages, setSectionImages] = useState<LandingImage[]>([])

  useEffect(() => {
    verifyAdmin()
    fetchLandingImages()
  }, [])

  const verifyAdmin = async () => {
    try {
      await apiClient.api.get('/admin/verify')
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchLandingImages = async () => {
    try {
      const response = await apiClient.getLandingImages()
      setLandingImages(response.data)

      const heroes = response.data.filter((img: LandingImage) => img.category === 'hero')
      const newCollection = response.data.filter((img: LandingImage) => img.category === 'new-collection')
      const sections = response.data.filter(
        (img: LandingImage) => img.category !== 'hero' && img.category !== 'new-collection'
      )

      setHeroImages(heroes)
      setNewCollectionImages(newCollection)
      setSectionImages(sections)
    } catch (error) {
      console.error('Error fetching landing images:', error)
    }
  }

  const handleFileUpload = async (category: string, file: File) => {
    setUploadingCategory(category)
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await apiClient.updateLandingImage(category, formData)
      alert(`Landing image uploaded successfully!`)
      await fetchLandingImages()
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setLoading(false)
      setUploadingCategory(null)
    }
  }

  const handlePortraitUpload = async (category: string, imageId: number, file: File) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await apiClient.updateLandingPortraitImage(category, imageId, formData)
      alert(`Portrait image uploaded successfully!`)
      fetchLandingImages()
    } catch (error) {
      console.error('Error uploading portrait image:', error)
      alert('Failed to upload portrait image')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      await apiClient.deleteLandingImage(imageId)
      alert('Image deleted successfully!')
      fetchLandingImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image')
    }
  }

  const sectionCategories = [
    { id: 'ready-made', title: 'Ready Made' },
    { id: 'stitch-your-own', title: 'Stitch Your Own' },
    { id: 'fabric', title: 'Fabric' },
  ]

  // Reusable slideshow manager (used for both Hero and New Collection)
  const SlideshowSection = ({
    title,
    description,
    category,
    images,
    allowPortrait = true,
  }: {
    title: string
    description: string
    category: string
    images: LandingImage[]
    allowPortrait?: boolean
  }) => (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* Upload Button Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(category, file)
            }}
            className="hidden"
            disabled={loading}
          />
          <div className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm sm:text-base">
            <FiUpload className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-center">
              {uploadingCategory === category ? 'Uploading...' : `Add ${title} Image (Landscape)`}
            </span>
          </div>
        </label>

        {allowPortrait && (
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gray-200 text-gray-600 rounded-lg border-2 border-dashed border-gray-400">
            <p className="text-xs sm:text-sm text-center">
              Upload landscape first, then add portrait version below
            </p>
          </div>
        )}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {title} Image {index + 1}
              </h3>
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete image"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Landscape Preview */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Desktop (Landscape)</p>
              <div className="relative w-full h-32 sm:h-40 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(image.image_url)}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                />
              </div>
            </div>

            {allowPortrait && (
              <>
                {/* Portrait Preview */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Mobile (Portrait)</p>
                  <div className="relative w-full h-32 sm:h-40 bg-gray-200 rounded-lg overflow-hidden">
                    {image.portrait_image_url ? (
                      <img
                        src={getImageUrl(image.portrait_image_url)}
                        alt={`${title} ${index + 1} Portrait`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FiImage className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Portrait Upload */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handlePortraitUpload(category, image.id, file)
                    }}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors text-sm">
                    <FiUpload className="w-4 h-4" />
                    {image.portrait_image_url ? 'Change Portrait' : 'Add Portrait'}
                  </div>
                </label>
              </>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-gray-600 text-center py-6 sm:py-8 text-sm sm:text-base">
          No images yet. Upload your first {title.toLowerCase()} image above.
        </p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <FiArrowLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Landing Images</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">

        {/* Hero Slideshow */}
        <SlideshowSection
          title="Hero"
          description="Add multiple hero images for automatic slideshow (changes every 5 seconds)"
          category="hero"
          images={heroImages}
          allowPortrait={true}
        />

        {/* Divider */}
        <div className="border-t border-gray-300 my-6 sm:my-8" />

        {/* New Collection Slideshow */}
        <SlideshowSection
          title="New Collection"
          description="Add images for the New Collection slide shown after the hero banner (links to /new-collection)"
          category="new-collection"
          images={newCollectionImages}
          allowPortrait={true}
        />

        {/* Divider */}
        <div className="border-t border-gray-300 my-6 sm:my-8" />

        {/* Section Images */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Section Images</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload images for Ready Made, Stitch Your Own, and Fabric sections
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {sectionCategories.map((category) => {
              const existingImage = sectionImages.find(img => img.category === category.id)

              return (
                <div key={category.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{category.title}</h3>

                  {/* Landscape Preview */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Desktop (Landscape)</p>
                    {existingImage ? (
                      <div className="relative w-full h-40 sm:h-48 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(existingImage.image_url)}
                          alt={category.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-40 sm:h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <FiImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Landscape Upload */}
                  <label className="block mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(category.id, file)
                      }}
                      className="hidden"
                      disabled={loading}
                    />
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm">
                      <FiUpload className="w-4 h-4" />
                      {uploadingCategory === category.id ? 'Uploading...' : existingImage ? 'Change Landscape' : 'Upload Landscape'}
                    </div>
                  </label>

                  {existingImage && (
                    <>
                      {/* Portrait Preview */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Mobile (Portrait)</p>
                        <div className="relative w-full h-40 sm:h-48 bg-gray-200 rounded-lg overflow-hidden">
                          {existingImage.portrait_image_url ? (
                            <img
                              src={getImageUrl(existingImage.portrait_image_url)}
                              alt={`${category.title} Portrait`}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FiImage className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Portrait Upload */}
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handlePortraitUpload(category.id, existingImage.id, file)
                          }}
                          className="hidden"
                          disabled={loading}
                        />
                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors text-sm">
                          <FiUpload className="w-4 h-4" />
                          {existingImage.portrait_image_url ? 'Change Portrait' : 'Add Portrait'}
                        </div>
                      </label>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}