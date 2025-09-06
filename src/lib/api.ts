// src/lib/api.ts
import { auth } from './firebase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser
    if (user) {
      try {
        return await user.getIdToken()
      } catch (error) {
        console.error('Error getting auth token:', error)
        return null
      }
    }
    return null
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken()
      
      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // User profile methods
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/api/user/profile')
  }

  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  // Additional user methods
  async getSavedJobs(page = 1, limit = 10): Promise<ApiResponse<any>> {
    return this.request(`/api/user/saved-jobs?page=${page}&limit=${limit}`)
  }

  async saveJob(jobId: string, notes = ''): Promise<ApiResponse<any>> {
    return this.request(`/api/user/saved-jobs/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    })
  }

  async unsaveJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/user/saved-jobs/${jobId}`, {
      method: 'DELETE'
    })
  }

  async getAppliedJobs(page = 1, limit = 10, status?: string): Promise<ApiResponse<any>> {
    const statusParam = status ? `&status=${status}` : ''
    return this.request(`/api/user/applied-jobs?page=${page}&limit=${limit}${statusParam}`)
  }

  async markJobAsApplied(jobId: string, status = 'applied', notes = ''): Promise<ApiResponse<any>> {
    return this.request(`/api/user/applied-jobs/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({ status, notes })
    })
  }

  async getActivityLog(page = 1, limit = 20): Promise<ApiResponse<any>> {
    return this.request(`/api/user/activity?page=${page}&limit=${limit}`)
  }

  // Career Recommendations
  async generateRecommendations(): Promise<ApiResponse<any>> {
    return this.request('/api/recommendations/generate', {
      method: 'POST'
    })
  }

  async getRecommendations(): Promise<ApiResponse<any>> {
    return this.request('/api/recommendations/get')
  }

  // Enhanced Roadmap Management
  async saveRoadmapProgress(progressData: any): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/save', {
      method: 'POST',
      body: JSON.stringify(progressData)
    })
  }

  async getRoadmapProgress(userId: string, domain?: string, skillLevel?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({ userId })
    if (domain) params.append('domain', domain)
    if (skillLevel) params.append('skillLevel', skillLevel)
    return this.request(`/api/roadmaps/get?${params.toString()}`)
  }

  async getUserRoadmaps(): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/user')
  }

  async toggleMilestone(roadmapId: string, milestoneId: string, milestoneTitle: string, isCompleted: boolean): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/milestone/toggle', {
      method: 'POST',
      body: JSON.stringify({ roadmapId, milestoneId, milestoneTitle, isCompleted })
    })
  }

  async getRoadmapStats(): Promise<ApiResponse<any>> {
    return this.request('/api/roadmaps/stats')
  }

  async deactivateRoadmap(roadmapId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/roadmaps/${roadmapId}`, {
      method: 'DELETE'
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient()
export default apiClient