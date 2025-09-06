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
} from 'lucide-react'
import Navbar from '@/components/layout/navbar'

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
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const endpoint = activeTab === 'scholarships' 
        ? `${API_BASE_URL}/api/scholarships` 
        : `${API_BASE_URL}/api/internships`
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      if (data.success) {
        if (activeTab === 'scholarships') {
          setScholarships(data.data)
        } else {
          setInternships(data.data)
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error)
    } finally {
      setLoading(false)
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
        item.company.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>

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
                  key={activeTab === 'scholarships' ? (item as Scholarship)._id || index : (item as Internship).id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all group"
                >
                  {/* Trending Badge */}
                  {item.trending && (
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
                      {activeTab === 'scholarships' 
                        ? (item as Scholarship).provider 
                        : (item as Internship).company}
                    </span>
                  </div>

                  {activeTab === 'scholarships' ? (
                    <>
                      <div className="flex items-center space-x-2 text-green-400 mb-3">
                        <IndianRupee className="w-4 h-4" />
                        <span className="font-medium">{(item as Scholarship).amount}</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {(item as Scholarship).eligibility}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-gray-400 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Deadline: {formatDate((item as Scholarship).deadline)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 text-gray-400 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{(item as Internship).location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-green-400 mb-3">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{(item as Internship).stipend}</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {(item as Internship).description}
                      </p>
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