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
  BookOpen, FileText, Video, Headphones, Download, Calendar,
  Clock, User, Star, Search, Filter, ChevronRight, Play,
  ExternalLink, Tag, TrendingUp, Users, Award, Bookmark
} from 'lucide-react'

const resourceCategories = [
  { name: 'Career Guides', count: 45, icon: BookOpen, color: 'bg-blue-500' },
  { name: 'Resume Templates', count: 25, icon: FileText, color: 'bg-green-500' },
  { name: 'Video Tutorials', count: 120, icon: Video, color: 'bg-red-500' },
  { name: 'Podcasts', count: 80, icon: Headphones, color: 'bg-purple-500' },
  { name: 'Webinars', count: 35, icon: Calendar, color: 'bg-orange-500' },
  { name: 'Templates', count: 60, icon: Download, color: 'bg-pink-500' },
]

const featuredResources = [
  {
    id: 1,
    title: 'Complete Guide to Technical Interviews',
    description: 'Master your next tech interview with comprehensive preparation strategies',
    type: 'Guide',
    category: 'Career Development',
    duration: '15 min read',
    rating: 4.8,
    downloads: 12500,
    author: 'Dr. Priya Sharma',
    tags: ['Interviews', 'Technical', 'Programming'],
    thumbnail: '/placeholder.jpg',
    isPremium: false
  },
  {
    id: 2,
    title: 'Resume Templates for Indian Students',
    description: 'ATS-friendly resume templates designed for the Indian job market',
    type: 'Template',
    category: 'Resume Building',
    duration: 'Download',
    rating: 4.9,
    downloads: 25000,
    author: 'Career Experts Team',
    tags: ['Resume', 'Templates', 'ATS'],
    thumbnail: '/placeholder.jpg',
    isPremium: false
  },
  {
    id: 3,
    title: 'Data Science Career Roadmap 2024',
    description: 'Step-by-step guide to becoming a successful data scientist in India',
    type: 'Video',
    category: 'Career Planning',
    duration: '45 min',
    rating: 4.7,
    downloads: 18000,
    author: 'Rajesh Kumar',
    tags: ['Data Science', 'Career Path', 'Skills'],
    thumbnail: '/placeholder.jpg',
    isPremium: true
  },
  {
    id: 4,
    title: 'Salary Negotiation Masterclass',
    description: 'Learn how to negotiate your salary like a pro with proven techniques',
    type: 'Webinar',
    category: 'Professional Development',
    duration: '1 hour',
    rating: 4.6,
    downloads: 8500,
    author: 'Meera Patel',
    tags: ['Salary', 'Negotiation', 'Career Growth'],
    thumbnail: '/placeholder.jpg',
    isPremium: true
  },
]

const trendingTopics = [
  { name: 'AI/ML Career Path', searches: '+245%' },
  { name: 'Remote Work Tips', searches: '+180%' },
  { name: 'Startup Jobs', searches: '+125%' },
  { name: 'Interview Preparation', searches: '+98%' },
  { name: 'Skill Development', searches: '+87%' },
]

const upcomingWebinars = [
  {
    id: 1,
    title: 'Product Management in Indian Startups',
    date: 'Dec 15, 2024',
    time: '6:00 PM IST',
    speaker: 'Ankit Gupta',
    company: 'Razorpay',
    attendees: 1250
  },
  {
    id: 2,
    title: 'Frontend Development Trends 2025',
    date: 'Dec 18, 2024',
    time: '7:00 PM IST',
    speaker: 'Shreya Singh',
    company: 'Microsoft',
    attendees: 2100
  },
  {
    id: 3,
    title: 'Career Switch to Tech at 30+',
    date: 'Dec 20, 2024',
    time: '8:00 PM IST',
    speaker: 'Rohit Mehta',
    company: 'Google',
    attendees: 890
  },
]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([])

  const toggleBookmark = (itemId: number) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

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
              Career Resources
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"> Hub</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Access comprehensive career resources, guides, templates, and expert insights 
              to accelerate your professional journey in the Indian market.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search resources, guides, templates..."
                    className="pl-12 border-0 text-gray-900 text-lg py-4 focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8">
                  Search
                </Button>
              </div>
            </div>

            {/* Resource Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Resources Available', value: '500+' },
                { label: 'Expert Contributors', value: '150+' },
                { label: 'Monthly Downloads', value: '50K+' },
                { label: 'Success Stories', value: '2,500+' },
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
        {/* Resource Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {resourceCategories.map((category, index) => (
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
                  <p className="text-gray-600 text-sm">{category.count} resources</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Resources */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Resources</h2>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Most Popular</option>
                    <option>Latest</option>
                    <option>Highest Rated</option>
                    <option>Most Downloaded</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {featuredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {resource.type === 'Video' ? (
                            <Play className="w-8 h-8 text-blue-600" />
                          ) : resource.type === 'Template' ? (
                            <FileText className="w-8 h-8 text-green-600" />
                          ) : resource.type === 'Webinar' ? (
                            <Calendar className="w-8 h-8 text-orange-600" />
                          ) : (
                            <BookOpen className="w-8 h-8 text-purple-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <h3 className="text-xl font-semibold text-gray-900">{resource.title}</h3>
                                {resource.isPremium && (
                                  <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">{resource.description}</p>
                            </div>
                            <button
                              onClick={() => toggleBookmark(resource.id)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Bookmark 
                                className={`w-5 h-5 ${bookmarkedItems.includes(resource.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
                              />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {resource.author}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {resource.duration}
                            </div>
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {resource.downloads.toLocaleString()}
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {resource.rating}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              {resource.type === 'Template' ? 'Download' : 'View'}
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Resources
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-900">{topic.name}</span>
                    <span className="text-sm text-green-600 font-semibold">{topic.searches}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Webinars */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Upcoming Webinars
              </h3>
              <div className="space-y-4">
                {upcomingWebinars.map((webinar) => (
                  <div key={webinar.id} className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{webinar.title}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {webinar.date} at {webinar.time}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {webinar.speaker} • {webinar.company}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {webinar.attendees} registered
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Register Free
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Webinars
              </Button>
            </Card>

            {/* Newsletter Signup */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <h3 className="text-lg font-semibold mb-4">Weekly Career Insights</h3>
              <p className="text-gray-700 mb-4 text-sm">
                Get the latest career resources, job market trends, and expert tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input type="email" placeholder="Enter your email" />
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Subscribe Now
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Join 25,000+ professionals. Unsubscribe anytime.
              </p>
            </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
              <div className="space-y-2">
                {[
                  { name: 'Resume Builder', icon: FileText },
                  { name: 'Interview Prep', icon: Users },
                  { name: 'Salary Calculator', icon: TrendingUp },
                  { name: 'Skill Assessment', icon: Award },
                ].map((link, index) => (
                  <button key={index} className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <link.icon className="w-4 h-4 mr-3 text-blue-600" />
                    <span className="font-medium text-gray-900">{link.name}</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}