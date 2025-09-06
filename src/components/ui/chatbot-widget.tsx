'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2,
  Bot,
  User,
  Loader2
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatbotWidgetProps {
  className?: string
}

export default function ChatbotWidget({ className = '' }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show greeting popup after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowGreeting(true)
        // Hide greeting after 4 seconds
        setTimeout(() => {
          setShowGreeting(false)
        }, 4000)
      }
    }, 2000) // Show greeting 2 seconds after page load

    return () => clearTimeout(timer)
  }, [isOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    // Add user message
    addMessage(userMessage, 'user')
    
    // Show typing indicator
    setIsTyping(true)

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId
        })
      })

      const data = await response.json()
      
      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false)
        if (data.success && data.data.response) {
          addMessage(data.data.response, 'bot')
        } else {
          addMessage('Sorry, I couldn\'t process your request. Please try again later.', 'bot')
        }
      }, 1000) // 1 second typing delay

    } catch (error) {
      console.error('Chatbot error:', error)
      setTimeout(() => {
        setIsTyping(false)
        addMessage('I\'m having trouble connecting right now. Please check our navigation menu for quick access to features like Resume Analyzer, Career Roadmaps, and Mock Interviews.', 'bot')
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const openChat = () => {
    setIsOpen(true)
    setShowGreeting(false)
    
    // Add welcome message if no messages yet
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage("👋 Hi! I'm your career guide assistant. I can help you navigate features like Resume Analyzer, Career Roadmaps, ROI Calculator, Mock Interviews, and more. What would you like to know?", 'bot')
      }, 500)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Greeting Popup */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-20 right-0 mb-2"
          >
            <div 
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 max-w-xs cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={openChat}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Career Guide</p>
                  <p className="text-sm text-gray-600">👋 Hi! How can I help you today?</p>
                </div>
              </div>
              {/* Small arrow pointing to the chatbot button */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b border-r border-gray-200 transform rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-96 h-[500px]"
          >
            <Card className="w-full h-full bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Career Guide</h3>
                      <p className="text-xs text-blue-100">Always here to help</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeChat}
                      className="text-white hover:bg-white/20 p-1 h-8 w-8"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeChat}
                      className="text-white hover:bg-white/20 p-1 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[360px] bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex items-center mb-1">
                          <Bot className="w-3 h-3 text-blue-500 mr-1" />
                          <span className="text-xs text-gray-500 font-medium">Career Guide</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <Bot className="w-3 h-3 text-blue-500" />
                        <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                        <span className="text-xs text-gray-500">Career Guide is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about resume tips, roadmaps, jobs..."
                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-2 w-10 h-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={openChat}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${
            isOpen ? 'hidden' : 'flex'
          } items-center justify-center`}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  )
}