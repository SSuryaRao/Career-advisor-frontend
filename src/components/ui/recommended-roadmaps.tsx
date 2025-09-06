'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users,
  ChevronRight,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

interface Recommendation {
  title: string
  matchScore: number
  matchedSkills: string[]
  matchedInterests: string[]
  roi: {
    time: string
    cost: number
    salary: string
    roiFactor: string
  }
  trends: string
  previewTopics: string[]
  domain: string
  skillLevel: string
}

interface RecommendedRoadmapsProps {
  onStartRoadmap: (domain: string, skillLevel: string) => void
}

export function RecommendedRoadmaps({ onStartRoadmap }: RecommendedRoadmapsProps) {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileCompleteness, setProfileCompleteness] = useState(0)

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user])

  const fetchRecommendations = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // First try to get existing recommendations
      let response = await apiClient.getRecommendations()
      
      if (!response.success || !response.data) {
        // If no recommendations exist, generate new ones
        response = await apiClient.generateRecommendations()
      }

      if (response.success && response.data) {
        const recommendationsData = response.data.recommendations || response.data
        setRecommendations(recommendationsData)
        
        if (response.data.profileCompleteness !== undefined) {
          setProfileCompleteness(response.data.profileCompleteness)
        }
      } else {
        throw new Error(response.error || 'Failed to fetch recommendations')
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const generateNewRecommendations = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await apiClient.generateRecommendations()
      if (response.success && response.data) {
        setRecommendations(response.data.recommendations)
        if (response.data.profileCompleteness !== undefined) {
          setProfileCompleteness(response.data.profileCompleteness)
        }
        toast.success('Recommendations updated!')
      } else {
        throw new Error(response.error || 'Failed to generate recommendations')
      }
    } catch (err) {
      console.error('Error generating recommendations:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-blue-500 to-indigo-600'
    if (score >= 40) return 'from-yellow-500 to-orange-600'
    return 'from-gray-500 to-slate-600'
  }

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Basic Match'
  }

  if (!user) {
    return (
      <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">Sign In for Personalized Recommendations</h3>
          <p className="text-amber-700">
            Complete your profile to get AI-powered career roadmap recommendations tailored just for you!
          </p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-100 border-0 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-indigo-900 mb-2">Analyzing Your Profile</h3>
          <p className="text-indigo-700">
            Our AI is generating personalized career recommendations...
          </p>
        </div>
      </Card>
    )
  }

  if (error && profileCompleteness < 30) {
    return (
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Complete Your Profile First</h3>
          <p className="text-blue-700 mb-4">
            To get personalized career recommendations, please add your skills and interests in your profile.
          </p>
          <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <p className="text-sm text-blue-600">Profile {profileCompleteness}% complete</p>
        </div>
      </Card>
    )
  }

  if (!recommendations.length) {
    return (
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-purple-900 mb-2">No Recommendations Yet</h3>
          <p className="text-purple-700 mb-4">
            Complete your profile with skills and interests to get personalized career recommendations.
          </p>
          <Button
            onClick={generateNewRecommendations}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Recommendations
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Star className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">🔥 Recommended for You</h2>
              <p className="text-blue-100 text-lg">
                AI-powered career paths based on your profile
              </p>
            </div>
          </div>
          <Button
            onClick={generateNewRecommendations}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            disabled={loading}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group p-6 h-full bg-gradient-to-br from-white to-gray-50/80 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              {/* Match Score Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={`px-3 py-1 text-white font-bold border-0 bg-gradient-to-r ${getMatchScoreColor(recommendation.matchScore)}`}>
                  {recommendation.matchScore}% {getMatchScoreLabel(recommendation.matchScore)}
                </Badge>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Skill Level</div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {recommendation.skillLevel}
                  </Badge>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {recommendation.title}
              </h3>

              {/* ROI Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-gray-600 text-xs">Duration</div>
                      <div className="font-bold text-green-800">{recommendation.roi.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-gray-600 text-xs">Expected Salary</div>
                      <div className="font-bold text-green-800">{recommendation.roi.salary}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-600">ROI</div>
                    <div className="font-bold text-green-800">{recommendation.roi.roiFactor}</div>
                  </div>
                </div>
              </div>

              {/* Job Trends */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Market Trends</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {recommendation.trends}
                </p>
              </div>

              {/* Preview Topics */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">Key Learning Areas:</div>
                <div className="flex flex-wrap gap-2">
                  {recommendation.previewTopics.slice(0, 3).map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {topic}
                    </Badge>
                  ))}
                  {recommendation.previewTopics.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                      +{recommendation.previewTopics.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Matched Skills & Interests */}
              {(recommendation.matchedSkills.length > 0 || recommendation.matchedInterests.length > 0) && (
                <div className="mb-6 space-y-2">
                  {recommendation.matchedSkills.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">Matched Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.matchedSkills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} className="text-xs bg-green-100 text-green-700 border-green-200">
                            ✓ {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {recommendation.matchedInterests.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">Matched Interests:</div>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.matchedInterests.slice(0, 2).map((interest, idx) => (
                          <Badge key={idx} className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                            💜 {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Start Roadmap Button */}
              <Button
                onClick={() => onStartRoadmap(recommendation.domain, recommendation.skillLevel)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <Target className="w-4 h-4 mr-2" />
                Start Roadmap
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}