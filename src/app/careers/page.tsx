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
  gradient: string;
}

interface JobStats {
  totalJobs: number;
  totalCompanies: number;
  recentJobs: number;
  topTags: Array<{ name: string; count: number }>;
}

const getJobCategories = (jobStats: JobStats | null): JobCategory[] => {
  const defaultCategories: JobCategory[] = [
    { name: 'Technology', count: 1247, icon: Briefcase, color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
    { name: 'Healthcare', count: 856, icon: Heart, color: 'bg-red-500', gradient: 'from-rose-400 to-red-600' },
    { name: 'Finance', count: 643, icon: DollarSign, color: 'bg-green-500', gradient: 'from-emerald-400 to-green-600' },
    { name: 'Education', count: 532, icon: BookOpen, color: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600' },
    { name: 'Marketing', count: 421, icon: TrendingUp, color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600' },
    { name: 'Design', count: 314, icon: Award, color: 'bg-pink-500', gradient: 'from-pink-400 to-pink-600' },
  ]

  if (!jobStats?.topTags) return defaultCategories

  const tagCategories = jobStats.topTags.slice(0, 6).map((tag: { name: string; count: number }, index: number) => ({
    name: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
    count: tag.count,
    icon: defaultCategories[index]?.icon || Briefcase,
    color: defaultCategories[index]?.color || 'bg-blue-500',
    gradient: defaultCategories[index]?.gradient || 'from-blue-400 to-blue-600'
  }))

  return tagCategories.length > 0 ? tagCategories : defaultCategories
}

const careerInsights = [
  {
    title: 'Tech Hiring Trends 2024',
    description: 'AI and ML roles seeing 40% growth in demand',
    trend: '+40%',
    color: 'text-green-500',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200'
  },
  {
    title: 'Remote Work Adoption',
    description: 'Hybrid roles increased by 65% this quarter',
    trend: '+65%',
    color: 'text-blue-500',
    bgColor: 'from-blue-50 to-sky-50',
    borderColor: 'border-blue-200'
  },
  {
    title: 'Salary Benchmarks',
    description: 'Average tech salaries up by 15% YoY',
    trend: '+15%',
    color: 'text-purple-500',
    bgColor: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-200'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 bg-career-pattern">
      <Navbar />
      
      {/* Hero Section - Keeping as is */}
      <section className="pt-24 pb-12 gradient-career text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl float-delay-1"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-300/10 rounded-full blur-xl float-delay-2"></div>
          <div className="absolute top-1/3 right-1/2 w-20 h-20 bg-cyan-300/10 rounded-full blur-lg float-fast"></div>
          <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-indigo-300/8 rounded-full blur-2xl float-delay-1"></div>
          
          <div className="absolute top-20 right-20 w-6 h-6 bg-white/20 rotate-45 float-slow"></div>
          <div className="absolute bottom-32 left-20 w-4 h-4 bg-blue-300/30 rounded-full float-delay-2"></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-purple-300/40 rounded-full float-fast"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Find Your Dream Career
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover opportunities that match your skills, interests, and career goals. 
              Get AI-powered recommendations tailored just for you.
            </p>
            
            <div className="max-w-4xl mx-auto glass-career rounded-3xl p-3 shadow-2xl backdrop-blur-2xl">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    className="pl-12 border-0 bg-white/90 backdrop-blur-sm text-gray-900 text-lg py-4 focus:ring-2 focus:ring-blue-400/50 rounded-2xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="text-gray-700 border-white/30 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-xl">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </Button>
                  <Button 
                    className="btn-career px-8 py-4 rounded-xl font-semibold"
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Active Jobs', value: jobStats ? jobStats.totalJobs.toLocaleString() + '+' : '4,500+', color: 'text-blue-300', bg: 'bg-blue-500/10' },
                { label: 'Companies', value: jobStats ? jobStats.totalCompanies.toLocaleString() + '+' : '1,200+', color: 'text-purple-300', bg: 'bg-purple-500/10' },
                { label: 'Recent Jobs', value: jobStats ? jobStats.recentJobs.toLocaleString() + '+' : '25,000+', color: 'text-cyan-300', bg: 'bg-cyan-500/10' },
                { label: 'Remote Opportunities', value: '95%', color: 'text-emerald-300', bg: 'bg-emerald-500/10' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center group cursor-pointer"
                >
                  <div className={`${stat.bg} backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg border border-white/10`}>
                    <div className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>{stat.value}</div>
                    <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ENHANCED CONTENT SECTION STARTS HERE */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Enhanced Job Categories Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Browse by Category
              </h2>
              <p className="text-gray-600 text-lg">Explore opportunities across different industries</p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              View All Categories
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {getJobCategories(jobStats).map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg relative`}>
                    <category.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                  <p className="text-gray-500 text-sm font-semibold">{category.count.toLocaleString()} jobs</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Enhanced Job Listings */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                    Live Remote Jobs
                  </h2>
                  <p className="text-gray-600 text-sm font-medium">Updated every 15 minutes</p>
                </div>
                {isConnectedToBackend && (
                  <div className="flex items-center text-sm bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-300 shadow-md">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 animate-pulse shadow-emerald-400 shadow-sm"></div>
                    <span className="font-bold">Live</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button className="bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-purple-700 border border-purple-200 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm hover:border-indigo-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-gray-700 font-semibold shadow-sm">
                  <option value="relevant">Most Relevant</option>
                  <option value="latest">Latest</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-3xl shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <span className="ml-3 text-gray-600 font-medium text-lg">Loading amazing jobs...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl mx-auto mb-5">
                    <Building className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">Connection Issue</h3>
                  <p className="text-red-700 mb-5 font-medium">{error}</p>
                  <div className="space-y-3">
                    <Button onClick={loadInitialData} className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                      <Loader2 className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <p className="text-xs text-red-600 font-medium">
                      Make sure your backend server is running on port 5000
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 5) }}
                  className="group"
                >
                  <div className="relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:border-indigo-200">
                    {/* Gradient accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
                    
                    {/* Premium highlight */}
                    {job.featured && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-300/20 via-orange-300/10 to-transparent"></div>
                    )}
                    
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                          {job.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 font-bold px-3 py-1 shadow-md">
                              ⭐ Featured
                            </Badge>
                          )}
                          <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 font-semibold px-3 py-1 shadow-md">
                            {job.remoteLevel === 'fully-remote' ? '🌍 Remote' : job.remoteLevel}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4 text-sm">
                          <div className="flex items-center font-semibold">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-2">
                              <Building className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-gray-800">{job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mr-2">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="font-medium">{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mr-2">
                              <Clock className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="font-medium">{jobService.formatTimeAgo(job.postedAt)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {job.tags.slice(0, 5).map((tag, tagIndex) => (
                            <Badge key={`${tag}-${tagIndex}`} className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all cursor-pointer border border-indigo-200 font-semibold px-3 py-1.5 rounded-full shadow-sm">
                              {tag}
                            </Badge>
                          ))}
                          {job.tags.length > 5 && (
                            <Badge className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full font-semibold">
                              +{job.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        disabled={savingJob === job.id}
                        className="p-3 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 disabled:opacity-50 group/heart"
                        title={user ? (savedJobs.includes(job.id) ? 'Remove from saved jobs' : 'Save this job') : 'Sign in to save jobs'}
                      >
                        {savingJob === job.id ? (
                          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        ) : (
                          <Heart 
                            className={`w-6 h-6 transition-all duration-300 ${
                              savedJobs.includes(job.id) 
                                ? 'fill-red-500 text-red-500 scale-110' 
                                : 'text-gray-400 group-hover/heart:text-red-500 group-hover/heart:scale-110'
                            }`} 
                          />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center font-bold bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm">
                          <DollarSign className="w-4 h-4 mr-1.5" />
                          <span>{jobService.formatSalary(job)}</span>
                        </div>
                        <div className="flex items-center bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 px-4 py-2.5 rounded-xl border border-purple-200 font-semibold shadow-sm">
                          <Briefcase className="w-4 h-4 mr-1.5" />
                          <span>{jobService.getJobTypeLabel(job.jobType)}</span>
                        </div>
                        <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-4 py-2.5 rounded-xl border border-amber-200 font-semibold shadow-sm">
                          <Award className="w-4 h-4 mr-1.5" />
                          <span>{jobService.getExperienceLevelLabel(job.experienceLevel)}</span>
                        </div>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        onClick={() => window.open(job.applicationUrl, '_blank')}
                      >
                        Apply Now
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && currentPage < totalPages && (
              <div className="text-center mt-12">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  onClick={loadMoreJobs}
                >
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Career Insights */}
            <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-3xl p-7 border border-indigo-100 shadow-xl">
              <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Career Insights
              </h3>
              <div className="space-y-4">
                {careerInsights.map((insight, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`group p-5 bg-gradient-to-r ${insight.bgColor} rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer border ${insight.borderColor}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{insight.title}</h4>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/80 ${insight.color} shadow-sm`}>
                        {insight.trend}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{insight.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Applications */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Quick Apply</h3>
                </div>
                <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                  Upload your resume once and apply to multiple jobs with one click. Save time and increase your chances.
                </p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-blue-50 rounded-2xl py-4 font-bold text-base group-hover:scale-105 transition-all duration-300 shadow-lg">
                  📄 Upload Resume
                </Button>
              </div>
            </div>

            {/* Job Alerts */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Job Alerts</h3>
                </div>
                <p className="text-amber-100 mb-6 text-sm leading-relaxed">
                  Get instant notifications when new jobs matching your preferences are posted. Never miss an opportunity.
                </p>
                <Button className="w-full bg-white text-orange-600 hover:bg-amber-50 rounded-2xl py-4 font-bold text-base group-hover:scale-105 transition-all duration-300 shadow-lg">
                  🔔 Create Alert
                </Button>
              </div>
            </div>

            {/* AI Career Coach */}
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">AI Career Coach</h3>
                </div>
                <p className="text-purple-100 mb-6 text-sm leading-relaxed">
                  Get personalized career advice, skill recommendations, and strategic guidance powered by advanced AI technology.
                </p>
                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 rounded-2xl py-4 font-bold text-base shadow-lg hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  🤖 Chat with AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}