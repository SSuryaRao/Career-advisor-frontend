'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { geminiAI, type ChatMessage } from '@/lib/gemini'
import {
  Send, Mic, MicOff, Volume2, VolumeX, Bot, User, 
  Languages, Sparkles, ThumbsUp, ThumbsDown, Copy,
  Zap, Brain, Target, BookOpen, Users, AlertCircle,
  Check, Loader2
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
  const [error, setError] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [mentorDropdownOpen, setMentorDropdownOpen] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = selectedLanguage.code === 'en' ? 'en-US' : `${selectedLanguage.code}-IN`
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(prev => prev + ' ' + transcript)
        setIsRecording(false)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        setError('Voice recognition failed. Please try typing instead.')
      }
      
      recognitionRef.current = recognition
    }
  }, [selectedLanguage])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-dropdown') && !target.closest('.mentor-dropdown')) {
        setLanguageDropdownOpen(false)
        setMentorDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    console.log('📤 Sending message:', inputMessage)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsTyping(true)
    setError(null)

    try {
      // Check if API key exists
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        console.error('❌ API Key is missing!')
        throw new Error('API Key is missing! Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file and restart the server.')
      }

      console.log('🔧 API Key found, preparing request...')
      
      // Convert messages to ChatMessage format
      const chatHistory: ChatMessage[] = messages
        .slice(-10) // Limit to last 10 messages
        .filter(msg => msg.type !== 'assistant' || !msg.content.includes('Hello! I\'m your AI Career Mentor'))
        .map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }))

      const mentorContext = {
        mentorName: selectedMentor.name,
        specialty: selectedMentor.specialty,
        personality: selectedMentor.personality,
        language: selectedLanguage.name
      }

      console.log('🎯 Calling Gemini API with context:', mentorContext)

      let response
      try {
        // Call the actual Gemini API
        response = await geminiAI.generateResponse(currentInput, mentorContext, chatHistory)
        console.log('✅ API Response received:', response)
      } catch (apiError: any) {
        console.error('❌ API Error:', apiError)
        
        // If API fails, provide a helpful error message
        if (apiError.message?.includes('API_KEY_INVALID')) {
          throw new Error('Your API key is invalid. Please check your Gemini API key.')
        } else if (apiError.message?.includes('QUOTA_EXCEEDED')) {
          throw new Error('API quota exceeded. Please try again later.')
        } else {
          // Fallback response for debugging
          response = {
            content: `I understand you said: "${currentInput}". However, I'm experiencing connection issues. 

Error: ${apiError.message || 'Unknown API error'}

To fix this:
1. Ensure your NEXT_PUBLIC_GEMINI_API_KEY is set in .env.local
2. Restart your development server (npm run dev)
3. Check that your API key has access to Gemini 1.5 Flash
4. Look for detailed errors in the browser console (F12)`,
            suggestions: [
              'Check API configuration',
              'Verify environment setup',
              'Try a simpler query',
              'Check browser console'
            ]
          }
        }
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content || 'I apologize, but I couldn\'t generate a response. Please try again.',
        timestamp: new Date(),
        suggestions: response.suggestions || []
      }

      console.log('✨ Adding AI response to messages')
      setMessages(prev => [...prev, aiResponse])

    } catch (error: any) {
      console.error('💥 Error in handleSendMessage:', error)
      setError(error.message || 'Something went wrong. Please try again.')
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I encountered an error: ${error.message}

Please ensure:
1. Your .env.local file contains: NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
2. You've restarted the server after adding the API key
3. Your API key is valid and has access to Gemini API

For detailed errors, check the browser console (Press F12).`,
        timestamp: new Date(),
        suggestions: ['Check setup guide', 'Verify API key', 'Try again']
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      console.log('🏁 Message handling complete')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = (actionText: string) => {
    setInputMessage(actionText)
    inputRef.current?.focus()
  }

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition is not supported in your browser')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.error('Failed to start recording:', error)
        setError('Failed to start voice recording')
      }
    }
  }

  const handleSpeakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(content)
        utterance.lang = selectedLanguage.code === 'en' ? 'en-US' : `${selectedLanguage.code}-IN`
        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
      }
    }
  }

  const copyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100 bg-mentor-pattern">
      {/* Header */}
      <div className="glass-mentor border-b border-purple-200/50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 gradient-mentor rounded-3xl flex items-center justify-center text-2xl shadow-xl ring-4 ring-white/50">
                  {selectedMentor.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{selectedMentor.name}</h1>
                <p className="text-sm flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                  {selectedMentor.specialty} • Online
                </p>
                <p className="text-xs text-purple-600 font-medium mt-1">{selectedMentor.personality}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative language-dropdown">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setLanguageDropdownOpen(!languageDropdownOpen)
                    setMentorDropdownOpen(false)
                  }}
                  className="bg-white/60 hover:bg-white/80 border-purple-200/60 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                >
                  <Languages className="w-4 h-4 mr-2" />
                  {selectedLanguage.flag} {selectedLanguage.name}
                </Button>
                <AnimatePresence>
                  {languageDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang)
                            setLanguageDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center transition-colors"
                          style={{ color: '#374151' }}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mentor Selector */}
              <div className="relative mentor-dropdown">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setMentorDropdownOpen(!mentorDropdownOpen)
                    setLanguageDropdownOpen(false)
                  }}
                  className="bg-white/60 hover:bg-white/80 border-purple-200/60 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Switch Mentor
                </Button>
                <AnimatePresence>
                  {mentorDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      {mentorPersonas.map((mentor) => (
                        <button
                          key={mentor.id}
                          onClick={() => {
                            setSelectedMentor(mentor)
                            setMentorDropdownOpen(false)
                          }}
                          className={`w-full text-left p-4 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 transition-colors ${
                            selectedMentor.id === mentor.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{mentor.avatar}</div>
                            <div>
                              <div className="font-medium" style={{ color: '#111827' }}>{mentor.name}</div>
                              <div className="text-sm" style={{ color: '#6b7280' }}>{mentor.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/20 backdrop-blur-sm border-b border-purple-200/30 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.text)}
                disabled={isTyping}
                className="text-xs rounded-full mentor-card hover:bg-white shadow-md border-purple-200 hover:border-purple-400 hover:text-purple-700 transition-all duration-300 font-medium"
              >
                <action.icon className="w-3 h-3 mr-2" />
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border-l-4 border-red-400 overflow-hidden"
          >
            <div className="p-4">
              <div className="max-w-4xl mx-auto flex">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 text-sm">{error}</p>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800 p-0 h-auto mt-1"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-purple-50/20">
        <div className="max-w-6xl mx-auto space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start space-x-3 mb-2">
                  {/* Avatar for Assistant */}
                  {message.type === 'assistant' && (
                    <div className="w-12 h-12 gradient-mentor rounded-2xl flex items-center justify-center text-sm shadow-lg flex-shrink-0 ring-2 ring-purple-200/50">
                      {selectedMentor.avatar}
                    </div>
                  )}
                  
                  {/* Avatar for User */}
                  {message.type === 'user' && (
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center order-2 shadow-lg flex-shrink-0 ring-2 ring-emerald-200/50">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  {/* Message Card - Fixed with explicit styling */}
                  <div 
                    className={`px-6 py-5 rounded-2xl shadow-lg border-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
                        : 'mentor-card'
                    }`}
                    style={{
                      maxWidth: '100%',
                      wordBreak: 'break-word',
                      backgroundColor: message.type === 'user' ? undefined : undefined
                    }}
                  >
                    {/* Message Content - Most Important Fix */}
                    <div 
                      className={message.type === 'user' ? 'text-white' : 'text-gray-900'}
                      style={{
                        color: message.type === 'user' ? '#ffffff' : '#111827',
                        fontSize: '14px',
                        lineHeight: '1.75',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        backgroundColor: 'transparent',
                        opacity: 1,
                        visibility: 'visible'
                      }}
                    >
                      {message.content}
                    </div>
                    
                    {/* Assistant Message Actions */}
                    {message.type === 'assistant' && (
                      <div 
                        className="flex items-center justify-between mt-3 pt-3" 
                        style={{ borderTop: '1px solid #e5e7eb' }}
                      >
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyMessage(message.content, message.id)}
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                            style={{ color: '#6b7280' }}
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-4 h-4" style={{ color: '#10b981' }} />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSpeakMessage(message.content)}
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                            style={{ color: '#6b7280' }}
                          >
                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <button 
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors" 
                            style={{ color: '#6b7280' }}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors" 
                            style={{ color: '#6b7280' }}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {/* User Message Timestamp */}
                    {message.type === 'user' && (
                      <div className="flex justify-end mt-2">
                        <span style={{ fontSize: '12px', color: '#dbeafe', opacity: 0.9 }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-13 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(suggestion)}
                        disabled={isTyping}
                        className="text-xs rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                        style={{
                          fontSize: '12px',
                          padding: '6px 14px',
                          color: '#7c3aed'
                        }}
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        <span style={{ color: '#1e40af' }}>{suggestion}</span>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start space-x-3"
              >
                <div className="w-12 h-12 gradient-mentor rounded-2xl flex items-center justify-center text-sm shadow-lg ring-2 ring-purple-200/50">
                  {selectedMentor.avatar}
                </div>
                <div className="mentor-card px-6 py-5 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

{/* Input Section */}
      <div className="glass-mentor border-t border-purple-200/50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career... Press Shift+Enter for new line"
                className="pr-12 py-4 text-gray-900 placeholder-gray-500 text-base rounded-2xl border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 shadow-md resize-none min-h-[60px] max-h-32 bg-white/90 backdrop-blur-sm"
                rows={1}
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceToggle}
                disabled={isTyping}
                className={`absolute right-3 bottom-3 h-9 w-9 p-0 rounded-full ${
                  isRecording 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-md' 
                    : 'text-purple-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isTyping}
              className="h-[60px] px-6 rounded-2xl btn-mentor shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-600">
              AI responses are based on your profile and current market data. Always verify important decisions.
            </p>
            <div className="flex items-center space-x-2 text-xs text-purple-600 font-medium">
              <span>Powered by Gemini AI</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}