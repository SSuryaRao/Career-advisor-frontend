'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import {
  Target, TrendingUp, Users, BookOpen, Clock, Star,
  Calendar, Award, Brain, MessageSquare, Video, FileText,
  ChevronRight, Plus, Search, Filter, Bell, Settings, CheckCircle2, Trophy,
  ChevronDown, MapPin, GraduationCap, Lightbulb
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import { featuredResources } from '@/data/resources'
import { Roadmap } from '@/components/ui/roadmap'

const careerProgressData = [
  { month: 'Jan', progress: 20 },
  { month: 'Feb', progress: 35 },
  { month: 'Mar', progress: 45 },
  { month: 'Apr', progress: 60 },
  { month: 'May', progress: 75 },
  { month: 'Jun', progress: 85 },
]

const skillsData = [
  { skill: 'JavaScript', level: 85, trend: '+15%' },
  { skill: 'Python', level: 78, trend: '+22%' },
  { skill: 'React', level: 82, trend: '+18%' },
  { skill: 'Communication', level: 70, trend: '+12%' },
  { skill: 'Leadership', level: 65, trend: '+8%' },
]

const careerMatchData = [
  { name: 'Perfect Match', value: 3, color: '#22c55e' },
  { name: 'Good Match', value: 8, color: '#3b82f6' },
  { name: 'Fair Match', value: 12, color: '#eab308' },
  { name: 'Explore More', value: 5, color: '#e11d48' },
]

const radarData = [
  { subject: 'Technical Skills', A: 85, fullMark: 100 },
  { subject: 'Communication', A: 70, fullMark: 100 },
  { subject: 'Leadership', A: 65, fullMark: 100 },
  { subject: 'Problem Solving', A: 90, fullMark: 100 },
  { subject: 'Creativity', A: 75, fullMark: 100 },
  { subject: 'Teamwork', A: 80, fullMark: 100 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userProgress, setUserProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSolutionsDropdown, setShowSolutionsDropdown] = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const router = useRouter()
  
  // Mock user ID - in real app, get from auth context
  const userId = '6746d123456789abcdef0123'
  
  useEffect(() => {
    fetchUserProgress()
  }, [])
  
  const fetchUserProgress = async () => {
    try {
      setIsLoading(true)
      // Mock API call - replace with actual API endpoint
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_BASE_URL}/progress/user/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data.data.progress)
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // Continue without progress data
    } finally {
      setIsLoading(false)
    }
  }

  const generateRoadmap = async (career_domain: string, skill_level: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_BASE_URL}/roadmap/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          career_domain,
          skill_level
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Failed to generate roadmap')
      }
    } catch (error) {
      console.error('Error generating roadmap:', error)
      return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-20 z-40 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your career progress.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              
              {/* Solutions Dropdown */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSolutionsDropdown(!showSolutionsDropdown)}
                  className="flex items-center"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Solutions
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showSolutionsDropdown ? 'rotate-180' : ''}`} />
                </Button>
                
                {showSolutionsDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowSolutionsDropdown(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            router.push('/solutions/students')
                            setShowSolutionsDropdown(false)
                          }}
                          className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <GraduationCap className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">For Students</div>
                            <div className="text-sm text-gray-600">Resources and tools for students</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowRoadmap(true)
                            setShowSolutionsDropdown(false)
                          }}
                          className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <MapPin className="w-5 h-5 text-purple-500 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Roadmap</div>
                            <div className="text-sm text-gray-600">Get personalized learning path</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Roadmap Modal/Overlay */}
        {showRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRoadmap(false)}
          >
            <div 
              className="fixed inset-4 bg-white rounded-xl shadow-2xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Career Roadmap Generator</h2>
                  <p className="text-gray-600">Create your personalized learning journey</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRoadmap(false)}
                >
                  Close
                </Button>
              </div>
              <div className="p-6">
                <Roadmap onGenerateRoadmap={generateRoadmap} />
              </div>
            </div>
          </motion.div>
        )}
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Career Progress</p>
                  <p className="text-3xl font-bold">85%</p>
                  <p className="text-sm text-blue-100">+12% from last month</p>
                </div>
                <Target className="w-10 h-10 text-blue-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Skills Mastered</p>
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-sm text-green-100">+3 this month</p>
                </div>
                <Star className="w-10 h-10 text-green-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Learning Hours</p>
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-sm text-purple-100">+23 this month</p>
                </div>
                <BookOpen className="w-10 h-10 text-purple-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Career Matches</p>
                  <p className="text-3xl font-bold">28</p>
                  <p className="text-sm text-orange-100">Updated today</p>
                </div>
                <TrendingUp className="w-10 h-10 text-orange-200" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Career Progress Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Career Progress Tracking</h3>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={careerProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Skills Development */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Skills Development</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {skillsData.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="success">{skill.trend}</Badge>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Mentor Chat Preview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  AI Mentor
                </h3>
                <Button size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    "Based on your recent progress, I recommend focusing on React advanced patterns next."
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    "Your leadership skills have improved by 8%. Consider taking on a team project!"
                  </p>
                </div>
              </div>
            </Card>

            {/* Career Match Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Career Match Analysis</h3>
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={careerMatchData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {careerMatchData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {careerMatchData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/resources')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/jobs')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Jobs
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/profile')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </Card>
            
            {/* Recent Learning Activity */}
            {userProgress && userProgress.completedResources && userProgress.completedResources.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Learning Activity</h3>
                <div className="space-y-3">
                  {userProgress.completedResources.slice(-3).reverse().map((completed: any) => {
                    const resource = featuredResources.find(r => r.id === completed.resourceId)
                    if (!resource) return null
                    
                    return (
                      <div key={completed.resourceId} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                          <p className="text-xs text-gray-600">
                            Completed {new Date(completed.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
            
            {/* Recent Achievements */}
            {userProgress && userProgress.achievements && userProgress.achievements.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Recent Achievements
                  </h3>
                  <Badge variant="secondary">{userProgress.achievements.length}</Badge>
                </div>
                <div className="space-y-3">
                  {userProgress.achievements.slice(-3).reverse().map((achievement: any, index: number) => (
                    <div key={achievement.id} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Weekly Goal Progress */}
            {userProgress && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-500" />
                  Weekly Learning Goal
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Progress this week</span>
                    <span className="text-lg font-bold text-blue-600">
                      {userProgress.stats?.weeklyGoal?.current || 0}/{userProgress.stats?.weeklyGoal?.target || 5}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(((userProgress.stats?.weeklyGoal?.current || 0) / (userProgress.stats?.weeklyGoal?.target || 5)) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {userProgress.stats?.weeklyGoal?.current >= userProgress.stats?.weeklyGoal?.target 
                      ? "🎉 Goal achieved! Great work this week!" 
                      : `${(userProgress.stats?.weeklyGoal?.target || 5) - (userProgress.stats?.weeklyGoal?.current || 0)} more to reach your weekly goal`}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Personality Radar Chart */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-6">Personality & Skills Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
