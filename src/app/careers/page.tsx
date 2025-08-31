'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  Search, Filter, MapPin, Clock, DollarSign, TrendingUp, 
  Users, Briefcase, Calendar, Star, ChevronRight, Heart,
  Building, Award, BookOpen, Bell, Sparkles
} from 'lucide-react'

const jobCategories = [
  { name: 'Technology', count: 1247, icon: Briefcase, color: 'bg-blue-500' },
  { name: 'Healthcare', count: 856, icon: Heart, color: 'bg-red-500' },
  { name: 'Finance', count: 643, icon: DollarSign, color: 'bg-green-500' },
  { name: 'Education', count: 532, icon: BookOpen, color: 'bg-purple-500' },
  { name: 'Marketing', count: 421, icon: TrendingUp, color: 'bg-orange-500' },
  { name: 'Design', count: 314, icon: Award, color: 'bg-pink-500' },
]

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp India',
    location: 'Bangalore',
    salary: '₹15-25 LPA',
    type: 'Full-time',
    experience: '3-5 years',
    skills: ['React', 'TypeScript', 'Node.js'],
    posted: '2 days ago',
    applicants: 45,
    matchScore: 95
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'Mumbai',
    salary: '₹20-30 LPA',
    type: 'Full-time',
    experience: '2-4 years',
    skills: ['Python', 'Machine Learning', 'SQL'],
    posted: '1 day ago',
    applicants: 32,
    matchScore: 88
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Hyderabad',
    salary: '₹18-28 LPA',
    type: 'Full-time',
    experience: '4-6 years',
    skills: ['Strategy', 'Analytics', 'Leadership'],
    posted: '3 hours ago',
    applicants: 23,
    matchScore: 92
  },
  {
    id: 4,
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Pune',
    salary: '₹12-18 LPA',
    type: 'Full-time',
    experience: '2-3 years',
    skills: ['Figma', 'User Research', 'Prototyping'],
    posted: '5 days ago',
    applicants: 67,
    matchScore: 85
  },
]

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
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
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
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8">
                    Search Jobs
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Active Jobs', value: '4,500+' },
                { label: 'Companies', value: '1,200+' },
                { label: 'Successful Placements', value: '25,000+' },
                { label: 'Average Salary Hike', value: '45%' },
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
            {jobCategories.map((category, index) => (
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
              <h2 className="text-2xl font-bold text-gray-900">Featured Opportunities</h2>
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

            <div className="space-y-6">
              {featuredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <Badge 
                            className={`text-xs ${job.matchScore >= 90 ? 'bg-green-100 text-green-800' : 
                              job.matchScore >= 80 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {job.matchScore}% match
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {job.company}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.posted}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.applicants} applicants
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Apply Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Jobs
              </Button>
            </div>
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