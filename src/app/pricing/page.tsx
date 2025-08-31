'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import {
  Check, X, Star, Zap, Crown, Gift, Users, MessageSquare,
  BookOpen, Target, TrendingUp, Award, Calendar, Phone,
  ChevronRight, Sparkles, Shield, Clock
} from 'lucide-react'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: '/month',
    description: 'Perfect for students exploring career options',
    popular: false,
    features: [
      { name: 'Basic career assessment', included: true },
      { name: '3 AI mentor conversations/month', included: true },
      { name: 'Access to free resources', included: true },
      { name: 'Basic resume templates', included: true },
      { name: 'Community access', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false },
      { name: 'Unlimited AI conversations', included: false },
      { name: 'Personalized roadmaps', included: false },
      { name: '1:1 mentor sessions', included: false }
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹999',
    period: '/month',
    originalPrice: '₹1,499',
    description: 'Ideal for serious career growth and development',
    popular: true,
    features: [
      { name: 'Comprehensive career assessment', included: true },
      { name: 'Unlimited AI mentor conversations', included: true },
      { name: 'Premium resources & templates', included: true },
      { name: 'Personalized career roadmaps', included: true },
      { name: 'Advanced skill gap analysis', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Interview preparation tools', included: true },
      { name: 'Salary negotiation guidance', included: true },
      { name: '1:1 mentor session/month', included: true },
      { name: 'Career progress tracking', included: true }
    ],
    buttonText: 'Start Premium Trial',
    buttonVariant: 'default' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹2,499',
    period: '/month',
    originalPrice: '₹3,999',
    description: 'For professionals and career changers',
    popular: false,
    features: [
      { name: 'Everything in Premium', included: true },
      { name: 'Weekly 1:1 mentor sessions', included: true },
      { name: 'Direct industry connections', included: true },
      { name: 'Personal branding guidance', included: true },
      { name: 'Job placement assistance', included: true },
      { name: 'Resume optimization by experts', included: true },
      { name: 'Mock interview sessions', included: true },
      { name: 'LinkedIn profile optimization', included: true },
      { name: 'Priority job matching', included: true },
      { name: '24/7 phone & chat support', included: true }
    ],
    buttonText: 'Go Pro',
    buttonVariant: 'default' as const
  }
]

const additionalServices = [
  {
    name: 'Career Coaching Session',
    price: '₹2,999',
    duration: '90 minutes',
    description: 'One-on-one career guidance with industry experts',
    icon: Users
  },
  {
    name: 'Resume Makeover',
    price: '₹1,499',
    duration: '3-5 days',
    description: 'Professional resume redesign and ATS optimization',
    icon: BookOpen
  },
  {
    name: 'Mock Interview Pack',
    price: '₹999',
    duration: '3 sessions',
    description: 'Practice interviews with feedback from professionals',
    icon: MessageSquare
  },
  {
    name: 'LinkedIn Optimization',
    price: '₹799',
    duration: '1-2 days',
    description: 'Complete LinkedIn profile optimization for visibility',
    icon: Target
  }
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Microsoft',
    image: '/placeholder-avatar.jpg',
    quote: 'CareerCraft helped me transition from mechanical to software engineering. The roadmap was spot-on!',
    rating: 5
  },
  {
    name: 'Rahul Gupta',
    role: 'Product Manager at Flipkart',
    image: '/placeholder-avatar.jpg',
    quote: 'The Premium plan gave me insights I never knew I needed. Landed my dream job within 3 months.',
    rating: 5
  },
  {
    name: 'Sneha Patel',
    role: 'Data Scientist at Paytm',
    image: '/placeholder-avatar.jpg',
    quote: 'Amazing mentorship and resources. The Pro plan was worth every penny for career acceleration.',
    rating: 5
  }
]

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
  },
  {
    question: 'Is there a free trial for premium plans?',
    answer: 'Yes, we offer a 7-day free trial for both Premium and Pro plans. No credit card required to start.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, Net Banking, and digital wallets like Paytm, PhonePe, and Google Pay.'
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! Students with valid ID can get 40% off on all premium plans. Contact our support team for verification.'
  },
  {
    question: 'What if I need more mentor sessions?',
    answer: 'You can purchase additional mentor sessions at ₹1,999 each, or upgrade to the Pro plan for unlimited sessions.'
  }
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const getYearlyPrice = (monthlyPrice: string) => {
    const price = parseInt(monthlyPrice.replace('₹', '').replace(',', ''))
    const yearlyPrice = price * 10 // 2 months free on yearly
    return `₹${yearlyPrice.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Limited Time: 2 Months Free on Annual Plans</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Choose Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"> Success Plan</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Accelerate your career journey with personalized guidance, expert mentorship, 
              and AI-powered insights tailored for Indian professionals.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-12 h-6 bg-white/20 rounded-full transition-colors"
              >
                <div 
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : ''
                  }`}
                />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                  Yearly
                </span>
                <Badge className="bg-green-500 text-white text-xs">Save 20%</Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`p-8 h-full ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : ''} bg-white/80 backdrop-blur-sm`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {billingPeriod === 'yearly' && plan.price !== '₹0' ? getYearlyPrice(plan.price) : plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {billingPeriod === 'yearly' && plan.price !== '₹0' ? '/year' : plan.period}
                    </span>
                  </div>
                  
                  {plan.originalPrice && (
                    <p className="text-sm text-gray-500 mb-4">
                      <span className="line-through">
                        {billingPeriod === 'yearly' ? getYearlyPrice(plan.originalPrice) : plan.originalPrice}
                      </span>
                      <span className="ml-2 text-green-600 font-semibold">
                        Save {Math.round(((parseInt(plan.originalPrice.replace('₹', '').replace(',', '')) - parseInt(plan.price.replace('₹', '').replace(',', ''))) / parseInt(plan.originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
                      </span>
                    </p>
                  )}
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                    variant={plan.buttonVariant}
                    size="lg"
                  >
                    {plan.buttonText}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-on Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Boost your career growth with our expert-led additional services. 
              Perfect for specific needs and one-time requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{service.price}</div>
                  <p className="text-sm text-gray-500 mb-4">{service.duration}</p>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how CareerCraft has transformed careers of thousands of professionals across India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Got questions? We've got answers. If you have other questions, feel free to contact our support team.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="p-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Join thousands of professionals who have transformed their careers with CareerCraft AI. 
                Start your journey today with a free trial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-blue-100 mt-4">
                No credit card required • 7-day free trial • Cancel anytime
              </p>
            </div>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}