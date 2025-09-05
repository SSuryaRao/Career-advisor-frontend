'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/navbar'
import { Roadmap } from '@/components/ui/roadmap'
import { MapPin, Target, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function RoadmapPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden mt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute inset-0 opacity-40" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
             }} />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Icon with animated glow */}
            <div className="flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Career Roadmap
              </span>
              <br />
              <span className="text-gray-800">Generator</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Create your personalized learning journey with AI-powered roadmaps tailored to your goals. 
              <span className="text-purple-600 font-semibold"> Track progress, access curated resources, and achieve your career dreams.</span>
            </motion.p>
            
            {/* Stats or badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>50+ Career Domains</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Personalized Learning Paths</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Progress Tracking</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our <span className="text-purple-600">Roadmaps?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the power of AI-driven career guidance with features designed for your success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="group"
          >
            <Card className="p-8 text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Personalized Paths
              </h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered roadmaps tailored to your current skill level, career goals, and learning preferences
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="group"
          >
            <Card className="p-8 text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100 group-hover:from-green-100 group-hover:to-emerald-200">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                Curated Resources
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Premium learning materials from NPTEL, Coursera, freeCodeCamp, and top educational platforms
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="group"
          >
            <Card className="p-8 text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-100 group-hover:from-purple-100 group-hover:to-pink-200">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                Smart Progress Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Visual milestone tracking with achievement badges and progress analytics to keep you motivated
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Roadmap Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="relative"
        >
          {/* Background decoration */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-indigo-200/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-1">
            <div className="bg-white rounded-3xl shadow-inner">
              <Roadmap onGenerateRoadmap={generateRoadmap} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}