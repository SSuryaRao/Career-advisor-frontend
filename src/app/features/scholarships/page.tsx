'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Award,
  Briefcase,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  MapPin,
  Building2,
  GraduationCap,
  TrendingUp,
  IndianRupee,
  DollarSign,
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import { apiClient } from '@/lib/api'

interface AIRecommendation {
  matchScore: number
  matchReason: string
  eligibilityStatus: 'Eligible' | 'MayBeEligible' | 'CheckDetails'
  actionSteps: string[]
  priority: 'High' | 'Medium' | 'Low'
}

interface Scholarship {
  _id?: string
  title: string
  provider: string
  amount: string
  eligibility: string
  deadline: string
  link: string
  category?: string
  domain?: string
  trending?: boolean
  aiRecommendation?: AIRecommendation
}

interface Internship {
  id: number
  title: string
  company: string
  location: string
  stipend: string
  duration?: string
  type?: string
  domain?: string
  description?: string
  requirements?: string
  link: string
  trending?: boolean
  deadline?: string
}

export default function ScholarshipsPage() {
  const [activeTab, setActiveTab] = useState<'scholarships' | 'internships'>('scholarships')
  const [viewMode, setViewMode] = useState<'all' | 'personalized'>('all')
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [internships, setInternships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [personalizedLoading, setPersonalizedLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setViewMode('all') // Reset to all view when switching tabs

    try {
      // Unified API: Use category filter to get scholarships OR internships
      const category = activeTab === 'scholarships'
        ? undefined  // Get all scholarship categories (UG, PG, Research, etc.)
        : 'Internship'  // Get only internships

      const response = await apiClient.getAllScholarships({ category })

      if (response.success) {
        const data = response.data || []

        if (activeTab === 'scholarships') {
          // Filter out internships from scholarships tab
          setScholarships(data.filter((item: Scholarship) => item.category !== 'Internship'))
        } else {
          // Show only internships in internships tab
          setInternships(data.filter((item: Scholarship) => item.category === 'Internship'))
        }
      } else {
        setError(response.error || `Failed to fetch ${activeTab}`)
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error)
      setError(`Error fetching ${activeTab}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const fetchPersonalizedScholarships = async () => {
    setPersonalizedLoading(true)
    setError(null)

    try {
      const response = await apiClient.getPersonalizedScholarships()

      if (response.success) {
        setScholarships(response.data || [])
        setViewMode('personalized')
      } else {
        setError(response.error || 'Failed to generate personalized recommendations')
      }
    } catch (error) {
      console.error('Error fetching personalized scholarships:', error)
      setError('Error generating recommendations. Please ensure you are logged in and have uploaded a resume.')
    } finally {
      setPersonalizedLoading(false)
    }
  }

  const filteredData = activeTab === 'scholarships'
    ? scholarships.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase())
      ).filter(item =>
        categoryFilter === 'all' || item.category === categoryFilter
      ).filter(item =>
        domainFilter === 'all' || item.domain === domainFilter
      )
    : internships.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase())
      ).filter(item =>
        domainFilter === 'all' || item.domain === domainFilter
      )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      {/* Header */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            Scholarship & Internship Finder
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Discover opportunities to fund your education and gain valuable work experience
          </p>
        </motion.div>

        {/* Tab Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 rounded-xl p-2 flex">
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === 'scholarships'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Scholarships</span>
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === 'internships'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Internships</span>
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {activeTab === 'scholarships' && (
                <>
                  <Button
                    onClick={() => {
                      setViewMode('all')
                      fetchData()
                    }}
                    className={`flex items-center space-x-2 ${
                      viewMode === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Show All</span>
                  </Button>
                  <Button
                    onClick={fetchPersonalizedScholarships}
                    disabled={personalizedLoading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{personalizedLoading ? 'Loading...' : 'Get Personalized'}</span>
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Personalized Mode Info */}
          {viewMode === 'personalized' && activeTab === 'scholarships' && !error && (
            <div className="mb-4 p-4 bg-purple-900/20 border border-purple-500/50 rounded-lg flex items-center space-x-2 text-purple-300">
              <Sparkles className="w-5 h-5" />
              <span>Showing personalized recommendations based on your profile and resume</span>
            </div>
          )}

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-800 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeTab === 'scholarships' && (
                  <Select
                    options={[
                      { value: 'all', label: 'All Categories' },
                      { value: 'UG', label: 'Undergraduate' },
                      { value: 'PG', label: 'Postgraduate' },
                      { value: 'Research', label: 'Research' },
                      { value: 'Women', label: 'Women' },
                      { value: 'Merit-based', label: 'Merit-based' },
                    ]}
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                    placeholder="Category"
                    className="bg-gray-700 border-gray-600"
                  />
                )}
                <Select
                  options={[
                    { value: 'all', label: 'All Domains' },
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Medical', label: 'Medical' },
                    { value: 'Science', label: 'Science' },
                    { value: 'Arts', label: 'Arts' },
                    { value: 'Commerce', label: 'Commerce' },
                    { value: 'General', label: 'General' },
                  ]}
                  value={domainFilter}
                  onValueChange={setDomainFilter}
                  placeholder="Domain"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading {activeTab}...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredData.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No {activeTab} found matching your criteria</p>
              </div>
            ) : (
              filteredData.map((item, index) => (
                <div
                  key={(item as Scholarship)._id || index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all group"
                >
                  {/* AI Match Score & Priority - Personalized Mode */}
                  {activeTab === 'scholarships' && viewMode === 'personalized' && (item as Scholarship).aiRecommendation && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-400" />
                        <span className="text-lg font-bold text-purple-400">
                          {(item as Scholarship).aiRecommendation!.matchScore}% Match
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (item as Scholarship).aiRecommendation!.priority === 'High'
                          ? 'bg-red-500/20 text-red-400'
                          : (item as Scholarship).aiRecommendation!.priority === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {(item as Scholarship).aiRecommendation!.priority} Priority
                      </span>
                    </div>
                  )}

                  {/* Trending Badge */}
                  {item.trending && !(activeTab === 'scholarships' && viewMode === 'personalized') && (
                    <div className="flex items-center space-x-1 text-yellow-400 mb-3">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-gray-400 mb-3">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">
                      {(item as Scholarship).provider}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-green-400 mb-3">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-medium">{(item as Scholarship).amount}</span>
                  </div>

                  {activeTab === 'scholarships' ? (
                    <>
                      {/* AI Match Reason - Personalized Mode */}
                      {viewMode === 'personalized' && (item as Scholarship).aiRecommendation && (
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mb-3">
                          <p className="text-sm text-purple-200 mb-2">
                            <span className="font-semibold">Why this matches:</span> {(item as Scholarship).aiRecommendation!.matchReason}
                          </p>
                          <div className="flex items-center space-x-2 text-xs">
                            {(item as Scholarship).aiRecommendation!.eligibilityStatus === 'Eligible' ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">Eligible</span>
                              </>
                            ) : (item as Scholarship).aiRecommendation!.eligibilityStatus === 'MayBeEligible' ? (
                              <>
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400">May Be Eligible</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400">Check Details</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Steps - Personalized Mode */}
                      {viewMode === 'personalized' && (item as Scholarship).aiRecommendation?.actionSteps && (item as Scholarship).aiRecommendation!.actionSteps.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-gray-300 mb-2">Next Steps:</p>
                          <ul className="space-y-1">
                            {(item as Scholarship).aiRecommendation!.actionSteps.slice(0, 3).map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-xs text-gray-400">
                                <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-purple-400" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Regular eligibility - All Mode */}
                      {viewMode === 'all' && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {(item as Scholarship).eligibility}
                        </p>
                      )}

                      <div className="flex items-center space-x-2 text-gray-400 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Deadline: {formatDate((item as Scholarship).deadline)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Internship details - using Scholarship model fields */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {(item as Scholarship).eligibility}
                      </p>

                      <div className="flex items-center space-x-2 text-gray-400 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Deadline: {formatDate((item as Scholarship).deadline)}</span>
                      </div>
                    </>
                  )}

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center space-x-2 cursor-pointer py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 hover:shadow-xl active:scale-95"
                    onClick={(e) => {
                      console.log('Apply Now clicked:', item.title, 'Link:', item.link)
                      // Let the default anchor behavior handle the link opening
                    }}
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}