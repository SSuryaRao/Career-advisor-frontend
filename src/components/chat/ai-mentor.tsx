'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Send, Mic, MicOff, Volume2, VolumeX, Bot, User, 
  Languages, Sparkles, ThumbsUp, ThumbsDown, Copy,
  RotateCcw, Zap, Brain, Target, BookOpen, Users
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  language?: string
  suggestions?: string[]
}

interface MentorPersona {
  id: string
  name: string
  specialty: string
  description: string
  avatar: string
  personality: string
}

const mentorPersonas: MentorPersona[] = [
  {
    id: 'career-guide',
    name: 'Arjun - Career Guide',
    specialty: 'Career Planning',
    description: 'Helps with career path decisions and goal setting',
    avatar: '👨‍💼',
    personality: 'Professional and strategic'
  },
  {
    id: 'tech-mentor',
    name: 'Priya - Tech Mentor',
    specialty: 'Technology Careers',
    description: 'Expert in software engineering and tech industry',
    avatar: '👩‍💻',
    personality: 'Technical and innovative'
  },
  {
    id: 'skill-coach',
    name: 'Raj - Skill Coach',
    specialty: 'Skill Development',
    description: 'Focuses on skill gaps and learning roadmaps',
    avatar: '🎯',
    personality: 'Motivational and detailed'
  },
  {
    id: 'interview-prep',
    name: 'Meera - Interview Coach',
    specialty: 'Interview Preparation',
    description: 'Specializes in interview skills and communication',
    avatar: '🗣️',
    personality: 'Encouraging and practical'
  }
]

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
]

const quickActions = [
  { text: 'Show me career paths in AI/ML', icon: Brain },
  { text: 'Analyze my skill gaps', icon: Target },
  { text: 'Recommend learning resources', icon: BookOpen },
  { text: 'Help with interview prep', icon: Users },
  { text: 'Create a roadmap for my goals', icon: Zap },
]

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Career Mentor. I can help you with career planning, skill development, and job search strategies. What would you like to explore today?',
      timestamp: new Date(),
      suggestions: [
        'Show me career opportunities in technology',
        'Help me analyze my skills',
        'Create a learning roadmap',
        'Prepare for interviews'
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(mentorPersonas[0])
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        suggestions: generateSuggestions(inputMessage)
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('career') || lowerInput.includes('job')) {
      return `Based on your profile, I see great potential in several career paths. Given the current market trends and your interests, here are some recommendations:

**Top Matches for You:**
• **Data Scientist** (92% match) - High growth industry with ₹15-25 LPA potential
• **Product Manager** (88% match) - Great for your analytical and leadership skills  
• **Software Engineer** (85% match) - Stable career with remote work opportunities

Would you like me to dive deeper into any of these paths or analyze what skills you need to develop?`
    }
    
    if (lowerInput.includes('skill') || lowerInput.includes('learn')) {
      return `I've analyzed your current skill set and identified some key areas for development:

**Priority Skills to Develop:**
🎯 **Python & Data Analysis** - 3 month timeline
🎯 **Communication & Presentation** - Ongoing practice
🎯 **Project Management** - 2 month certification course

**Recommended Learning Path:**
1. Start with Python fundamentals (Coursera - 4 weeks)
2. Join a public speaking club like Toastmasters
3. Get certified in Agile/Scrum methodology

I can create a detailed weekly study plan if you're interested!`
    }
    
    return `That's a great question! Based on your career goals and current market trends, here's what I recommend:

I can help you explore this topic in detail. Whether you're looking to switch careers, advance in your current role, or develop new skills, I'm here to provide personalized guidance.

What specific aspect would you like to focus on? I can provide detailed insights, create action plans, or connect you with relevant resources and mentors.`
  }

  const generateSuggestions = (userInput: string): string[] => {
    return [
      'Tell me more about salary expectations',
      'Show me the learning roadmap',
      'Find relevant courses and certifications',
      'Connect me with industry mentors'
    ]
  }

  const handleQuickAction = (actionText: string) => {
    setInputMessage(actionText)
    inputRef.current?.focus()
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handleSpeakToggle = () => {
    setIsSpeaking(!isSpeaking)
    // Text-to-speech logic would go here
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                {selectedMentor.avatar}
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{selectedMentor.name}</h1>
                <p className="text-sm text-gray-600">{selectedMentor.specialty}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative group">
              <Button variant="outline" size="sm">
                <Languages className="w-4 h-4 mr-2" />
                {selectedLanguage.flag} {selectedLanguage.name}
              </Button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Selector */}
            <div className="relative group">
              <Button variant="outline" size="sm">
                <Bot className="w-4 h-4 mr-2" />
                Switch Mentor
              </Button>
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {mentorPersonas.map((mentor) => (
                  <button
                    key={mentor.id}
                    onClick={() => setSelectedMentor(mentor)}
                    className="w-full text-left p-4 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{mentor.avatar}</div>
                      <div>
                        <div className="font-medium">{mentor.name}</div>
                        <div className="text-sm text-gray-600">{mentor.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/50 border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.text)}
                className="text-xs rounded-full"
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start space-x-3 mb-2">
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm">
                      {selectedMentor.avatar}
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center order-2">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <Card className={`p-4 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.type === 'assistant' && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => copyMessage(message.content)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleSpeakToggle}>
                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </Card>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-11 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(suggestion)}
                        className="text-xs rounded-full"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm">
                  {selectedMentor.avatar}
                </div>
                <Card className="p-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" />
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your career..."
                className="pr-12 py-3"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceToggle}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                  isRecording ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI responses are based on your profile and current market data. Always verify important decisions.
          </p>
        </div>
      </div>
    </div>
  )
}