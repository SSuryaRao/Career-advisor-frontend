'use client'

import { useEffect, useState } from 'react'
import { Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallPWAButtonProps {
  variant?: 'navbar' | 'dropdown' | 'mobile'
  className?: string
}

export function InstallPWAButton({ variant = 'navbar', className = '' }: InstallPWAButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // For iOS or if prompt is available, show button
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
      setShowButton(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no prompt (iOS), show instructions
      alert(
        'To install this app on iOS:\n\n' +
        '1. Tap the Share button (square with arrow)\n' +
        '2. Scroll down and tap "Add to Home Screen"\n' +
        '3. Tap "Add" in the top right corner'
      )
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
      setShowButton(false)
    }

    setDeferredPrompt(null)
  }

  // Don't show if already installed
  if (isInstalled || !showButton) {
    return null
  }

  // Navbar variant (button in navigation bar)
  if (variant === 'navbar') {
    return (
      <button
        onClick={handleInstall}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium transition-all transform hover:scale-105 shadow-lg ${className}`}
      >
        <Download className="w-4 h-4" />
        <span className="hidden lg:inline">Install App</span>
        <span className="lg:hidden">Install</span>
      </button>
    )
  }

  // Dropdown variant (menu item in profile dropdown)
  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleInstall}
        className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors text-left hover:bg-blue-50 dark:hover:bg-white/10 ${className}`}
      >
        <Smartphone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        <span className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
          Install App
        </span>
      </button>
    )
  }

  // Mobile variant (full width button in mobile menu)
  if (variant === 'mobile') {
    return (
      <button
        onClick={handleInstall}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    )
  }

  return null
}
