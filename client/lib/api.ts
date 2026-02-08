import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper function to get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.jpg'
  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  // If it's a relative path starting with /uploads
  if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
  // If it's just the filename or relative path
  if (!imagePath.startsWith('/')) return `${API_BASE_URL}/uploads/${imagePath}`
  return imagePath
}

export const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Request with token to:', config.url)
    }
  }
  
  // Set Content-Type based on data type
  // If it's FormData, let axios set the boundary automatically
  // Otherwise, use application/json
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})

// Log response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

// API functions
export const apiClient = {
  // Landing page images
  getLandingImages: () => api.get('/landing-images'),
  updateLandingImage: (category: string, formData: FormData) =>
    api.post(`/landing-images/${category}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateLandingPortraitImage: (category: string, imageId: number, formData: FormData) =>
    api.post(`/landing-images/${category}/portrait/${imageId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteLandingImage: (imageId: number) => api.delete(`/landing-images/${imageId}`),

  // Ready Made Products
  getReadyMadeProducts: () => api.get('/ready-made'),
  getReadyMadeProduct: (id: string) => api.get(`/ready-made/${id}`),
  createReadyMadeProduct: (formData: FormData) =>
    api.post('/ready-made', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateReadyMadeProduct: (id: string, formData: FormData) =>
    api.put(`/ready-made/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteReadyMadeProduct: (id: string) => api.delete(`/ready-made/${id}`),

  // Fabrics
  getFabrics: () => api.get('/fabrics'),
  getFabric: (id: string) => api.get(`/fabrics/${id}`),
  createFabric: (formData: FormData) =>
    api.post('/fabrics', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateFabric: (id: string, formData: FormData) =>
    api.put(`/fabrics/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteFabric: (id: string) => api.delete(`/fabrics/${id}`),

  // Custom Fabrics for stitching
  getCustomFabrics: () => api.get('/custom-fabrics'),

  // Orders
  createOrder: (data: any) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}`, { status }),
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),

  // Admin
  adminLogin: (username: string, password: string) =>
    api.post('/admin/login', { username, password }),
  verifyAdmin: () => api.get('/admin/verify'),
  getRevenue: () => api.get('/admin/revenue'),
  
  // Expose api instance for direct use
  api: api,
}
