'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Sparkles, Mail, Phone, MapPin, Twitter, 
  Linkedin, Instagram, Youtube, Github,
  ArrowRight, Heart, Award
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'AI Mentor', href: '/mentor' },
    { name: 'Career Search', href: '/careers' },
    { name: 'Skills Analysis', href: '/skills' },
    { name: 'Interview Prep', href: '/interviews' },
    { name: 'Dashboard', href: '/dashboard' }
  ],
  solutions: [
    { name: 'For Students', href: '/solutions/students' },
    { name: 'For Parents', href: '/solutions/parents' },
    { name: 'For Institutions', href: '/solutions/institutions' },
    { name: 'For Recruiters', href: '/solutions/recruiters' },
    { name: 'Enterprise', href: '/enterprise' }
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Career Guides', href: '/resources/guides' },
    { name: 'Webinars', href: '/webinars' },
    { name: 'Help Center', href: '/help' },
    { name: 'API Docs', href: '/developers' },
    { name: 'Success Stories', href: '/success-stories' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/jobs' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Refund Policy', href: '/refunds' }
  ]
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/careercraftai', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/careercraftai', icon: Linkedin },
  { name: 'Instagram', href: 'https://instagram.com/careercraftai', icon: Instagram },
  { name: 'YouTube', href: 'https://youtube.com/@careercraftai', icon: Youtube },
  { name: 'GitHub', href: 'https://github.com/careercraftai', icon: Github }
]

const awards = [
  'TechCrunch Startup of the Year',
  'Google for Education Partner',
  'Microsoft Education Award',
  'UNESCO Digital Innovation'
]

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 border-t border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-75" />
                    <div className="relative bg-gray-900 rounded-lg p-2">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    CareerCraft AI
                  </span>
                </Link>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  Empowering Indian students with AI-driven career guidance, 
                  personalized learning paths, and industry connections.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>hello@careercraft.ai</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>+91 80 4000 3000</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Bangalore, Karnataka, India</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Product */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-white font-semibold mb-4">Product</h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Solutions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-white font-semibold mb-4">Solutions</h3>
                  <ul className="space-y-3">
                    {footerLinks.solutions.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Resources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Company */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-white font-semibold mb-4">Company</h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 mb-12"
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-6">
                Get the latest career insights, AI updates, and success stories delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>

          {/* Awards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Recognition & Awards</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {awards.map((award, index) => (
                <span key={index} className="flex items-center">
                  {award}
                  {index < awards.length - 1 && (
                    <div className="w-1 h-1 bg-gray-600 rounded-full ml-6" />
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-wrap items-center gap-6 mb-4 md:mb-0">
                <p className="text-gray-400 text-sm flex items-center">
                  © 2024 CareerCraft AI. Made with 
                  <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" />
                  in India
                </p>
                <div className="flex space-x-6">
                  {footerLinks.legal.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>🇮🇳 Proudly Indian</span>
                <span>|</span>
                <span>Available in 10+ languages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}