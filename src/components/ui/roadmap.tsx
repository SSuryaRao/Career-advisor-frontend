'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { ROISummaryCard } from '@/components/ui/roi-summary-card'
import { 
  BookOpen, Clock, CheckCircle2, MapPin, Target, 
  Users, Code, Brain, Award, TrendingUp, ExternalLink 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
import toast from 'react-hot-toast'

interface RoadmapMilestone {
  id: string
  title: string
  description: string
  resources: string[]
  estimated_time: string
  prerequisites: string[]
  category: string
}

interface ROIData {
  estimatedTimeWeeks: number
  estimatedInvestment: number
  expectedSalaryRange: {
    min: number
    max: number
    average: number
  }
  roiSummary: {
    multiplier: number
    paybackPeriodMonths: number
    description: string
  }
  marketInsights: {
    demand: string
    growthRate: string
    avgTimeToJob: number
  }
  keySkills: string[]
  explanation: string
}

interface RoadmapData {
  domain: string
  total_estimated_time: string
  stages: {
    category: string
    milestones: RoadmapMilestone[]
  }[]
  roiCalculator?: ROIData
}

interface RoadmapProps {
  onGenerateRoadmap: (domain: string, skillLevel: string) => Promise<RoadmapData | null>
}

const careerDomains = [
  { value: 'web-development', label: 'Web Development', description: 'Frontend and backend web technologies' },
  { value: 'data-science', label: 'Data Science', description: 'Machine learning, analytics, and data engineering' },
  { value: 'mobile-development', label: 'Mobile Development', description: 'iOS, Android, and cross-platform development' },
  { value: 'cybersecurity', label: 'Cybersecurity', description: 'Network security, ethical hacking, and security analysis' },
  { value: 'cloud-computing', label: 'Cloud Computing', description: 'AWS, Azure, GCP, and cloud architecture' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence', description: 'ML, deep learning, and AI systems' },
  { value: 'devops', label: 'DevOps', description: 'CI/CD, infrastructure, and automation' },
  { value: 'blockchain', label: 'Blockchain', description: 'Cryptocurrency, smart contracts, and DeFi' }
]

const skillLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to the field, minimal experience' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience, looking to advance' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced, seeking specialization' }
]

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'foundations': return BookOpen
    case 'core skills': return Code
    case 'advanced topics': case 'advanced': return Brain
    case 'projects': return Target
    case 'career preparation': case 'career prep': return Award
    default: return MapPin
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'foundations': return 'from-indigo-500 to-blue-600'
    case 'core skills': return 'from-emerald-500 to-green-600'
    case 'advanced topics': case 'advanced': return 'from-purple-500 to-violet-600'
    case 'projects': return 'from-orange-500 to-amber-600'
    case 'career preparation': case 'career prep': return 'from-pink-500 to-rose-600'
    default: return 'from-gray-500 to-slate-600'
  }
}

export function Roadmap({ onGenerateRoadmap }: RoadmapProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('')
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Load saved progress on component mount
  useEffect(() => {
    if (user && roadmapData && selectedDomain && selectedSkillLevel) {
      loadSavedProgress()
    }
  }, [user, roadmapData, selectedDomain, selectedSkillLevel])

  const loadSavedProgress = async () => {
    if (!user || !selectedDomain || !selectedSkillLevel) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/roadmap-progress/get?userId=${user.uid}&careerDomain=${selectedDomain}&skillLevel=${selectedSkillLevel}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data.length > 0) {
          const progress = data.data[0]
          const completed = new Set(progress.completedMilestones.map((m: any) => m.milestoneId))
          setCompletedMilestones(completed)
          toast.success('Progress loaded successfully!')
        }
      }
    } catch (error) {
      console.error('Error loading saved progress:', error)
      toast.error('Failed to load saved progress')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProgress = async () => {
    if (!user || !roadmapData || !selectedDomain || !selectedSkillLevel) return

    try {
      const completedMilestonesArray = Array.from(completedMilestones).map(id => ({
        milestoneId: id,
        completedAt: new Date().toISOString()
      }))

      const response = await fetch('http://localhost:5000/api/roadmap-progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          careerDomain: selectedDomain,
          skillLevel: selectedSkillLevel,
          completedMilestones: completedMilestonesArray,
          roadmapData
        }),
      })

      if (response.ok) {
        toast.success('Progress saved successfully!')
      } else {
        throw new Error('Failed to save progress')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
      toast.error('Failed to save progress')
    }
  }

  const handleGenerateRoadmap = async () => {
    if (!selectedDomain || !selectedSkillLevel) return
    
    setIsGenerating(true)
    try {
      const data = await onGenerateRoadmap(selectedDomain, selectedSkillLevel)
      setRoadmapData(data)
      
      // Load any existing progress for this roadmap
      if (user) {
        setTimeout(() => loadSavedProgress(), 100)
      }
    } catch (error) {
      console.error('Error generating roadmap:', error)
      toast.error('Failed to generate roadmap')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleMilestone = async (milestoneId: string) => {
    const newCompleted = new Set(completedMilestones)
    if (newCompleted.has(milestoneId)) {
      newCompleted.delete(milestoneId)
    } else {
      newCompleted.add(milestoneId)
    }
    setCompletedMilestones(newCompleted)
    
    // Save progress immediately when milestone is toggled
    if (user && roadmapData && selectedDomain && selectedSkillLevel) {
      try {
        const completedMilestonesArray = Array.from(newCompleted).map(id => ({
          milestoneId: id,
          completedAt: new Date().toISOString()
        }))

        await fetch('http://localhost:5000/api/roadmap-progress/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            careerDomain: selectedDomain,
            skillLevel: selectedSkillLevel,
            completedMilestones: completedMilestonesArray,
            roadmapData
          }),
        })
      } catch (error) {
        console.error('Error saving milestone progress:', error)
      }
    }
  }

  const getMilestoneProgress = (milestones: RoadmapMilestone[]) => {
    const completed = milestones.filter(m => completedMilestones.has(m.id)).length
    return Math.round((completed / milestones.length) * 100)
  }

  // Helper function to convert resource names to actual URLs
  const getResourceUrl = (resourceName: string): string => {
    const resourceUrls: { [key: string]: string } = {
      // Programming Resources
      'freeCodeCamp HTML/CSS': 'https://www.freecodecamp.org/learn/responsive-web-design/',
      'NPTEL Web Technologies': 'https://nptel.ac.in/courses/106105084',
      'MDN Web Docs': 'https://developer.mozilla.org/en-US/docs/Web',
      'JavaScript.info': 'https://javascript.info/',
      'NPTEL JavaScript': 'https://nptel.ac.in/courses/106105171',
      'Codecademy JavaScript': 'https://www.codecademy.com/learn/introduction-to-javascript',
      
      // Frameworks
      'React Official Tutorial': 'https://react.dev/learn',
      'Scrimba React Course': 'https://scrimba.com/learn/learnreact',
      'NPTEL Web Development': 'https://nptel.ac.in/courses/106105153',
      
      // Backend & Databases
      'Node.js Documentation': 'https://nodejs.org/en/docs/',
      'Express.js Guide': 'https://expressjs.com/en/starter/installing.html',
      'NPTEL Database Systems': 'https://nptel.ac.in/courses/106106093',
      'MongoDB University': 'https://university.mongodb.com/',
      'SQL Tutorial': 'https://www.w3schools.com/sql/',
      
      // Data Science
      'Khan Academy Statistics': 'https://www.khanacademy.org/math/statistics-probability',
      'NPTEL Probability': 'https://nptel.ac.in/courses/111104079',
      'MIT Linear Algebra': 'https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/',
      'Python for Everybody (Coursera)': 'https://www.coursera.org/specializations/python',
      'NPTEL Python': 'https://nptel.ac.in/courses/106106145',
      'Pandas Documentation': 'https://pandas.pydata.org/docs/',
      'Matplotlib Tutorial': 'https://matplotlib.org/stable/tutorials/index.html',
      'Scikit-learn Tutorial': 'https://scikit-learn.org/stable/tutorial/index.html',
      
      // Mobile Development
      'Flutter Documentation': 'https://docs.flutter.dev/',
      'Dart Programming': 'https://dart.dev/guides',
      'Material Design': 'https://material.io/design',
      'iOS Design Guidelines': 'https://developer.apple.com/design/human-interface-guidelines/',
      
      // Cybersecurity
      'Security+ Study Guide': 'https://www.comptia.org/certifications/security',
      'Kali Linux': 'https://www.kali.org/',
      'SANS Incident Response': 'https://www.sans.org/cyber-security-courses/incident-response/',
      
      // Cloud Computing
      'AWS Cloud Practitioner': 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
      'Azure Fundamentals': 'https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/',
      'Docker Mastery': 'https://www.docker.com/get-started',
      'Kubernetes Course': 'https://kubernetes.io/docs/tutorials/',
      
      // AI/ML
      'Deep Learning Specialization': 'https://www.coursera.org/specializations/deep-learning',
      'TensorFlow Certification': 'https://www.tensorflow.org/certificate',
      'PyTorch Tutorials': 'https://pytorch.org/tutorials/',
      
      // DevOps
      'DevOps Handbook': 'https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002',
      'Jenkins Mastery': 'https://www.jenkins.io/doc/',
      'GitHub Actions': 'https://docs.github.com/en/actions',
      
      // Blockchain
      'Solidity Documentation': 'https://docs.soliditylang.org/',
      'Web3.js Guide': 'https://web3js.readthedocs.io/',
      'MetaMask Integration': 'https://docs.metamask.io/',
      
      // General Learning Platforms
      'Coursera': 'https://www.coursera.org/',
      'Udemy': 'https://www.udemy.com/',
      'UpGrad': 'https://www.upgrad.com/',
      'Internshala': 'https://internshala.com/',
      'GeeksforGeeks': 'https://www.geeksforgeeks.org/',
      'LeetCode': 'https://leetcode.com/',
      'Kaggle': 'https://www.kaggle.com/',
      'GitHub': 'https://github.com/',
      'Stack Overflow': 'https://stackoverflow.com/'
    }
    
    return resourceUrls[resourceName] || `https://www.google.com/search?q=${encodeURIComponent(resourceName)}`
  }

  return (
    <div className="space-y-6">
      {/* Roadmap Generator */}
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4 shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Journey</h3>
            <p className="text-gray-600 text-lg">Choose your domain and skill level to generate your personalized roadmap</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              🎯 Career Domain
            </label>
            <Select
              options={careerDomains}
              value={selectedDomain}
              onValueChange={setSelectedDomain}
              placeholder="Choose your career domain"
              className="text-base"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              📊 Current Skill Level
            </label>
            <Select
              options={skillLevels}
              value={selectedSkillLevel}
              onValueChange={setSelectedSkillLevel}
              placeholder="Select your current level"
              className="text-base"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleGenerateRoadmap}
            disabled={!selectedDomain || !selectedSkillLevel || isGenerating}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                ✨ Generating Your Roadmap...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-3" />
                🚀 Generate My Personalized Roadmap
              </>
            )}
          </Button>
          
          {!user && (
            <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700">
                💡 <strong>Sign in</strong> to save your progress and access your roadmaps from any device!
              </p>
            </div>
          )}
          
          {user && roadmapData && (
            <Button
              onClick={saveProgress}
              variant="outline"
              className="w-full text-sm py-2 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
            >
              💾 Save Progress (Auto-saved)
            </Button>
          )}
        </div>
      </Card>

      {/* Roadmap Display */}
      {roadmapData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Roadmap Header */}
          <Card className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  🎯 {roadmapData.domain} Roadmap
                </h2>
                <p className="text-gray-600 text-lg">Your personalized learning journey awaits!</p>
              </div>
              <div className="flex items-center space-x-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
                <Clock className="w-6 h-6 text-purple-500" />
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Time</div>
                  <div className="font-bold text-purple-600 text-lg">{roadmapData.total_estimated_time}</div>
                </div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-700">🚀 Overall Progress</span>
                <span className="text-lg font-bold text-purple-600">
                  {completedMilestones.size}/{roadmapData.stages.reduce((acc, stage) => acc + stage.milestones.length, 0)} milestones
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                  style={{ 
                    width: `${Math.round((completedMilestones.size / roadmapData.stages.reduce((acc, stage) => acc + stage.milestones.length, 0)) * 100)}%` 
                  }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {Math.round((completedMilestones.size / roadmapData.stages.reduce((acc, stage) => acc + stage.milestones.length, 0)) * 100)}%
                </span>
                <span className="text-gray-500 ml-1">Complete</span>
              </div>
            </div>
          </Card>

          {/* ROI Summary Card */}
          {roadmapData.roiCalculator && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ROISummaryCard 
                roiData={roadmapData.roiCalculator} 
                domain={roadmapData.domain}
              />
            </motion.div>
          )}

          {/* Roadmap Stages */}
          {roadmapData.stages.map((stage, stageIndex) => {
            const CategoryIcon = getCategoryIcon(stage.category)
            const progress = getMilestoneProgress(stage.milestones)
            
            return (
              <motion.div
                key={stage.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stageIndex * 0.1 }}
              >
                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(stage.category)} rounded-2xl blur-lg opacity-30 animate-pulse`} />
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${getCategoryColor(stage.category)} shadow-xl`}>
                          <CategoryIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{stage.category}</h3>
                        <p className="text-gray-600 text-lg flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                          {stage.milestones.length} milestones to master
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-center space-x-3 mb-3">
                          <TrendingUp className="w-5 h-5 text-purple-500" />
                          <span className="font-bold text-gray-800 text-lg">{progress}% Complete</span>
                        </div>
                        <div className="w-40 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-700 bg-gradient-to-r ${getCategoryColor(stage.category)} shadow-lg`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-center mt-2">
                          <span className={`text-lg font-bold bg-gradient-to-r ${getCategoryColor(stage.category)} bg-clip-text text-transparent`}>
                            {stage.milestones.filter(m => completedMilestones.has(m.id)).length}/{stage.milestones.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {stage.milestones.map((milestone, milestoneIndex) => {
                      const isCompleted = completedMilestones.has(milestone.id)
                      
                      return (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (stageIndex * 0.1) + (milestoneIndex * 0.05) }}
                          className={`group relative p-6 rounded-2xl border-0 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                            isCompleted 
                              ? 'bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl border-l-4 border-l-green-500' 
                              : 'bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-indigo-100 shadow-md hover:shadow-xl border-l-4 border-l-gray-300 hover:border-l-blue-500'
                          }`}
                          onClick={() => toggleMilestone(milestone.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Completion Status Indicator */}
                          {isCompleted && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                          
                          <div className="flex items-start space-x-5">
                            <div className="relative">
                              <button
                                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                                  isCompleted 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200 scale-110' 
                                    : 'bg-white border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 group-hover:border-purple-500'
                                }`}
                              >
                                <CheckCircle2 className={`w-5 h-5 transition-colors ${
                                  isCompleted ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'
                                }`} />
                              </button>
                              {isCompleted && (
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className={`text-xl font-bold transition-colors ${
                                  isCompleted 
                                    ? 'text-green-800 line-through opacity-75' 
                                    : 'text-gray-900 group-hover:text-purple-700'
                                }`}>
                                  {isCompleted ? '✅ ' : '🎯 '}{milestone.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={isCompleted ? "success" : "secondary"} 
                                    className={`px-3 py-1 text-sm font-semibold ${
                                      isCompleted 
                                        ? 'bg-green-100 text-green-800 border border-green-300' 
                                        : 'bg-purple-100 text-purple-800 border border-purple-300'
                                    }`}
                                  >
                                    ⏰ {milestone.estimated_time}
                                  </Badge>
                                  {isCompleted && (
                                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                      DONE!
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <p className={`text-base leading-relaxed mb-4 ${
                                isCompleted 
                                  ? 'text-green-700' 
                                  : 'text-gray-600 group-hover:text-gray-700'
                              }`}>
                                {milestone.description}
                              </p>
                              
                              {milestone.resources.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center mb-3">
                                    <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
                                    <p className="text-sm font-semibold text-gray-800">📚 Learning Resources:</p>
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                    {milestone.resources.map((resource, idx) => (
                                      <a
                                        key={idx}
                                        href={getResourceUrl(resource)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                      >
                                        <Badge 
                                          variant="outline" 
                                          className={`px-3 py-2 text-sm font-medium transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md flex items-center gap-1 ${
                                            isCompleted
                                              ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 hover:border-green-400'
                                              : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-400'
                                          }`}
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          {resource}
                                        </Badge>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {milestone.prerequisites.length > 0 && (
                                <div>
                                  <div className="flex items-center mb-3">
                                    <Target className="w-4 h-4 text-orange-500 mr-2" />
                                    <p className="text-sm font-semibold text-gray-800">🔗 Prerequisites:</p>
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                    {milestone.prerequisites.map((prereq, idx) => {
                                      const prereqMilestone = roadmapData.stages
                                        .flatMap(s => s.milestones)
                                        .find(m => m.id === prereq)
                                      const isPrereqCompleted = completedMilestones.has(prereq)
                                      return (
                                        <Badge 
                                          key={idx} 
                                          variant={isPrereqCompleted ? "success" : "secondary"}
                                          className={`px-3 py-2 text-sm font-medium transition-all ${
                                            isPrereqCompleted
                                              ? 'bg-green-100 text-green-800 border-green-300 shadow-md'
                                              : 'bg-orange-100 text-orange-800 border-orange-300'
                                          }`}
                                        >
                                          {isPrereqCompleted ? '✅ ' : '⏳ '}
                                          {prereqMilestone?.title || prereq}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}