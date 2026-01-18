'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function AdminLandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null)

  useEffect(() => {
    verifyAdmin()
  }, [])

  const verifyAdmin = async () => {
    try {
      await apiClient.api.get('/admin/verify')
    } catch (error) {
      router.push('/login')
    }
  }

  const handleFileUpload = async (category: string, file: File) => {
    setUploadingCategory(category)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      await apiClient.updateLandingImage(category, formData)
      alert('Landing image updated successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setLoading(false)
      setUploadingCategory(null)
    }
  }

  const categories = [
    { id: 'ready-made', title: 'Ready Made', description: 'Upload image for Ready Made section' },
    { id: 'stitch-your-own', title: 'Stitch Your Own', description: 'Upload image for Stitch Your Own section' },
    { id: 'fabric', title: 'Fabric', description: 'Upload image for Fabric section' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
      <header className="bg-white dark:bg-dark-surface shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg">
            <FiArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Landing Images
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              
              <label className="block">
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
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                  <FiUpload />
                  {uploadingCategory === category.id ? 'Uploading...' : 'Upload Image'}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
