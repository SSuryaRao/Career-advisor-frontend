'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search, Filter, MapPin, TrendingUp, DollarSign, Users, 
  Clock, Star, Briefcase, GraduationCap, Target, Brain,
  ChevronDown, ChevronUp, Heart, Share2, Bookmark, Eye
} from 'lucide-react'

const careerCategories = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 
  'Design', 'Engineering', 'Business', 'Science', 'Arts'
]

const experienceLevels = ['Entry Level', 'Mid-Level', 'Senior Level', 'Executive']

const locations = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Remote']

const careers = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'Tech Innovations Pvt Ltd',
    category: 'Technology',
    match: 92,
    salary: { min: 800000, max: 1500000 },
    location: 'Bangalore',
    experience: 'Mid-Level',
    growth: '+22%',
    demand: 'High',
    description: 'Build end-to-end web applications using modern technologies like React, Node.js, and cloud platforms.',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
    workLifeBalance: 4.2,
    futureReadiness: 9.1,
    posted: '2 days ago',
    applicants: 124,
    views: 1456
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'Analytics Pro Solutions',
    category: 'Technology',
    match: 88,
    salary: { min: 1200000, max: 2200000 },
    location: 'Mumbai',
    experience: 'Mid-Level',
    growth: '+35%',
    demand: 'Very High',
    description: 'Analyze complex datasets to derive actionable insights for business growth using ML and AI techniques.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
    workLifeBalance: 3.8,
    futureReadiness: 9.5,
    posted: '1 day ago',
    applicants: 89,
    views: 2134
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'StartupXYZ',
    category: 'Business',
    match: 85,
    salary: { min: 1500000, max: 2800000 },
    location: 'Delhi NCR',
    experience: 'Senior Level',
    growth: '+28%',
    demand: 'High',
    description: 'Lead product strategy and development lifecycle from conception to launch in a fast-paced startup environment.',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Leadership'],
    workLifeBalance: 3.5,
    futureReadiness: 8.7,
    posted: '3 days ago',
    applicants: 67,
    views: 987
  },
  {
    id: 4,
    title: 'UX Designer',
    company: 'Design Studio Inc',
    category: 'Design',
    match: 78,
    salary: { min: 600000, max: 1200000 },
    location: 'Remote',
    experience: 'Entry Level',
    growth: '+18%',
    demand: 'Medium',
    description: 'Create intuitive and engaging user experiences for digital products through research, design, and testing.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
    workLifeBalance: 4.5,
    futureReadiness: 8.3,
    posted: '1 week ago',
    applicants: 234,
    views: 1876
  },
  {
    id: 5,
    title: 'Digital Marketing Manager',
    company: 'Growth Marketing Co',
    category: 'Marketing',
    match: 82,
    salary: { min: 700000, max: 1400000 },
    location: 'Chennai',
    experience: 'Mid-Level',
    growth: '+25%',
    demand: 'High',
    description: 'Drive digital marketing strategies across multiple channels to increase brand awareness and customer acquisition.',
    skills: ['SEO/SEM', 'Social Media', 'Analytics', 'Content Strategy', 'PPC'],
    workLifeBalance: 4.0,
    futureReadiness: 7.9,
    posted: '4 days ago',
    applicants: 156,
    views: 1234
  }
]

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All')
  const [sortBy, setSortBy] = useState('match')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const formatSalary = (amount: number) => {
    return (amount / 100000).toFixed(0) + ' LPA'
  }

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         career.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         career.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory
    const matchesLocation = selectedLocation === 'All' || career.location === selectedLocation
    const matchesExperience = selectedExperience === 'All' || career.experience === selectedExperience
    
    return matchesSearch && matchesCategory && matchesLocation && matchesExperience
  })

  const sortedCareers = [...filteredCareers].sort((a, b) => {
    switch (sortBy) {
      case 'match': return b.match - a.match
      case 'salary': return b.salary.max - a.salary.max
      case 'recent': return new Date(b.posted).getTime() - new Date(a.posted).getTime()
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Career Opportunities</h1>
            <p className="text-xl text-gray-600">Discover your perfect career match from 5000+ opportunities</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by role, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            {['AI/ML', 'Remote', 'High Growth', 'Startups', 'Tech Giants'].map((filter) => (
              <Button key={filter} variant="outline" size="sm" className="rounded-full">
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'}
                </Button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Categories</option>
                    {careerCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (LPA)</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="3"
                      max="50"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>¹3L</span>
                      <span>¹50L+</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {sortedCareers.length} careers " {sortedCareers.filter(c => c.match > 80).length} great matches
              </p>
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="match">Best Match</option>
                  <option value="salary">Highest Salary</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </div>

            {/* Career Cards */}
            <div className="space-y-6">
              {sortedCareers.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{career.title}</h3>
                            <p className="text-gray-600 flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {career.company}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={career.match > 85 ? 'success' : career.match > 70 ? 'default' : 'secondary'}
                              className="text-sm"
                            >
                              {career.match}% Match
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ¹{formatSalary(career.salary.min)}-{formatSalary(career.salary.max)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {career.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="w-4 h-4 mr-1" />
                            {career.experience}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Growth: {career.growth}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{career.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {career.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Expandable Section */}
                        <AnimatePresence>
                          {expandedCard === career.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-200 pt-4 mt-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">{career.workLifeBalance}</div>
                                  <div className="text-sm text-gray-600">Work-Life Balance</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">{career.futureReadiness}</div>
                                  <div className="text-sm text-gray-600">Future Readiness</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">{career.demand}</div>
                                  <div className="text-sm text-gray-600">Market Demand</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {career.applicants} applicants
                                  </span>
                                  <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {career.views} views
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    Posted {career.posted}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 lg:ml-4">
                        <Button size="sm" className="flex-1 lg:flex-none">
                          <Target className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedCard(expandedCard === career.id ? null : career.id)}
                        >
                          {expandedCard === career.id ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          }
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Opportunities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}