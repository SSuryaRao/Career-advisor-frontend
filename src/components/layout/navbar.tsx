// src/components/layout/navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  User,
  LogIn,
  Brain,
  Target,
  Users,
  TrendingUp,
  BookOpen,
  Briefcase,
  LogOut,
  Settings,
  FileSearch,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../auth-provider'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import toast from 'react-hot-toast'

const navigation = [
  {
    name: 'Features',
    href: '#features',
    dropdown: [
      { name: 'AI Mentor', href: '/features/ai-mentor', icon: Brain },
      {
        name: 'Career Engine',
        href: '/features/career-engine',
        icon: Target,
      },
      { name: 'Resume Analyzer', href: '/features/resume-analyzer', icon: FileSearch },
      { name: 'Skill Analysis', href: '/features/skills', icon: TrendingUp },
    ],
  },
  {
    name: 'Solutions',
    href: '/solutions',
    dropdown: [
      { name: 'For Students', href: '/solutions/students', icon: GraduationCap },
      { name: 'Roadmap', href: '/solutions/roadmap', icon: MapPin },
    ],
  },
  { name: 'Careers', href: '/careers' },
  { name: 'Resources', href: '/resources' },
  { name: 'Pricing', href: '/pricing' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-black rounded-lg p-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              CareerCraft AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  <span>{item.name}</span>
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <subItem.icon className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-300 hover:text-white">
                            {subItem.name}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white text-sm lg:text-base flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300 hover:text-white">My Profile</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300 hover:text-white">Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300 hover:text-white">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white text-sm lg:text-base"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm lg:text-base px-4 lg:px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container mx-auto container-padding py-4">
              {navigation.map((item) => (
                <div key={item.name} className="py-2">
                  <Link
                    href={item.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-white/10">
                {user ? (
                  <>
                    <Link href="/profile" passHref>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard" passHref>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" passHref>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" passHref>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}