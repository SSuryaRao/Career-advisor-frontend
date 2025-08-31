'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  Brain, MessageSquare, Lightbulb, Clock, Star, CheckCircle, 
  ArrowRight, Zap, Users, BookOpen, Target, TrendingUp, Award
} from 'lucide-react'

export default function AIMentorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400 mb-6">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Mentorship
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your Personal
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"> AI Mentor</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get 24/7 access to personalized career guidance, skill development advice, 
              and professional insights powered by advanced AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Chat with AI Mentor
                <MessageSquare className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">AI Mentor Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: 'Career Strategy',
                description: 'Get personalized advice on career planning and growth strategies'
              },
              {
                icon: BookOpen,
                title: 'Skill Development',
                description: 'Receive guidance on which skills to learn and how to develop them'
              },
              {
                icon: Target,
                title: 'Goal Setting',
                description: 'Set and track meaningful career goals with AI-powered insights'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Start Your AI Mentorship Journey</h2>
            <p className="text-purple-100 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of professionals who are accelerating their careers with AI-powered mentorship.
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}