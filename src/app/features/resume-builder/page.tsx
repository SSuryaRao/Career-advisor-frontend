'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileEdit,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Trophy,
  Layout,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { getUserProfile } from '@/lib/api/user'
import { generateProfessionalSummary, createResumeFromProfile } from '@/lib/api/resumeBuilder'
import { resumeTemplates } from '@/lib/resumeTemplates'
import toast from 'react-hot-toast'

interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  achievements: string[]
}

interface Project {
  name: string
  link: string
  technologies: string
  description: string[]
}

interface ResumeData {
  // Contact Info (auto-filled)
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string

  // Professional Summary
  professionalSummary: string

  // Education (from profile)
  education: string

  // Work Experience (manual)
  workExperience: WorkExperience[]

  // Projects (manual)
  projects: Project[]

  // Skills (from profile)
  skills: {
    frontend: string[]
    backend: string[]
    database: string[]
    languages: string[]
    softSkills: string[]
  }

  // Extra-curricular
  extraCurricular: string[]
}

export default function ResumeBuilderPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('aditya')
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (previewTemplate) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [previewTemplate])

  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    professionalSummary: '',
    education: '',
    workExperience: [],
    projects: [],
    skills: {
      frontend: [],
      backend: [],
      database: [],
      languages: [],
      softSkills: []
    },
    extraCurricular: []
  })

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        setLoading(true)
        const profile = await getUserProfile()

        // Auto-fill from profile
        setResumeData(prev => ({
          ...prev,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.profile?.phone || '',
          location: profile.profile?.location || '',
          linkedin: profile.profile?.linkedin || '',
          github: profile.profile?.github || '',
          website: profile.profile?.website || '',
          education: profile.profile?.education || '',
          skills: {
            frontend: profile.skills?.filter((s: any) => s.category === 'frontend').map((s: any) => s.name) || [],
            backend: profile.skills?.filter((s: any) => s.category === 'backend').map((s: any) => s.name) || [],
            database: profile.skills?.filter((s: any) => s.category === 'database').map((s: any) => s.name) || [],
            languages: profile.skills?.filter((s: any) => s.category === 'languages').map((s: any) => s.name) || [],
            softSkills: profile.skills?.filter((s: any) => s.category === 'soft skills').map((s: any) => s.name) || []
          }
        }))
      } catch (error: any) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [user, router])

  // Add work experience
  const addWorkExperience = () => {
    setResumeData(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          achievements: ['']
        }
      ]
    }))
  }

  // Remove work experience
  const removeWorkExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  // Update work experience
  const updateWorkExperience = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  // Add achievement to work experience
  const addAchievement = (expIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === expIndex ? { ...exp, achievements: [...exp.achievements, ''] } : exp
      )
    }))
  }

  // Update achievement
  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === expIndex ? {
          ...exp,
          achievements: exp.achievements.map((ach, j) => j === achIndex ? value : ach)
        } : exp
      )
    }))
  }

  // Remove achievement
  const removeAchievement = (expIndex: number, achIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === expIndex ? {
          ...exp,
          achievements: exp.achievements.filter((_, j) => j !== achIndex)
        } : exp
      )
    }))
  }

  // Add project
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: '',
          link: '',
          technologies: '',
          description: ['']
        }
      ]
    }))
  }

  // Remove project
  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  // Update project
  const updateProject = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    }))
  }

  // Add project description
  const addProjectDescription = (projIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projIndex ? { ...proj, description: [...proj.description, ''] } : proj
      )
    }))
  }

  // Update project description
  const updateProjectDescription = (projIndex: number, descIndex: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projIndex ? {
          ...proj,
          description: proj.description.map((desc, j) => j === descIndex ? value : desc)
        } : proj
      )
    }))
  }

  // Remove project description
  const removeProjectDescription = (projIndex: number, descIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projIndex ? {
          ...proj,
          description: proj.description.filter((_, j) => j !== descIndex)
        } : proj
      )
    }))
  }

  // Add extra-curricular
  const addExtraCurricular = () => {
    setResumeData(prev => ({
      ...prev,
      extraCurricular: [...prev.extraCurricular, '']
    }))
  }

  // Update extra-curricular
  const updateExtraCurricular = (index: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      extraCurricular: prev.extraCurricular.map((item, i) => i === index ? value : item)
    }))
  }

  // Remove extra-curricular
  const removeExtraCurricular = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      extraCurricular: prev.extraCurricular.filter((_, i) => i !== index)
    }))
  }

  // Generate professional summary with AI
  const handleGenerateSummary = async () => {
    try {
      setGeneratingSummary(true)
      const summary = await generateProfessionalSummary(resumeData)
      setResumeData(prev => ({ ...prev, professionalSummary: summary }))
      toast.success('Professional summary generated!')
    } catch (error: any) {
      console.error('Error generating summary:', error)
      toast.error(error.message || 'Failed to generate summary')
    } finally {
      setGeneratingSummary(false)
    }
  }

  // Generate resume PDF
  const handleGenerateResume = async () => {
    try {
      // Validation
      if (!resumeData.name || !resumeData.email) {
        toast.error('Please fill in your name and email')
        return
      }

      if (resumeData.workExperience.length === 0) {
        toast.error('Please add at least one work experience')
        return
      }

      setGenerating(true)
      const result = await createResumeFromProfile(resumeData, selectedTemplate)

      // Download PDF
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank')
        toast.success('Resume generated successfully!')
      }
    } catch (error: any) {
      console.error('Error generating resume:', error)
      toast.error(error.message || 'Failed to generate resume')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <FileEdit className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create a professional, ATS-optimized resume in minutes with AI-powered assistance
          </p>
        </div>

        {/* Resume Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-8">

          {/* Template Selection */}
          <section>
            <div className="flex items-center mb-6">
              <Layout className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Choose Template</h2>
              <span className="ml-3 text-sm text-gray-500">Click to select, double-click to preview</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resumeTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`relative rounded-xl border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                    selectedTemplate === template.id
                      ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                  onDoubleClick={() => setPreviewTemplate(template.id)}
                >
                  {/* PDF Preview */}
                  <div className="aspect-[8.5/11] bg-gray-100 relative overflow-hidden group">
                    <iframe
                      src={`${template.pdfPreview}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full pointer-events-none"
                      title={template.name}
                    />

                    {/* Preview Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview Full Size
                      </button>
                    </div>

                    {selectedTemplate === template.id && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-base text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {template.category}
                      </span>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${template.design.primaryColor}15`,
                          color: template.design.primaryColor
                        }}
                      >
                        {template.design.layout}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Best for: {template.bestFor[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={resumeData.name}
                  onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={resumeData.linkedin}
                  onChange={(e) => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={resumeData.github}
                  onChange={(e) => setResumeData(prev => ({ ...prev, github: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="github.com/username"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={resumeData.website}
                  onChange={(e) => setResumeData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
              </div>
              <Button
                onClick={handleGenerateSummary}
                disabled={generatingSummary}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {generatingSummary ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            <textarea
              value={resumeData.professionalSummary}
              onChange={(e) => setResumeData(prev => ({ ...prev, professionalSummary: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A brief professional summary highlighting your key skills, experience, and career goals..."
            />
          </section>

          {/* Education */}
          <section>
            <div className="flex items-center mb-6">
              <GraduationCap className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            </div>
            <textarea
              value={resumeData.education}
              onChange={(e) => setResumeData(prev => ({ ...prev, education: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="B.Tech Computer Science, XYZ University (2020-2024)"
            />
          </section>

          {/* Work Experience */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Work Experience *</h2>
              </div>
              <Button onClick={addWorkExperience} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </div>

            {resumeData.workExperience.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No work experience added yet</p>
                <Button onClick={addWorkExperience}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumeData.workExperience.map((exp, expIndex) => (
                  <div key={expIndex} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Experience #{expIndex + 1}</h3>
                      <button
                        onClick={() => removeWorkExperience(expIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(expIndex, 'company', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateWorkExperience(expIndex, 'position', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateWorkExperience(expIndex, 'startDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="January 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => updateWorkExperience(expIndex, 'endDate', e.target.value)}
                            disabled={exp.current}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            placeholder="Present"
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateWorkExperience(expIndex, 'current', e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Current</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">Key Achievements *</label>
                        <button
                          onClick={() => addAchievement(expIndex)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add Achievement
                        </button>
                      </div>
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => updateAchievement(expIndex, achIndex, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe your achievement or responsibility..."
                          />
                          {exp.achievements.length > 1 && (
                            <button
                              onClick={() => removeAchievement(expIndex, achIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Projects */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Code className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              </div>
              <Button onClick={addProject} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>

            {resumeData.projects.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Code className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No projects added yet</p>
                <Button onClick={addProject} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumeData.projects.map((proj, projIndex) => (
                  <div key={projIndex} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Project #{projIndex + 1}</h3>
                      <button
                        onClick={() => removeProject(projIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(projIndex, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Project Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                        <input
                          type="url"
                          value={proj.link}
                          onChange={(e) => updateProject(projIndex, 'link', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => updateProject(projIndex, 'technologies', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="JavaScript, React, Node.js, MongoDB"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">Description Points *</label>
                        <button
                          onClick={() => addProjectDescription(projIndex)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add Point
                        </button>
                      </div>
                      {proj.description.map((desc, descIndex) => (
                        <div key={descIndex} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={desc}
                            onChange={(e) => updateProjectDescription(projIndex, descIndex, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe project feature or achievement..."
                          />
                          {proj.description.length > 1 && (
                            <button
                              onClick={() => removeProjectDescription(projIndex, descIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Skills */}
          <section>
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                Skills are automatically loaded from your profile. You can edit them in your profile settings.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frontend</label>
                <input
                  type="text"
                  value={resumeData.skills.frontend.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    skills: { ...prev.skills, frontend: e.target.value.split(',').map(s => s.trim()) }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="HTML, CSS, JavaScript, React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Backend</label>
                <input
                  type="text"
                  value={resumeData.skills.backend.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    skills: { ...prev.skills, backend: e.target.value.split(',').map(s => s.trim()) }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Node.js, Express, Python"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Database</label>
                <input
                  type="text"
                  value={resumeData.skills.database.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    skills: { ...prev.skills, database: e.target.value.split(',').map(s => s.trim()) }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="MongoDB, MySQL, PostgreSQL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                <input
                  type="text"
                  value={resumeData.skills.languages.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    skills: { ...prev.skills, languages: e.target.value.split(',').map(s => s.trim()) }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="JavaScript, Python, Java"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                <input
                  type="text"
                  value={resumeData.skills.softSkills.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    skills: { ...prev.skills, softSkills: e.target.value.split(',').map(s => s.trim()) }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Communication, Leadership, Problem Solving"
                />
              </div>
            </div>
          </section>

          {/* Extra-Curricular */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Extra-Curricular & Achievements</h2>
              </div>
              <Button onClick={addExtraCurricular} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Achievement
              </Button>
            </div>

            {resumeData.extraCurricular.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No achievements added yet</p>
                <Button onClick={addExtraCurricular} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Achievement
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {resumeData.extraCurricular.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateExtraCurricular(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Led a team of 50+ members in organizing tech fest..."
                    />
                    <button
                      onClick={() => removeExtraCurricular(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Generate Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={handleGenerateResume}
              disabled={generating}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 text-lg shadow-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Resume...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate Resume PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal - Positioned fixed to viewport */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
          style={{ margin: 0 }}
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {resumeTemplates.find(t => t.id === previewTemplate)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {resumeTemplates.find(t => t.id === previewTemplate)?.description}
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-auto max-h-[calc(90vh-180px)]">
              <iframe
                src={`${resumeTemplates.find(t => t.id === previewTemplate)?.pdfPreview}#toolbar=0&navpanes=0`}
                className="w-full h-[700px]"
                title="Template Preview"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={() => {
                  setSelectedTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Use This Template
              </Button>
              <Button
                onClick={() => setPreviewTemplate(null)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
