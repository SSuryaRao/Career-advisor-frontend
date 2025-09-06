'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  MessageSquareText, 
  BrainCircuit, 
  Target, 
  PlayCircle, 
  Mic, 
  MicOff,
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Zap,
  Users,
  Award,
  BarChart3
} from 'lucide-react'

// Mock data
const domains = [
  { value: 'data-science', label: 'Data Science' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'cloud-computing', label: 'Cloud Computing' },
  { value: 'ai-ml', label: 'AI/Machine Learning' },
  { value: 'mobile-development', label: 'Mobile Development' },
]

const rolesByDomain: { [key: string]: { value: string; label: string }[] } = {
  'data-science': [
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'data-analyst', label: 'Data Analyst' },
    { value: 'ml-engineer', label: 'ML Engineer' },
    { value: 'data-engineer', label: 'Data Engineer' },
  ],
  'web-development': [
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'fullstack-developer', label: 'Full-Stack Developer' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
  ],
  'cybersecurity': [
    { value: 'security-analyst', label: 'Security Analyst' },
    { value: 'penetration-tester', label: 'Penetration Tester' },
    { value: 'security-engineer', label: 'Security Engineer' },
    { value: 'incident-responder', label: 'Incident Response Specialist' },
  ],
  // Add more as needed...
}

const mockInterviewQuestions = [
  "Tell me about yourself and your background.",
  "What interests you about this role?",
  "Describe a challenging project you worked on.",
  "How do you stay updated with industry trends?",
  "What are your strengths and weaknesses?",
]

const aptitudeTestSets = [
  {
    id: 1,
    title: "Logical Reasoning",
    description: "Test your logical thinking and problem-solving abilities",
    questions: 15,
    duration: "20 minutes",
    difficulty: "Medium",
    icon: BrainCircuit,
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Quantitative Aptitude",
    description: "Mathematical reasoning and numerical problem solving",
    questions: 20,
    duration: "25 minutes", 
    difficulty: "Medium",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 3,
    title: "Verbal Ability",
    description: "Language comprehension and communication skills",
    questions: 12,
    duration: "15 minutes",
    difficulty: "Easy",
    icon: BookOpen,
    color: "from-green-500 to-emerald-600"
  },
]

const sampleAptitudeQuestion = {
  question: "If a train travels 120 km in 2 hours, what is its average speed?",
  options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
  correctAnswer: 1
}

type Mode = 'selection' | 'interview' | 'aptitude'
type TabMode = 'interview-tab' | 'aptitude-tab'

export default function MockInterviewPage() {
  const [mode, setMode] = useState<Mode>('selection')
  const [activeTab, setActiveTab] = useState<TabMode>('interview-tab')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [selectedAptitudeTest, setSelectedAptitudeTest] = useState<number | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [aptitudeAnswers, setAptitudeAnswers] = useState<number[]>([])
  const [currentAptitudeQuestion, setCurrentAptitudeQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const availableRoles = selectedDomain ? rolesByDomain[selectedDomain] || [] : []

  const handleStartInterview = () => {
    if (selectedDomain && selectedRole) {
      setMode('interview')
      setCurrentQuestionIndex(0)
      setAnswers([])
      setUserAnswer('')
    }
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = userAnswer
    setAnswers(newAnswers)
    
    if (currentQuestionIndex < mockInterviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer('')
    } else {
      // Interview complete
      alert('Interview completed! In a real implementation, this would provide feedback.')
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setUserAnswer(answers[currentQuestionIndex - 1] || '')
    }
  }

  const handleStartAptitudeTest = (testId: number) => {
    setSelectedAptitudeTest(testId)
    setMode('aptitude')
    setCurrentAptitudeQuestion(0)
    setAptitudeAnswers([])
    setSelectedOption(null)
    setShowResults(false)
  }

  const handleAptitudeNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...aptitudeAnswers]
      newAnswers[currentAptitudeQuestion] = selectedOption
      setAptitudeAnswers(newAnswers)
      
      // For demo, we only have 1 sample question
      setShowResults(true)
      setSelectedOption(null)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In real implementation, this would start/stop voice recording
  }

  const resetToSelection = () => {
    setMode('selection')
    setSelectedDomain('')
    setSelectedRole('')
    setSelectedAptitudeTest(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                  <MessageSquareText className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Mock Interview
              </span>
              <br />
              <span className="text-gray-800">&amp; Aptitude Practice</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Prepare for your dream role with AI-driven interview questions and comprehensive aptitude practice tests.
              <span className="text-indigo-600 font-semibold"> Build confidence and ace your next interview!</span>
            </motion.p>

            {/* Mode Toggle */}
            {mode === 'selection' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center space-x-4 mb-8"
              >
                <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                  <Button
                    onClick={() => setActiveTab('interview-tab')}
                    variant={activeTab === 'interview-tab' ? 'default' : 'ghost'}
                    className={`transition-all duration-300 ${
                      activeTab === 'interview-tab'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <MessageSquareText className="w-4 h-4 mr-2" />
                    Mock Interview
                  </Button>
                  <Button
                    onClick={() => setActiveTab('aptitude-tab')}
                    variant={activeTab === 'aptitude-tab' ? 'default' : 'ghost'}
                    className={`transition-all duration-300 ${
                      activeTab === 'aptitude-tab'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    Aptitude Tests
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {mode === 'selection' && (
          <>
            {/* Mock Interview Section */}
            {activeTab === 'interview-tab' && (
              <>
                {/* Role & Domain Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-12"
                >
                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Select Your Role & Domain</h2>
                        <p className="text-gray-600">Choose your target domain and specific role for tailored interview questions</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🎯 Career Domain
                        </label>
                        <Select
                          options={domains}
                          value={selectedDomain}
                          onValueChange={(value) => {
                            setSelectedDomain(value)
                            setSelectedRole('')
                          }}
                          placeholder="Select a domain"
                          className="text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          👤 Job Role
                        </label>
                        <Select
                          options={availableRoles}
                          value={selectedRole}
                          onValueChange={setSelectedRole}
                          placeholder="Select a role"
                          className="text-base"
                          disabled={!selectedDomain}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleStartInterview}
                      disabled={!selectedDomain || !selectedRole}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Start Mock Interview
                    </Button>
                  </Card>
                </motion.div>

                {/* Interview Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-12"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Why Choose <span className="text-blue-600">AI Mock Interview?</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Get personalized, role-specific interview preparation
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquareText className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Specific Questions</h3>
                      <p className="text-gray-600">Get questions tailored to your target job role and domain</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Voice & Text Answers</h3>
                      <p className="text-gray-600">Practice with both written and voice responses</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                      <p className="text-gray-600">Monitor your preparation progress and improvements</p>
                    </Card>
                  </div>
                </motion.div>
              </>
            )}

            {/* Aptitude Tests Section */}
            {activeTab === 'aptitude-tab' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Practice <span className="text-purple-600">Aptitude Tests</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Sharpen your skills with our comprehensive aptitude test series
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aptitudeTestSets.map((test, index) => {
                    const Icon = test.icon
                    return (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Card className="group p-6 h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                          <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-r ${test.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <Badge className={`px-2 py-1 text-xs font-semibold bg-gradient-to-r ${test.color} text-white border-0`}>
                                {test.difficulty}
                              </Badge>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                            {test.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {test.description}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {test.questions} questions
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {test.duration}
                            </div>
                          </div>

                          <Button
                            onClick={() => handleStartAptitudeTest(test.id)}
                            className={`w-full bg-gradient-to-r ${test.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start Test
                          </Button>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Mock Interview Mode */}
        {mode === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Interview Progress Panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageSquareText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Interview Progress</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Questions</span>
                      <span>{currentQuestionIndex + 1}/{mockInterviewQuestions.length}</span>
                    </div>
                    <Progress value={(currentQuestionIndex + 1) / mockInterviewQuestions.length * 100} className="h-3" />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Target className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{rolesByDomain[selectedDomain]?.find(r => r.value === selectedRole)?.label}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{domains.find(d => d.value === selectedDomain)?.label}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={resetToSelection}
                    variant="outline"
                    className="w-full mt-6"
                  >
                    End Interview
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Interview Area */}
            <div className="lg:col-span-3">
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300">
                      Question {currentQuestionIndex + 1} of {mockInterviewQuestions.length}
                    </Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>No time limit</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                      {mockInterviewQuestions[currentQuestionIndex]}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-lg font-semibold text-gray-900">Your Answer</label>
                      <Button
                        onClick={toggleRecording}
                        variant="outline"
                        size="sm"
                        className={`flex items-center space-x-2 ${isRecording ? 'bg-red-50 border-red-300 text-red-700' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                      >
                        {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        <span>{isRecording ? 'Recording...' : 'Voice Answer'}</span>
                      </Button>
                    </div>
                    
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here or use voice recording..."
                      className="min-h-[120px] text-base resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>
                    
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!userAnswer.trim()}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <span>{currentQuestionIndex === mockInterviewQuestions.length - 1 ? 'Complete' : 'Next Question'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Aptitude Test Mode */}
        {mode === 'aptitude' && !showResults && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Test Progress Panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BrainCircuit className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Test Progress</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Question</span>
                      <span>1/1</span> {/* Demo: only 1 question */}
                    </div>
                    <Progress value={100} className="h-3" />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">15:00</div>
                      <div className="text-sm text-gray-500">Time Remaining</div>
                    </div>
                  </div>

                  <Button
                    onClick={resetToSelection}
                    variant="outline"
                    className="w-full mt-6"
                  >
                    End Test
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Test Area */}
            <div className="lg:col-span-3">
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <div className="mb-6">
                  <Badge className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 mb-4">
                    Question 1 of 1
                  </Badge>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                      {sampleAptitudeQuestion.question}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {sampleAptitudeQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedOption(index)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedOption === index
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          selectedOption === index
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedOption === index && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-lg text-gray-800">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleAptitudeNext}
                    disabled={selectedOption === null}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
                  >
                    Submit Test
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Aptitude Test Results */}
        {mode === 'aptitude' && showResults && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h2>
                <p className="text-xl text-gray-600">Here are your results</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1/1</div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {selectedOption === sampleAptitudeQuestion.correctAnswer ? '100%' : '0%'}
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2:30</div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => handleStartAptitudeTest(selectedAptitudeTest!)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mr-4"
                >
                  Retake Test
                </Button>
                <Button
                  onClick={resetToSelection}
                  variant="outline"
                >
                  Back to Tests
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}