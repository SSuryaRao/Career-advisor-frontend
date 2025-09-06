'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Navbar from '@/components/layout/navbar'
import {
  Search, MapPin, Clock, DollarSign, Building, Users,
  Filter, Bookmark, ExternalLink, Calendar, Star,
  TrendingUp, Briefcase, Globe, ChevronDown, X
} from 'lucide-react'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([])

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Freelance']
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, locationFilter, selectedJobTypes, selectedExperienceLevels])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/jobs`)
      
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      } else {
        // Fallback to mock data if API fails
        setJobs(mockJobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // Use mock data as fallback
      setJobs(mockJobs)
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs.filter((job: any) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = !locationFilter || 
                             job.location.toLowerCase().includes(locationFilter.toLowerCase())
      
      const matchesJobType = selectedJobTypes.length === 0 || 
                            selectedJobTypes.some(type => job.type.includes(type))
      
      const matchesExperience = selectedExperienceLevels.length === 0 || 
                               selectedExperienceLevels.includes(job.experienceLevel)
      
      return matchesSearch && matchesLocation && matchesJobType && matchesExperience
    })
    
    setFilteredJobs(filtered)
  }

  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setSelectedJobTypes([])
    setSelectedExperienceLevels([])
  }

  // Mock jobs data for fallback
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: ['Full-time', 'Remote'],
      experienceLevel: 'Senior Level',
      salary: '$120,000 - $180,000',
      description: 'Join our team to build scalable web applications using React, Node.js, and cloud technologies.',
      postedDate: '2024-01-15',
      applicants: 45,
      isRemote: true,
      featured: true
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      type: ['Full-time'],
      experienceLevel: 'Mid Level',
      salary: '$90,000 - $130,000',
      description: 'Lead product strategy and work with cross-functional teams to deliver innovative solutions.',
      postedDate: '2024-01-14',
      applicants: 23,
      isRemote: false,
      featured: false
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'DesignStudio',
      location: 'Austin, TX',
      type: ['Full-time', 'Contract'],
      experienceLevel: 'Mid Level',
      salary: '$70,000 - $95,000',
      description: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
      postedDate: '2024-01-13',
      applicants: 67,
      isRemote: true,
      featured: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Find Your Dream <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Job</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover thousands of job opportunities from top companies. 
              Find roles that match your skills, experience, and career goals.
            </p>
            
            {/* Search Section */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Job title or keywords..."
                    className="pl-10 text-gray-900 border-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Location..."
                    className="pl-10 text-gray-900 border-gray-200"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Active Jobs', value: filteredJobs.length.toString() },
                { label: 'Companies', value: '500+' },
                { label: 'Remote Jobs', value: filteredJobs.filter((job: any) => job.isRemote).length.toString() },
                { label: 'New This Week', value: '120+' },
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading jobs...' : `${filteredJobs.length} Jobs Found`}
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="hover:bg-blue-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Job Type */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedJobTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobTypes([...selectedJobTypes, type])
                          } else {
                            setSelectedJobTypes(selectedJobTypes.filter(t => t !== type))
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={selectedExperienceLevels.includes(level)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExperienceLevels([...selectedExperienceLevels, level])
                          } else {
                            setSelectedExperienceLevels(selectedExperienceLevels.filter(l => l !== level))
                          }
                        }}
                      />
                      <label htmlFor={level} className="text-sm text-gray-700 cursor-pointer">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button variant="outline" className="w-full" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </Card>

            {/* Featured Company */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="text-lg font-semibold mb-4">Featured Company</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">TechCorp</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Leading technology company with 50+ open positions
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  View All Jobs
                </Button>
              </div>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job: any, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card className={`p-6 hover:shadow-xl transition-all duration-300 bg-white border ${job.featured ? 'ring-2 ring-blue-200 border-blue-300' : 'border-gray-200'} hover:border-blue-300`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            {job.featured && (
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2" />
                              <span className="font-medium">{job.company}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{job.location}</span>
                            </div>
                            {job.isRemote && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Globe className="w-3 h-3 mr-1" />
                                Remote
                              </Badge>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Bookmark 
                            className={`w-5 h-5 ${bookmarkedJobs.includes(job.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.type.map((type: string) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          {job.experienceLevel}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span className="font-medium">{job.salary}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{job.applicants} applicants</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {filteredJobs.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">No jobs found matching your criteria.</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Load More */}
                {filteredJobs.length > 0 && (
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                      Load More Jobs
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}