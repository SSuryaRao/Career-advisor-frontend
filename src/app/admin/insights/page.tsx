'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart
} from 'recharts'
import {
  Users, TrendingUp, BookOpen, Target, Award, MapPin,
  Download, RefreshCw, Calendar, Sparkles, Brain, CheckCircle2
} from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e']

export default function AdminInsightsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'api' | 'looker'>('api') // Toggle between views

  useEffect(() => {
    if (user) {
      fetchInsights()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchInsights = async () => {
    try {
      setIsLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      const response = await fetch(`${API_BASE_URL}/api/analytics/admin/dashboard`)
      if (response.ok) {
        const data = await response.json()
        setInsights(data.data)
        setLastSync(new Date())
      } else {
        console.error('Failed to fetch insights:', response.status)
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      const response = await fetch(`${API_BASE_URL}/api/analytics/sync/all`, {
        method: 'POST'
      })

      if (response.ok) {
        await fetchInsights()
        alert('Data synced successfully!')
      } else {
        alert('Sync failed. Please try again.')
      }
    } catch (error) {
      console.error('Error syncing data:', error)
      alert('Sync failed. Please check console for details.')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleExport = () => {
    // Generate CSV export of insights data
    if (!insights) return

    const csvData = [
      ['Career Insights Dashboard Export'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Career Domains Distribution:'],
      ...insights.careerDomains.map((item: any) => [item.careerDomain, item.studentCount]),
      [''],
      ['Top Skills:'],
      ...insights.topSkills.map((item: any) => [item.skillName, item.userCount, item.category])
    ]

    const csv = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career-insights-${Date.now()}.csv`
    a.click()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view analytics dashboard</p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Sign In
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics dashboard...</p>
          </Card>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
            <p className="text-gray-600 mb-6">Run data sync to populate the dashboard</p>
            <Button onClick={handleSync} disabled={isSyncing} className="w-full">
              {isSyncing ? 'Syncing...' : 'Sync Data Now'}
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const careerDomainsData = insights.careerDomains || []
  const topSkillsData = insights.topSkills?.slice(0, 10) || []
  const atsImprovementData = insights.atsImprovement || []
  const studentsByStateData = insights.studentsByState?.slice(0, 10) || []
  const roiComparisonData = insights.roiComparison || []
  const scholarshipStatsData = insights.scholarshipStats || []

  // Calculate summary stats
  const totalStudents = careerDomainsData.reduce((sum: number, item: any) => sum + (item.studentCount || 0), 0)
  const totalSkills = topSkillsData.reduce((sum: number, item: any) => sum + (item.userCount || 0), 0)
  const avgAtsScore = atsImprovementData.length > 0
    ? (atsImprovementData.reduce((sum: number, item: any) => sum + (item.avgScore || 0), 0) / atsImprovementData.length).toFixed(1)
    : 0
  const totalScholarships = scholarshipStatsData.reduce((sum: number, item: any) => sum + (item.applicationCount || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden mt-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Career Insights Dashboard
              </h1>
              <p className="text-xl text-blue-100">
                Real-time analytics powered by Google Cloud BigQuery
              </p>
              {lastSync && (
                <p className="text-sm text-blue-200 mt-2">
                  Last updated: {lastSync.toLocaleString()}
                </p>
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('api')}
                  variant={viewMode === 'api' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'api' ? 'bg-white text-indigo-600' : 'text-white hover:bg-white/20'}
                >
                  API Charts
                </Button>
                <Button
                  onClick={() => setViewMode('looker')}
                  variant={viewMode === 'looker' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'looker' ? 'bg-white text-indigo-600' : 'text-white hover:bg-white/20'}
                >
                  Looker Studio
                </Button>
              </div>
              <Button
                onClick={handleExport}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-white text-indigo-600 hover:bg-blue-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Data'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-6">
        {/* Looker Studio Embed View */}
        {viewMode === 'looker' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Looker Studio Dashboard</h3>
                <p className="text-sm text-gray-600">Interactive visualizations powered by Google Looker Studio</p>
              </div>
              <div className="w-full" style={{ height: '800px' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://lookerstudio.google.com/embed/reporting/73950949-9f36-49e4-a9bd-5764c58f62ac/page/gYLcF"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                ></iframe>
              </div>
            </Card>
          </motion.div>
        )}

        {/* API Charts View */}
        {viewMode === 'api' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Total</Badge>
              </div>
              <p className="text-3xl font-bold">{totalStudents}</p>
              <p className="text-blue-100 text-sm">Active Students</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Skills</Badge>
              </div>
              <p className="text-3xl font-bold">{totalSkills}</p>
              <p className="text-purple-100 text-sm">Total Skill Engagements</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xl border-0">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Average</Badge>
              </div>
              <p className="text-3xl font-bold">{avgAtsScore}%</p>
              <p className="text-pink-100 text-sm">ATS Score</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl border-0">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Applied</Badge>
              </div>
              <p className="text-3xl font-bold">{totalScholarships}</p>
              <p className="text-orange-100 text-sm">Scholarship Applications</p>
            </Card>
          </motion.div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Career Domains Distribution */}
          {careerDomainsData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Career Domains</h3>
                    <p className="text-sm text-gray-600">Distribution by student count</p>
                  </div>
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={careerDomainsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ careerDomain, studentCount }) => `${careerDomain}: ${studentCount}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="studentCount"
                        nameKey="careerDomain"
                      >
                        {careerDomainsData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Top Skills */}
          {topSkillsData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Top Emerging Skills</h3>
                    <p className="text-sm text-gray-600">Most demanded by students</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSkillsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="skillName" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="userCount" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ATS Score Improvement */}
          {atsImprovementData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">ATS Score Trends</h3>
                    <p className="text-sm text-gray-600">Average scores over time</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={atsImprovementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="avgScore"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Average Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Students by State */}
          {studentsByStateData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Geographic Distribution</h3>
                    <p className="text-sm text-gray-600">Students by state</p>
                  </div>
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentsByStateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="state" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="studentCount" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ROI Comparison */}
          {roiComparisonData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">ROI Analysis</h3>
                    <p className="text-sm text-gray-600">Career domain performance metrics</p>
                  </div>
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Domain</th>
                        <th className="text-right py-3 px-4 font-semibold">Users</th>
                        <th className="text-right py-3 px-4 font-semibold">Avg ATS Score</th>
                        <th className="text-right py-3 px-4 font-semibold">Mock Interview</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roiComparisonData.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{item.careerDomain}</td>
                          <td className="py-3 px-4 text-right">{item.totalUsers}</td>
                          <td className="py-3 px-4 text-right">
                            {item.avgAtsScore ? `${item.avgAtsScore.toFixed(1)}%` : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.avgMockInterviewScore ? `${item.avgMockInterviewScore.toFixed(1)}%` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

          </>
        )}

        {/* Powered By Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <p className="text-sm text-gray-600 mb-2">Powered by</p>
            <div className="flex items-center justify-center space-x-4">
              <Badge className="bg-blue-100 text-blue-700 text-sm">Google Cloud BigQuery</Badge>
              <Badge className="bg-purple-100 text-purple-700 text-sm">Real-time Analytics</Badge>
              <Badge className="bg-pink-100 text-pink-700 text-sm">
                {viewMode === 'looker' ? 'Looker Studio' : 'AI-Driven Insights'}
              </Badge>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
