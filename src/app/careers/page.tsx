'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { jobService, Job } from '@/services/jobService'
import { authService, User } from '@/services/authService'
import {
  Search, Filter, MapPin, Clock, DollarSign, TrendingUp, 
  Users, Briefcase, Calendar, Star, ChevronRight, Heart,
  Building, Award, BookOpen, Bell, Sparkles, Loader2
} from 'lucide-react'

interface JobCategory {
  name: string;
  count: number;
  icon: any;
  color: string;
}

interface JobStats {
  totalJobs: number;
  totalCompanies: number;
  recentJobs: number;
  topTags: Array<{ name: string; count: number }>;
}

const getJobCategories = (jobStats: JobStats | null): JobCategory[] => {
  const defaultCategories: JobCategory[] = [
    { name: 'Technology', count: 1247, icon: Briefcase, color: 'bg-blue-500' },
    { name: 'Healthcare', count: 856, icon: Heart, color: 'bg-red-500' },
    { name: 'Finance', count: 643, icon: DollarSign, color: 'bg-green-500' },
    { name: 'Education', count: 532, icon: BookOpen, color: 'bg-purple-500' },
    { name: 'Marketing', count: 421, icon: TrendingUp, color: 'bg-orange-500' },
    { name: 'Design', count: 314, icon: Award, color: 'bg-pink-500' },
  ]

  if (!jobStats?.topTags) return defaultCategories

  const tagCategories = jobStats.topTags.slice(0, 6).map((tag: { name: string; count: number }, index: number) => ({
    name: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
    count: tag.count,
    icon: defaultCategories[index]?.icon || Briefcase,
    color: defaultCategories[index]?.color || 'bg-blue-500'
  }))

  return tagCategories.length > 0 ? tagCategories : defaultCategories
}


const careerInsights = [
  {
    title: 'Tech Hiring Trends 2024',
    description: 'AI and ML roles seeing 40% growth in demand',
    trend: '+40%',
    color: 'text-green-500'
  },
  {
    title: 'Remote Work Adoption',
    description: 'Hybrid roles increased by 65% this quarter',
    trend: '+65%',
    color: 'text-blue-500'
  },
  {
    title: 'Salary Benchmarks',
    description: 'Average tech salaries up by 15% YoY',
    trend: '+15%',
    color: 'text-purple-500'
  },
]

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobStats, setJobStats] = useState<JobStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchLoading, setSearchLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [savingJob, setSavingJob] = useState<string | null>(null)
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false)

  const toggleSaveJob = async (jobId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please sign in to save jobs');
      return;
    }

    if (savingJob) return;

    try {
      setSavingJob(jobId);
      
      if (savedJobs.includes(jobId)) {
        await jobService.unsaveJob(jobId);
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        await jobService.saveJob(jobId);
        setSavedJobs(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setSavingJob(null);
    }
  }

  useEffect(() => {
    loadInitialData()
    
    // Listen for authentication state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadUserSavedJobs();
      } else {
        setSavedJobs([]);
      }
    });

    return unsubscribe;
  }, [])

  const loadUserSavedJobs = async () => {
    try {
      const response = await jobService.getSavedJobs(1, 100);
      const savedJobIds = response.data.jobs.map(job => job.id);
      setSavedJobs(savedJobIds);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  }

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsConnectedToBackend(false)
      
      // Test backend connection first
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const healthResponse = await fetch(`${API_BASE_URL}/api/health`)
      if (!healthResponse.ok) {
        throw new Error('Backend server is not responding')
      }
      
      setIsConnectedToBackend(true)
      
      const [jobsResponse, statsResponse] = await Promise.all([
        jobService.getAllJobs({ page: 1, limit: 12 }),
        jobService.getJobStats()
      ])
      
      setJobs(jobsResponse.data.jobs)
      setTotalPages(jobsResponse.data.pagination.totalPages)
      setJobStats(statsResponse.data)
      
      console.log(`✅ Loaded ${jobsResponse.data.jobs.length} jobs from backend`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load jobs'
      setError(errorMessage)
      console.error('Error loading initial data:', err)
      
      // Show connection status
      if (errorMessage.includes('Backend server')) {
        setError('⚠️ Backend server is not running. Please start the backend at http://localhost:5000')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadInitialData()
      return
    }

    try {
      setSearchLoading(true)
      const response = await jobService.getAllJobs({ 
        search: searchTerm,
        page: 1,
        limit: 20
      })
      
      setJobs(response.data.jobs)
      setCurrentPage(1)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setSearchLoading(false)
    }
  }

  const loadMoreJobs = async () => {
    if (currentPage >= totalPages) return
    
    try {
      const response = await jobService.getAllJobs({ 
        page: currentPage + 1,
        limit: 8,
        search: searchTerm || undefined
      })
      
      setJobs(prev => [...prev, ...response.data.jobs])
      setCurrentPage(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more jobs')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Find Your Dream
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"> Career</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover opportunities that match your skills, interests, and career goals. 
              Get AI-powered recommendations tailored just for you.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    className="pl-12 border-0 text-gray-900 text-lg py-4 focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-gray-600 border-gray-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
                    onClick={handleSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Search Jobs'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Active Jobs', value: jobStats ? jobStats.totalJobs.toLocaleString() + '+' : '4,500+' },
                { label: 'Companies', value: jobStats ? jobStats.totalCompanies.toLocaleString() + '+' : '1,200+' },
                { label: 'Recent Jobs', value: jobStats ? jobStats.recentJobs.toLocaleString() + '+' : '25,000+' },
                { label: 'Remote Opportunities', value: '95%' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Job Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <Button variant="outline">View All Categories</Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {getJobCategories(jobStats).map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count.toLocaleString()} jobs</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Live Remote Jobs</h2>
                {isConnectedToBackend && (
                  <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Connected to Backend
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Most Relevant</option>
                  <option>Latest</option>
                  <option>Salary: High to Low</option>
                  <option>Salary: Low to High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading amazing jobs...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                    <Building className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Issue</h3>
                  <p className="text-red-700 mb-4 text-sm">{error}</p>
                  <div className="space-y-2">
                    <Button onClick={loadInitialData} variant="outline" className="w-full">
                      <Loader2 className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <p className="text-xs text-red-600">
                      Make sure your backend server is running on port 5000
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 5) }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">{job.title}</h3>
                          {job.featured && (
                            <Badge className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
                              Featured
                            </Badge>
                          )}
                          <Badge className="text-xs bg-green-100 text-green-800">
                            {job.remoteLevel === 'fully-remote' ? 'Remote' : job.remoteLevel}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-700 mb-3 text-sm">
                          <div className="flex items-center font-medium">
                            <Building className="w-4 h-4 mr-1 text-blue-500" />
                            <span className="text-gray-900">{job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-green-500" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-orange-500" />
                            <span>{jobService.formatTimeAgo(job.postedAt)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.slice(0, 5).map((tag, tagIndex) => (
                            <Badge key={`${tag}-${tagIndex}`} variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                              {tag}
                            </Badge>
                          ))}
                          {job.tags.length > 5 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                              +{job.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        disabled={savingJob === job.id}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        title={user ? (savedJobs.includes(job.id) ? 'Remove from saved jobs' : 'Save this job') : 'Sign in to save jobs'}
                      >
                        {savingJob === job.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        ) : (
                          <Heart 
                            className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                          />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                        <div className="flex items-center font-semibold text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{jobService.formatSalary(job)}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1 text-purple-500" />
                          <span>{jobService.getJobTypeLabel(job.jobType)}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1 text-yellow-500" />
                          <span>{jobService.getExperienceLevelLabel(job.experienceLevel)}</span>
                        </div>
                      </div>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open(job.applicationUrl, '_blank')}
                      >
                        Apply Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && currentPage < totalPages && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={loadMoreJobs}
                >
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Career Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Career Insights
              </h3>
              <div className="space-y-4">
                {careerInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <span className={`text-sm font-semibold ${insight.color}`}>
                        {insight.trend}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Applications */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Apply</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Upload your resume once and apply to multiple jobs with one click.
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Upload Resume
              </Button>
            </Card>

            {/* Job Alerts */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-500" />
                Job Alerts
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get notified when new jobs matching your preferences are posted.
              </p>
              <Button variant="outline" className="w-full">
                Create Alert
              </Button>
            </Card>

            {/* AI Career Coach */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                AI Career Coach
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                Get personalized career advice and job recommendations powered by AI.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Chat with AI
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}