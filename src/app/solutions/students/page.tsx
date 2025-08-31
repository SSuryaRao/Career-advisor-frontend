'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  BookOpen, Star, Target, TrendingUp, Users, Award, 
  ArrowRight, Brain, Compass, Zap, GraduationCap, Lightbulb
} from 'lucide-react'

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400 mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              For Students
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your Career Starts
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"> Here</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover your potential, explore career paths, and build the skills you need 
              to succeed in today's competitive job market. Start your journey with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Free Assessment
                <GraduationCap className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                Explore Careers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Career Guidance',
                description: 'Get personalized career recommendations based on your interests and skills'
              },
              {
                icon: Target,
                title: 'Skill Assessment',
                description: 'Identify your strengths and areas for improvement with detailed analysis'
              },
              {
                icon: Compass,
                title: 'Career Exploration',
                description: 'Discover thousands of career paths and their requirements'
              },
              {
                icon: Award,
                title: 'Certification Prep',
                description: 'Prepare for industry certifications with curated learning paths'
              },
              {
                icon: Users,
                title: 'Peer Community',
                description: 'Connect with like-minded students and share experiences'
              },
              {
                icon: Lightbulb,
                title: 'Project Ideas',
                description: 'Get suggestions for projects that enhance your portfolio'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Shape Your Future?</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Join over 50,000 students who have already started their career journey with CareerCraft AI.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
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