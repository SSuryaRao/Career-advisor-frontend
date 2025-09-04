'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import { Input } from '@/components/ui/input'
import {
  BookOpen, FileText, Video, Headphones, Download, Calendar,
  Clock, User, Star, Search, Filter, ChevronRight, Play,
  ExternalLink, Tag, TrendingUp, Users, Award, Bookmark,
  X, Code, Database, Brain, Briefcase, GraduationCap, 
  Globe, Mic, PenTool, Target, Zap, MessageSquare, 
  Monitor, Smartphone, Cloud, Shield, BarChart3, Layers
} from 'lucide-react'

const resourceCategories = [
  { name: 'Career Guides', icon: BookOpen, color: 'bg-blue-500' },
  { name: 'Resume Templates', icon: FileText, color: 'bg-green-500' },
  { name: 'Video Tutorials', icon: Video, color: 'bg-red-500' },
  { name: 'Podcasts', icon: Headphones, color: 'bg-purple-500' },
  { name: 'Webinars', icon: Calendar, color: 'bg-orange-500' },
  { name: 'Templates', icon: Download, color: 'bg-pink-500' },
]

// Significantly expanded featured resources
const featuredResources = [
  // Programming & Development - Videos
  {
    id: 1,
    title: 'CodeWithHarry - Web Development Playlist',
    description: 'Complete web development course in Hindi covering HTML, CSS, JavaScript, React, and more',
    type: 'Video',
    category: 'Programming',
    duration: '15+ hours',
    rating: 4.9,
    downloads: 250000,
    author: 'Harry (CodeWithHarry)',
    tags: ['Web Dev', 'JavaScript', 'React', 'Hindi'],
    externalUrl: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL',
    isPremium: false,
    icon: Video
  },
  {
    id: 2,
    title: 'Apna College - Java + DSA Course',
    description: 'Complete Java programming and DSA course designed for placement preparation',
    type: 'Video',
    category: 'Programming',
    duration: '40+ hours',
    rating: 4.7,
    downloads: 320000,
    author: 'Shradha Khapra',
    tags: ['Java', 'DSA', 'Placement'],
    externalUrl: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop',
    isPremium: false,
    icon: Video
  },
  {
    id: 3,
    title: 'Programming with Mosh - Python Course',
    description: 'Complete Python programming course from basics to advanced concepts',
    type: 'Video',
    category: 'Programming',
    duration: '20+ hours',
    rating: 4.8,
    downloads: 185000,
    author: 'Mosh Hamedani',
    tags: ['Python', 'Beginner', 'Programming'],
    externalUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    isPremium: false,
    icon: Video
  },
  // Programming & Development - Courses
  {
    id: 4,
    title: 'GeeksforGeeks - DSA Self Paced Course',
    description: 'Master Data Structures & Algorithms with comprehensive tutorials and practice problems',
    type: 'Course',
    category: 'Programming',
    duration: 'Self-paced',
    rating: 4.8,
    downloads: 180000,
    author: 'GeeksforGeeks',
    tags: ['DSA', 'Algorithms', 'Interview Prep'],
    externalUrl: 'https://www.geeksforgeeks.org/data-structures/',
    isPremium: false,
    icon: Code
  },
  {
    id: 5,
    title: 'FreeCodeCamp - Full Stack Development',
    description: 'Learn full stack development with hands-on projects and earn free certificates',
    type: 'Course',
    category: 'Programming',
    duration: '300+ hours',
    rating: 4.9,
    downloads: 450000,
    author: 'FreeCodeCamp',
    tags: ['Full Stack', 'Projects', 'Certificate'],
    externalUrl: 'https://www.freecodecamp.org/',
    isPremium: false,
    icon: GraduationCap
  },
  {
    id: 6,
    title: 'The Odin Project - Web Development',
    description: 'Free full-stack curriculum with hands-on projects and community support',
    type: 'Course',
    category: 'Programming',
    duration: '1000+ hours',
    rating: 4.7,
    downloads: 275000,
    author: 'The Odin Project',
    tags: ['Full Stack', 'JavaScript', 'Open Source'],
    externalUrl: 'https://www.theodinproject.com/',
    isPremium: false,
    icon: Code
  },
  // Data Science & ML
  {
    id: 7,
    title: 'Krish Naik - Machine Learning Playlist',
    description: 'Comprehensive ML tutorials covering theory and practical implementations',
    type: 'Video',
    category: 'Data Science',
    duration: '50+ hours',
    rating: 4.6,
    downloads: 150000,
    author: 'Krish Naik',
    tags: ['ML', 'Python', 'Data Science'],
    externalUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe',
    isPremium: false,
    icon: Brain
  },
  {
    id: 8,
    title: 'Kaggle Learn - Data Science Micro-Courses',
    description: 'Free micro-courses on data science, ML, and programming',
    type: 'Course',
    category: 'Data Science',
    duration: '4-6 hours each',
    rating: 4.7,
    downloads: 200000,
    author: 'Kaggle',
    tags: ['Data Science', 'Python', 'ML', 'Free'],
    externalUrl: 'https://www.kaggle.com/learn',
    isPremium: false,
    icon: Brain
  },
  {
    id: 9,
    title: 'Google Analytics Academy',
    description: 'Learn Google Analytics and digital marketing analytics',
    type: 'Course',
    category: 'Data Science',
    duration: '10+ hours',
    rating: 4.5,
    downloads: 75000,
    author: 'Google',
    tags: ['Analytics', 'Marketing', 'Google'],
    externalUrl: 'https://analytics.google.com/analytics/academy/',
    isPremium: false,
    icon: BarChart3
  },
  {
    id: 10,
    title: 'CS50 Introduction to AI with Python',
    description: 'Harvard\'s introduction to artificial intelligence with Python',
    type: 'Course',
    category: 'Data Science',
    duration: '7 weeks',
    rating: 4.8,
    downloads: 95000,
    author: 'Harvard University',
    tags: ['AI', 'Python', 'Harvard', 'Machine Learning'],
    externalUrl: 'https://cs50.harvard.edu/ai/',
    isPremium: false,
    icon: Brain
  },
  // Career Development
  {
    id: 11,
    title: 'LinkedIn Learning - Career Development Path',
    description: 'Comprehensive career development courses from industry experts',
    type: 'Course',
    category: 'Career Development',
    duration: '25 hours',
    rating: 4.5,
    downloads: 85000,
    author: 'LinkedIn Learning',
    tags: ['Career Growth', 'Leadership', 'Professional Skills'],
    externalUrl: 'https://www.linkedin.com/learning/',
    isPremium: true,
    icon: TrendingUp
  },
  {
    id: 12,
    title: 'Harvard Business Review - Career Collection',
    description: 'Essential career advice articles from HBR experts',
    type: 'Guide',
    category: 'Career Development',
    duration: 'Read at your pace',
    rating: 4.7,
    downloads: 55000,
    author: 'Harvard Business Review',
    tags: ['Career Strategy', 'Leadership', 'Business'],
    externalUrl: 'https://hbr.org/topic/managing-yourself',
    isPremium: true,
    icon: BookOpen
  },
  {
    id: 13,
    title: 'Coursera Career Guide - Tech Transitions',
    description: 'Complete guide for transitioning into tech careers',
    type: 'Guide',
    category: 'Career Development',
    duration: '3-5 hours',
    rating: 4.4,
    downloads: 68000,
    author: 'Coursera',
    tags: ['Career Change', 'Tech Industry', 'Guide'],
    externalUrl: 'https://www.coursera.org/articles/how-to-start-a-career-in-tech',
    isPremium: false,
    icon: Target
  },
  {
    id: 14,
    title: 'Google Career Certificates Program',
    description: 'Job-ready training programs in high-growth fields',
    type: 'Course',
    category: 'Career Development',
    duration: '3-6 months',
    rating: 4.6,
    downloads: 125000,
    author: 'Google',
    tags: ['Certificate', 'Job Ready', 'Google'],
    externalUrl: 'https://grow.google/certificates/',
    isPremium: true,
    icon: Award
  },
  {
    id: 15,
    title: 'Product Hunt - Maker Stories',
    description: 'Real stories from successful product makers and entrepreneurs',
    type: 'Guide',
    category: 'Career Development',
    duration: 'Various lengths',
    rating: 4.2,
    downloads: 32000,
    author: 'Product Hunt',
    tags: ['Entrepreneurship', 'Product', 'Startups'],
    externalUrl: 'https://www.producthunt.com/',
    isPremium: false,
    icon: Target
  },
  {
    id: 16,
    title: 'Y Combinator Startup School',
    description: 'Free online course for entrepreneurs and startup founders',
    type: 'Course',
    category: 'Career Development',
    duration: '10 weeks',
    rating: 4.7,
    downloads: 89000,
    author: 'Y Combinator',
    tags: ['Startup', 'Entrepreneurship', 'Business'],
    externalUrl: 'https://www.startupschool.org/',
    isPremium: false,
    icon: Briefcase
  },
  // Resume Building & Templates
  {
    id: 17,
    title: 'Overleaf - Resume Templates',
    description: 'Professional LaTeX resume templates for tech professionals',
    type: 'Template',
    category: 'Resume Building',
    duration: 'Download',
    rating: 4.8,
    downloads: 95000,
    author: 'Overleaf',
    tags: ['Resume', 'LaTeX', 'Templates'],
    externalUrl: 'https://www.overleaf.com/gallery/tagged/cv',
    isPremium: false,
    icon: FileText
  },
  {
    id: 18,
    title: 'Canva Resume Templates - Tech Focus',
    description: 'Modern, ATS-friendly resume templates designed for tech professionals',
    type: 'Template',
    category: 'Resume Building',
    duration: 'Download',
    rating: 4.6,
    downloads: 125000,
    author: 'Canva',
    tags: ['Resume', 'ATS', 'Design'],
    externalUrl: 'https://www.canva.com/resumes/templates/',
    isPremium: false,
    icon: PenTool
  },
  {
    id: 19,
    title: 'Resume.io - Professional Templates',
    description: 'ATS-optimized resume templates with industry-specific examples',
    type: 'Template',
    category: 'Resume Building',
    duration: 'Create online',
    rating: 4.5,
    downloads: 78000,
    author: 'Resume.io',
    tags: ['Resume', 'ATS', 'Professional'],
    externalUrl: 'https://resume.io/',
    isPremium: true,
    icon: FileText
  },
  // Interview Preparation
  {
    id: 20,
    title: 'Pramp - Mock Interview Practice',
    description: 'Free peer-to-peer mock technical interviews with developers worldwide',
    type: 'Practice',
    category: 'Interview Prep',
    duration: 'Live Sessions',
    rating: 4.7,
    downloads: 120000,
    author: 'Pramp',
    tags: ['Interview', 'Mock', 'Practice'],
    externalUrl: 'https://www.pramp.com/',
    isPremium: false,
    icon: Users
  },
  {
    id: 21,
    title: 'Love Babbar - DSA Sheet',
    description: '450 must-do coding questions for placement preparation',
    type: 'Practice',
    category: 'Interview Prep',
    duration: 'Self-paced',
    rating: 4.9,
    downloads: 280000,
    author: 'Love Babbar',
    tags: ['DSA', 'Placement', 'Practice'],
    externalUrl: 'https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/',
    isPremium: false,
    icon: Database
  },
  {
    id: 22,
    title: 'Striver\'s SDE Sheet',
    description: 'Curated list of 191 problems for software developer interviews',
    type: 'Practice',
    category: 'Interview Prep',
    duration: 'Self-paced',
    rating: 4.8,
    downloads: 195000,
    author: 'Raj Vikramaditya',
    tags: ['SDE', 'Interview', 'DSA'],
    externalUrl: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
    isPremium: false,
    icon: Code
  },
  {
    id: 23,
    title: 'InterviewBit - Programming Track',
    description: 'Structured programming interview preparation with company-specific questions',
    type: 'Course',
    category: 'Interview Prep',
    duration: '2-3 months',
    rating: 4.6,
    downloads: 165000,
    author: 'InterviewBit',
    tags: ['Interview', 'Programming', 'Companies'],
    externalUrl: 'https://www.interviewbit.com/courses/programming/',
    isPremium: false,
    icon: Briefcase
  },
  {
    id: 24,
    title: 'Cracking the Coding Interview - Solutions',
    description: 'Complete solutions and explanations for CTCI problems',
    type: 'Practice',
    category: 'Interview Prep',
    duration: 'Self-paced',
    rating: 4.7,
    downloads: 145000,
    author: 'Gayle McDowell',
    tags: ['CTCI', 'Interview', 'Algorithms'],
    externalUrl: 'https://github.com/careercup/CtCI-6th-Edition',
    isPremium: false,
    icon: BookOpen
  },
  {
    id: 25,
    title: 'System Design Primer',
    description: 'Learn how to design large-scale systems with interactive examples',
    type: 'Guide',
    category: 'Interview Prep',
    duration: 'Self-paced',
    rating: 4.8,
    downloads: 225000,
    author: 'Donne Martin',
    tags: ['System Design', 'Architecture', 'Interview'],
    externalUrl: 'https://github.com/donnemartin/system-design-primer',
    isPremium: false,
    icon: Layers
  },
  // Podcasts
  {
    id: 26,
    title: 'The Tech Career Podcast',
    description: 'Weekly insights on tech careers, interviews with industry leaders',
    type: 'Podcast',
    category: 'Career Development',
    duration: '30-45 min episodes',
    rating: 4.4,
    downloads: 45000,
    author: 'Tech Career Hub',
    tags: ['Career', 'Tech Industry', 'Leadership'],
    externalUrl: 'https://open.spotify.com/',
    isPremium: false,
    icon: Headphones
  },
  {
    id: 27,
    title: 'CodeNewbie Podcast',
    description: 'Stories from people learning to code and changing careers',
    type: 'Podcast',
    category: 'Career Development',
    duration: '20-40 min episodes',
    rating: 4.6,
    downloads: 65000,
    author: 'CodeNewbie',
    tags: ['Career Change', 'Learning', 'Stories'],
    externalUrl: 'https://www.codenewbie.org/podcast',
    isPremium: false,
    icon: Headphones
  },
  // Webinars
  {
    id: 28,
    title: 'Microsoft Learn Live Sessions',
    description: 'Live webinars on Azure, .NET, and Microsoft technologies',
    type: 'Webinar',
    category: 'Programming',
    duration: '1-2 hours',
    rating: 4.3,
    downloads: 35000,
    author: 'Microsoft',
    tags: ['Azure', '.NET', 'Microsoft', 'Live'],
    externalUrl: 'https://docs.microsoft.com/en-us/learn/',
    isPremium: false,
    icon: Calendar
  },
  {
    id: 29,
    title: 'AWS Career Development Webinars',
    description: 'Monthly webinars on cloud careers and AWS certifications',
    type: 'Webinar',
    category: 'Career Development',
    duration: '1 hour',
    rating: 4.4,
    downloads: 28000,
    author: 'AWS',
    tags: ['AWS', 'Cloud', 'Certification'],
    externalUrl: 'https://aws.amazon.com/training/',
    isPremium: false,
    icon: Calendar
  },
  // Additional specialized resources
  {
    id: 30,
    title: 'Frontend Masters - Complete Path',
    description: 'Comprehensive frontend development curriculum with expert instructors',
    type: 'Course',
    category: 'Programming',
    duration: '100+ hours',
    rating: 4.7,
    downloads: 89000,
    author: 'Frontend Masters',
    tags: ['Frontend', 'JavaScript', 'React', 'Vue'],
    externalUrl: 'https://frontendmasters.com/',
    isPremium: true,
    icon: Monitor
  }
]

const trendingTopics = [
  { name: 'AI/ML Career Path', searches: '+245%' },
  { name: 'Remote Work Tips', searches: '+180%' },
  { name: 'Startup Jobs', searches: '+125%' },
  { name: 'Interview Preparation', searches: '+98%' },
  { name: 'Skill Development', searches: '+87%' },
  { name: 'Cloud Computing', searches: '+76%' },
  { name: 'DevOps Career', searches: '+65%' },
  { name: 'Product Management', searches: '+58%' },
]

const learningPlatforms = [
  {
    id: 1,
    name: 'YouTube',
    description: 'Free programming tutorials and career advice videos',
    url: 'https://youtube.com',
    icon: Video,
    color: 'bg-red-500',
    category: 'Video Learning'
  },
  {
    id: 2,
    name: 'GeeksforGeeks',
    description: 'Comprehensive programming tutorials and interview preparation',
    url: 'https://geeksforgeeks.org',
    icon: BookOpen,
    color: 'bg-green-500',
    category: 'Programming'
  },
  {
    id: 3,
    name: 'LeetCode',
    description: 'Coding practice and interview preparation platform',
    url: 'https://leetcode.com',
    icon: Award,
    color: 'bg-orange-500',
    category: 'Coding Practice'
  },
  {
    id: 4,
    name: 'Coursera',
    description: 'Professional courses and certifications from top universities',
    url: 'https://coursera.org',
    icon: Users,
    color: 'bg-blue-500',
    category: 'Online Courses'
  },
  {
    id: 5,
    name: 'edX',
    description: 'University-level courses in various tech fields',
    url: 'https://edx.org',
    icon: BookOpen,
    color: 'bg-purple-500',
    category: 'Online Courses'
  },
  {
    id: 6,
    name: 'Udemy',
    description: 'Practical skill-based courses for career development',
    url: 'https://udemy.com',
    icon: Play,
    color: 'bg-pink-500',
    category: 'Online Courses'
  },
  {
    id: 7,
    name: 'Stack Overflow',
    description: 'Programming Q&A community and developer resources',
    url: 'https://stackoverflow.com',
    icon: Users,
    color: 'bg-orange-600',
    category: 'Community'
  },
  {
    id: 8,
    name: 'GitHub',
    description: 'Code repositories, open source projects, and portfolios',
    url: 'https://github.com',
    icon: FileText,
    color: 'bg-gray-800',
    category: 'Development'
  },
  {
    id: 9,
    name: 'HackerRank',
    description: 'Coding challenges and skill assessments',
    url: 'https://hackerrank.com',
    icon: Code,
    color: 'bg-green-600',
    category: 'Coding Practice'
  },
  {
    id: 10,
    name: 'CodeChef',
    description: 'Competitive programming platform with contests',
    url: 'https://codechef.com',
    icon: Award,
    color: 'bg-amber-600',
    category: 'Coding Practice'
  },
  {
    id: 11,
    name: 'Codeforces',
    description: 'Competitive programming contests and practice',
    url: 'https://codeforces.com',
    icon: Code,
    color: 'bg-blue-600',
    category: 'Coding Practice'
  },
  {
    id: 12,
    name: 'W3Schools',
    description: 'Web development tutorials and references',
    url: 'https://w3schools.com',
    icon: BookOpen,
    color: 'bg-green-500',
    category: 'Programming'
  },
  {
    id: 13,
    name: 'Pluralsight',
    description: 'Technology skills development platform',
    url: 'https://pluralsight.com',
    icon: Play,
    color: 'bg-pink-600',
    category: 'Online Courses'
  },
  {
    id: 14,
    name: 'Khan Academy',
    description: 'Free educational content including computer science',
    url: 'https://khanacademy.org',
    icon: GraduationCap,
    color: 'bg-green-600',
    category: 'Education'
  },
  {
    id: 15,
    name: 'Skillshare',
    description: 'Creative and business skill development',
    url: 'https://skillshare.com',
    icon: PenTool,
    color: 'bg-blue-600',
    category: 'Creative Skills'
  },
  {
    id: 16,
    name: 'freeCodeCamp',
    description: 'Free coding bootcamp with certifications',
    url: 'https://freecodecamp.org',
    icon: Code,
    color: 'bg-gray-900',
    category: 'Programming'
  },
  {
    id: 17,
    name: 'Codecademy',
    description: 'Interactive programming lessons and projects',
    url: 'https://codecademy.com',
    icon: Monitor,
    color: 'bg-purple-600',
    category: 'Programming'
  },
  {
    id: 18,
    name: 'Udacity',
    description: 'Tech nanodegree programs with industry mentors',
    url: 'https://udacity.com',
    icon: GraduationCap,
    color: 'bg-blue-700',
    category: 'Online Courses'
  },
  {
    id: 19,
    name: 'LinkedIn Learning',
    description: 'Professional development and technical skills',
    url: 'https://linkedin.com/learning',
    icon: Briefcase,
    color: 'bg-blue-800',
    category: 'Professional Development'
  },
  {
    id: 20,
    name: 'Kaggle',
    description: 'Data science competitions and learning platform',
    url: 'https://kaggle.com',
    icon: BarChart3,
    color: 'bg-cyan-600',
    category: 'Data Science'
  }
]

const upcomingWebinars = [
  {
    id: 1,
    title: 'Product Management in Indian Startups',
    date: 'Dec 15, 2025',
    time: '6:00 PM IST',
    speaker: 'Ankit Gupta',
    company: 'Razorpay',
    attendees: 1250,
    registrationUrl: 'https://www.linkedin.com/events/'
  },
  {
    id: 2,
    title: 'Frontend Development Trends 2026',
    date: 'Dec 18, 2025',
    time: '7:00 PM IST',
    speaker: 'Shreya Singh',
    company: 'Microsoft',
    attendees: 2100,
    registrationUrl: 'https://www.linkedin.com/events/'
  },
  {
    id: 3,
    title: 'Career Switch to Tech at 30+',
    date: 'Dec 20, 2025',
    time: '8:00 PM IST',
    speaker: 'Rohit Mehta',
    company: 'Google',
    attendees: 890,
    registrationUrl: 'https://www.linkedin.com/events/'
  },
  {
    id: 4,
    title: 'Data Science Career Roadmap 2026',
    date: 'Dec 22, 2025',
    time: '7:30 PM IST',
    speaker: 'Priya Sharma',
    company: 'Amazon',
    attendees: 1580,
    registrationUrl: 'https://www.linkedin.com/events/'
  },
  {
    id: 5,
    title: 'DevOps and Cloud Career Paths',
    date: 'Dec 25, 2025',
    time: '8:00 PM IST',
    speaker: 'Arjun Kumar',
    company: 'Netflix',
    attendees: 965,
    registrationUrl: 'https://www.linkedin.com/events/'
  },
]

// Filter options
const resourceTypes = ['all', 'Video', 'Course', 'Practice', 'Template', 'Guide', 'Podcast', 'Webinar']
const resourceCategoriesFilter = ['all', 'Programming', 'Data Science', 'Interview Prep', 'Career Development', 'Resume Building']

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlatformCategory, setSelectedPlatformCategory] = useState('all')
  const [selectedResourceType, setSelectedResourceType] = useState('all')
  const [selectedResourceCategory, setSelectedResourceCategory] = useState('all')
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showResourceFilters, setShowResourceFilters] = useState(false)

  // Dynamic resource counts calculation
  const resourceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    
    resourceCategories.forEach(category => {
      let count = 0
      
      switch (category.name) {
        case 'Career Guides':
          count = featuredResources.filter(r => 
            r.category === 'Career Development' || r.type === 'Guide'
          ).length
          break
        case 'Resume Templates':
          count = featuredResources.filter(r => 
            r.category === 'Resume Building' || r.type === 'Template'
          ).length
          break
        case 'Video Tutorials':
          count = featuredResources.filter(r => r.type === 'Video').length
          break
        case 'Podcasts':
          count = featuredResources.filter(r => r.type === 'Podcast').length
          break
        case 'Webinars':
          count = featuredResources.filter(r => r.type === 'Webinar').length
          break
        case 'Templates':
          count = featuredResources.filter(r => r.type === 'Template').length
          break
        default:
          count = 0
      }
      
      counts[category.name] = count
    })
    
    return counts
  }, [])

  const toggleBookmark = (itemId: number) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  // Filter platforms
  const filteredPlatforms = learningPlatforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          platform.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedPlatformCategory === 'all' || platform.category === selectedPlatformCategory
    return matchesSearch && matchesCategory
  })

  // Filter resources
  const filteredResources = featuredResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedResourceType === 'all' || resource.type === selectedResourceType
    const matchesCategory = selectedResourceCategory === 'all' || resource.category === selectedResourceCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const platformCategories = ['all', ...Array.from(new Set(learningPlatforms.map(p => p.category)))]

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedPlatformCategory('all')
    setSelectedResourceType('all')
    setSelectedResourceCategory('all')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Career Resources
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"> Hub</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Access comprehensive career resources, guides, templates, and expert insights 
              to accelerate your professional journey in the Indian market.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search resources, guides, templates..."
                    className="pl-12 border-0 text-gray-900 text-lg py-4 focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
                  onClick={() => {
                    setShowResourceFilters(true)
                  }}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Resource Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { label: 'Resources Available', value: `${featuredResources.length}` },
                { label: 'Learning Platforms', value: `${learningPlatforms.length}` },
                { label: 'Monthly Downloads', value: '3.2M+' },
                { label: 'Success Stories', value: '25,000+' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Browse Categories Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <Card className="p-6 text-center hover:shadow-xl hover:border-blue-500 transition-all duration-300 group-hover:scale-105 h-full bg-white border border-gray-200 hover:border-blue-300">
                  <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{category.name}</h3>
                  <p className="text-gray-600 text-xs">{resourceCounts[category.name] || 0} resources</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Learning Platforms Section - ENHANCED STYLING */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Learning Platforms</h2>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:bg-blue-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          {/* Enhanced Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex flex-wrap gap-3">
                {platformCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedPlatformCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPlatformCategory(category)}
                    className="capitalize hover:scale-105 transition-transform"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enhanced Platform Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlatforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <Card 
                  className="p-6 flex flex-col hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full cursor-pointer bg-white border border-gray-200 hover:-translate-y-1"
                  onClick={() => handleExternalLink(platform.url)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                      <platform.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-blue-100">
                      {platform.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-left text-lg">{platform.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow text-left leading-relaxed">{platform.description}</p>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors mt-auto">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Visit Platform</span>
                    <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {filteredPlatforms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No platforms found matching your filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Resources Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Resources</h2>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowResourceFilters(!showResourceFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Resource Filters */}
              {showResourceFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">Type</label>
                      <div className="flex flex-wrap gap-2">
                        {resourceTypes.map((type) => (
                          <Button
                            key={type}
                            variant={selectedResourceType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedResourceType(type)}
                            className="capitalize"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {resourceCategoriesFilter.map((category) => (
                          <Button
                            key={category}
                            variant={selectedResourceCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedResourceCategory(category)}
                            className="capitalize"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={resetFilters}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear all filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Resource List */}
              <div className="space-y-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 hover:border-blue-300">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 shadow-sm">
                          <resource.icon className="w-8 h-8 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">{resource.title}</h3>
                                {resource.isPremium && (
                                  <Badge className="bg-amber-100 text-amber-800 border border-amber-200">Premium</Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3 leading-relaxed">{resource.description}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleBookmark(resource.id)
                              }}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Bookmark 
                                className={`w-5 h-5 ${bookmarkedItems.includes(resource.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-600'}`} 
                              />
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-700 mb-4">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="font-medium">{resource.author}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{resource.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{resource.downloads.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-400" />
                              <span className="font-medium">{resource.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                              onClick={() => handleExternalLink(resource.externalUrl)}
                            >
                              {resource.type === 'Template' ? 'Download' : 'Access'}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No resources found matching your filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {filteredResources.length > 0 && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg" className="hover:bg-blue-50">
                    Load More Resources
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-900 text-sm">{topic.name}</span>
                    <span className="text-sm text-green-600 font-bold">{topic.searches}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Webinars */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Upcoming Webinars
              </h3>
              <div className="space-y-4">
                {upcomingWebinars.map((webinar) => (
                  <div key={webinar.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">{webinar.title}</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        {webinar.date} at {webinar.time}
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {webinar.speaker} • {webinar.company}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-2" />
                        {webinar.attendees} registered
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3 text-xs"
                      onClick={() => handleExternalLink(webinar.registrationUrl)}
                    >
                      Register Free
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Webinars
              </Button>
            </Card>

            {/* Newsletter Signup */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Weekly Career Insights</h3>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                Get the latest career resources, job market trends, and expert tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input type="email" placeholder="Enter your email" className="border-purple-200" />
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Subscribe Now
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Join 35,000+ professionals. Unsubscribe anytime.
              </p>
            </Card>
            
            {/* Quick Access */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Access</h3>
              <div className="space-y-2">
                {[
                  { name: 'Resume Builder', icon: FileText, url: 'https://www.canva.com/resumes/templates/' },
                  { name: 'Interview Prep', icon: Users, url: 'https://www.interviewbit.com/' },
                  { name: 'Salary Calculator', icon: TrendingUp, url: 'https://www.glassdoor.co.in/Salaries/index.htm' },
                  { name: 'Skill Assessment', icon: Award, url: 'https://www.hackerrank.com/skills-verification' },
                ].map((link, index) => (
                  <button 
                    key={index} 
                    className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                    onClick={() => handleExternalLink(link.url)}
                  >
                    <link.icon className="w-4 h-4 mr-3 text-blue-600" />
                    <span className="font-medium text-gray-900 text-sm">{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400 group-hover:text-gray-600" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}