'use client'

import React, { useState } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Download, Zap, Target, Star, TrendingUp, AlertCircle, CheckCircle, Award, Sparkles, BarChart3 } from 'lucide-react'
import { uploadAndAnalyzeResume, type BackendResumeAnalysis } from '@/lib/api/resume'
import { validatePDFFile } from '@/lib/pdf-utils'
import jsPDF from 'jspdf'
import ImproveResumeButton from '@/components/resume/ImproveResumeButton'
import Navbar from '@/components/layout/navbar'

interface ProcessingStep {
  id: number
  label: string
  description: string
  status: 'pending' | 'processing' | 'completed'
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<BackendResumeAnalysis | null>(null)
  const [error, setError] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 1, label: 'Uploading', description: 'Uploading your resume to secure servers', status: 'pending' },
    { id: 2, label: 'Extracting', description: 'Extracting text and analyzing structure', status: 'pending' },
    { id: 3, label: 'ATS Analysis', description: 'Running ATS compatibility checks', status: 'pending' },
    { id: 4, label: 'Generating Insights', description: 'Creating personalized suggestions', status: 'pending' },
    { id: 5, label: 'Finalizing', description: 'Preparing your detailed report', status: 'pending' },
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const validation = validatePDFFile(file)
      if (validation.isValid) {
        setFile(file)
        setError('')
      } else {
        setError(validation.error || 'Invalid file')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const updateProcessingStep = (stepId: number, status: 'pending' | 'processing' | 'completed') => {
    setProcessingSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, status } : step
    ))
  }

  const resetProcessingSteps = () => {
    setProcessingSteps([
      { id: 1, label: 'Uploading', description: 'Uploading your resume to secure servers', status: 'pending' },
      { id: 2, label: 'Extracting', description: 'Extracting text and analyzing structure', status: 'pending' },
      { id: 3, label: 'ATS Analysis', description: 'Running ATS compatibility checks', status: 'pending' },
      { id: 4, label: 'Generating Insights', description: 'Creating personalized suggestions', status: 'pending' },
      { id: 5, label: 'Finalizing', description: 'Preparing your detailed report', status: 'pending' },
    ])
  }

  const analyzeResume = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError('')
    setUploadProgress(0)
    resetProcessingSteps()

    try {
      // Step 1: Uploading (0-30%)
      updateProcessingStep(1, 'processing')

      const uploadMethod = 'file-picker'
      const result = await uploadAndAnalyzeResume(
        file,
        uploadMethod,
        (progress) => {
          setUploadProgress(progress * 0.3) // Upload is 30% of total

          if (progress >= 100) {
            updateProcessingStep(1, 'completed')

            // Step 2: Extracting (30-50%)
            updateProcessingStep(2, 'processing')
            setUploadProgress(40)

            // Simulate extraction time
            setTimeout(() => {
              updateProcessingStep(2, 'completed')

              // Step 3: ATS Analysis (50-70%)
              updateProcessingStep(3, 'processing')
              setUploadProgress(60)

              setTimeout(() => {
                updateProcessingStep(3, 'completed')

                // Step 4: Generating Insights (70-90%)
                updateProcessingStep(4, 'processing')
                setUploadProgress(80)

                setTimeout(() => {
                  updateProcessingStep(4, 'completed')

                  // Step 5: Finalizing (90-100%)
                  updateProcessingStep(5, 'processing')
                  setUploadProgress(95)
                }, 500)
              }, 500)
            }, 500)
          }
        }
      )

      // Complete all steps
      updateProcessingStep(5, 'completed')
      setAnalysis(result)
      setUploadProgress(100)
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to analyze resume. Please try again.'
      setError(errorMessage)
      console.error('Resume analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadReport = () => {
    if (!analysis) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = 20

    // Helper function to add text with wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      doc.setTextColor(color[0], color[1], color[2])
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
      doc.text(lines, margin, yPos)
      yPos += lines.length * fontSize * 0.5 + 5
    }

    // Check if new page is needed
    const checkNewPage = (spaceNeeded: number = 40) => {
      if (yPos + spaceNeeded > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        yPos = 20
      }
    }

    // Title
    doc.setFillColor(37, 99, 235) // Blue color
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Resume Analysis Report', pageWidth / 2, 25, { align: 'center' })
    yPos = 50

    // Overall ATS Score
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('Overall ATS Score', margin, yPos)
    yPos += 10

    const score = analysis.atsAnalysis.overallScore
    const scoreColor = score >= 80 ? [16, 185, 129] : score >= 60 ? [245, 158, 11] : [239, 68, 68]
    doc.setFontSize(40)
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.text(`${score}/100`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 20

    const scoreLabel = score >= 80 ? 'Excellent! Highly ATS-friendly' :
                       score >= 60 ? 'Good! Some improvements needed' :
                       'Needs improvement to pass ATS systems'
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(scoreLabel, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Section Scores
    checkNewPage(60)
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    addText('Section Breakdown', 14, true)
    yPos += 5

    const sections = [
      { name: 'Keywords', score: analysis.atsAnalysis.scores.keywords },
      { name: 'Formatting', score: analysis.atsAnalysis.scores.formatting },
      { name: 'Experience', score: analysis.atsAnalysis.scores.experience },
      { name: 'Skills', score: analysis.atsAnalysis.scores.skills }
    ]

    sections.forEach(section => {
      checkNewPage(15)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(section.name, margin, yPos)

      const sectionScoreColor = section.score >= 80 ? [16, 185, 129] :
                                section.score >= 60 ? [245, 158, 11] : [239, 68, 68]
      doc.setTextColor(sectionScoreColor[0], sectionScoreColor[1], sectionScoreColor[2])
      doc.text(`${section.score}/100`, pageWidth - margin - 20, yPos)

      // Progress bar
      doc.setFillColor(230, 230, 230)
      doc.rect(margin, yPos + 2, pageWidth - 2 * margin - 30, 4, 'F')
      doc.setFillColor(sectionScoreColor[0], sectionScoreColor[1], sectionScoreColor[2])
      doc.rect(margin, yPos + 2, (pageWidth - 2 * margin - 30) * (section.score / 100), 4, 'F')

      yPos += 12
    })

    yPos += 10

    // Suggestions
    checkNewPage(40)
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    addText('Improvement Suggestions', 14, true)
    yPos += 5

    analysis.atsAnalysis.suggestions.forEach((suggestion, index) => {
      checkNewPage(50)

      // Priority badge color
      const priorityColors = {
        critical: [239, 68, 68],
        high: [249, 115, 22],
        medium: [59, 130, 246],
        low: [34, 197, 94]
      }
      const priorityColor = priorityColors[suggestion.priority as keyof typeof priorityColors] || priorityColors.medium

      // Section title with priority
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(`${index + 1}. ${suggestion.section}`, margin, yPos)

      doc.setFontSize(9)
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2])
      doc.text(`[${suggestion.priority?.toUpperCase() || 'MEDIUM'}]`, pageWidth - margin - 30, yPos)
      yPos += 8

      // Issue
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60, 60, 60)
      const issueLines = doc.splitTextToSize(suggestion.issue, pageWidth - 2 * margin)
      doc.text(issueLines, margin, yPos)
      yPos += issueLines.length * 5 + 5

      // Improvement suggestion
      checkNewPage(30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('Suggested Improvement:', margin, yPos)
      yPos += 5

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(37, 99, 235)
      const improvementLines = doc.splitTextToSize(suggestion.improvement, pageWidth - 2 * margin)
      doc.text(improvementLines, margin, yPos)
      yPos += improvementLines.length * 4 + 10

      // Before/After if available
      if (suggestion.beforeAfter) {
        checkNewPage(40)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(220, 38, 38)
        doc.text('Before:', margin, yPos)
        yPos += 4

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const beforeLines = doc.splitTextToSize(suggestion.beforeAfter.before, pageWidth - 2 * margin)
        doc.text(beforeLines, margin, yPos)
        yPos += beforeLines.length * 4 + 6

        checkNewPage(20)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(16, 185, 129)
        doc.text('After:', margin, yPos)
        yPos += 4

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const afterLines = doc.splitTextToSize(suggestion.beforeAfter.after, pageWidth - 2 * margin)
        doc.text(afterLines, margin, yPos)
        yPos += afterLines.length * 4 + 10
      }

      yPos += 5
    })

    // Footer on last page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Generated by CareerCraft AI - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Save the PDF
    const fileName = file?.name ? `${file.name.replace('.pdf', '')}_analysis_report.pdf` : 'resume_analysis_report.pdf'
    doc.save(fileName)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200'
    if (score >= 60) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-amber-600'
    return 'bg-gradient-to-r from-red-500 to-red-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-blue-500 bg-blue-50'
      case 'low': return 'border-green-500 bg-green-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar variant="light" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            AI Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get instant ATS score, detailed feedback, and actionable suggestions to optimize your resume 
            and <span className="text-blue-600 font-semibold">land your dream job</span>
          </p>
          <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
              <span>ATS Optimized</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-500 mr-2" />
              <span>Expert Analysis</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
              <span>Detailed Insights</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {!analysis && (
          <div className="max-w-2xl mx-auto">
            <div 
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-white hover:shadow-md'
              } bg-white/80 backdrop-blur-sm`}
            >
              <input {...getInputProps()} />
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                isDragActive ? 'bg-blue-100' : 'bg-gray-50 group-hover:bg-blue-50'
              }`}>
                <Upload className={`h-8 w-8 transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                {isDragActive 
                  ? 'Release to upload your PDF resume'
                  : 'Drag and drop your PDF resume here, or click to select'}
              </p>
              
              <div className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <FileText className="mr-3 h-5 w-5" />
                Choose File
              </div>
              
              <p className="text-sm text-gray-500 mt-6 font-medium">
                Max file size: 10MB • Supported format: PDF
              </p>
            </div>

            {file && (
              <div className="mt-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-50 rounded-xl">
                      <FileText className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900 text-lg">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={analyzeResume}
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>Analyzing...</span>
                        {uploadProgress > 0 && (
                          <span className="ml-2 text-sm">({Math.round(uploadProgress)}%)</span>
                        )}
                      </>
                    ) : (
                      <>
                        <Zap className="mr-3 h-5 w-5" />
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </button>
                </div>
                {isAnalyzing && (
                  <div className="mt-6 space-y-4">
                    {/* Overall Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-700 font-medium mb-2">
                        <span>Processing your resume...</span>
                        <span className="text-emerald-600">{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Processing Steps */}
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Processing Steps:</p>
                      {processingSteps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-3">
                          {/* Step Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            step.status === 'completed'
                              ? 'bg-emerald-500 text-white'
                              : step.status === 'processing'
                              ? 'bg-blue-500 text-white animate-pulse'
                              : 'bg-gray-300 text-gray-500'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : step.status === 'processing' ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <span className="text-xs font-bold">{step.id}</span>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${
                              step.status === 'processing'
                                ? 'text-blue-700'
                                : step.status === 'completed'
                                ? 'text-emerald-700'
                                : 'text-gray-500'
                            }`}>
                              {step.label}
                            </p>
                            <p className={`text-xs mt-0.5 ${
                              step.status === 'processing'
                                ? 'text-blue-600'
                                : step.status === 'completed'
                                ? 'text-emerald-600'
                                : 'text-gray-400'
                            }`}>
                              {step.description}
                            </p>
                          </div>

                          {/* Status Indicator */}
                          {step.status === 'processing' && (
                            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Animated Tip */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Did you know?</p>
                          <p className="text-xs text-blue-700">
                            {processingSteps[0].status === 'processing' && "We use industry-standard ATS algorithms to score your resume."}
                            {processingSteps[1].status === 'processing' && "Our AI analyzes formatting, structure, and content quality."}
                            {processingSteps[2].status === 'processing' && "75% of resumes are rejected by ATS before reaching recruiters."}
                            {processingSteps[3].status === 'processing' && "Our suggestions are based on thousands of successful resumes."}
                            {processingSteps[4].status === 'processing' && "Your personalized report will include actionable improvements."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-10">
            {/* ATS Score Overview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <div className={`relative w-40 h-40 rounded-full border-8 ${getScoreBgColor(analysis.atsAnalysis.overallScore)} flex items-center justify-center mx-auto shadow-lg`}>
                    <div>
                      <div className={`text-5xl font-bold ${getScoreColor(analysis.atsAnalysis.overallScore)}`}>
                        {analysis.atsAnalysis.overallScore}
                      </div>
                      <div className="text-lg text-gray-500 font-medium">/100</div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className={`p-3 rounded-full ${
                      analysis.atsAnalysis.overallScore >= 80 ? 'bg-emerald-100' :
                      analysis.atsAnalysis.overallScore >= 60 ? 'bg-amber-100' : 'bg-red-100'
                    }`}>
                      <Award className={`h-6 w-6 ${getScoreColor(analysis.atsAnalysis.overallScore)}`} />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your ATS Score</h2>
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
                  analysis.atsAnalysis.overallScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                  analysis.atsAnalysis.overallScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {analysis.atsAnalysis.overallScore >= 80 ? '🎉 Excellent! Highly ATS-friendly' :
                   analysis.atsAnalysis.overallScore >= 60 ? '👍 Good! Some improvements needed' :
                   '⚠️ Needs improvement to pass ATS systems'}
                </div>
              </div>

              {/* Improve Resume CTA - Featured */}
              {analysis.atsAnalysis.overallScore < 90 && (
                <div className="my-8">
                  <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-grid-white/10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-white text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start">
                          <Sparkles className="mr-2 h-6 w-6" />
                          Want to Improve Your Score?
                        </h3>
                        <p className="text-indigo-100 text-lg">
                          Let AI apply all {analysis.atsAnalysis.suggestions.length} suggestions and generate an improved resume instantly
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ImproveResumeButton
                          resumeId={analysis.resumeId}
                          currentScore={analysis.atsAnalysis.overallScore}
                          suggestionsCount={analysis.atsAnalysis.suggestions.length}
                          onImproveComplete={() => {
                            // Optionally refresh analysis or show success message
                            console.log('Resume improved successfully!');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Breakdown */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <Target className="h-10 w-10 text-blue-600 mb-4" />
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.atsAnalysis.scores.keywords)}`}>
                    {analysis.atsAnalysis.scores.keywords}
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(analysis.atsAnalysis.scores.keywords)} transition-all duration-500`}
                      style={{ width: `${analysis.atsAnalysis.scores.keywords}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Keywords</p>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <FileText className="h-10 w-10 text-emerald-600 mb-4" />
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.atsAnalysis.scores.formatting)}`}>
                    {analysis.atsAnalysis.scores.formatting}
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(analysis.atsAnalysis.scores.formatting)} transition-all duration-500`}
                      style={{ width: `${analysis.atsAnalysis.scores.formatting}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Formatting</p>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <TrendingUp className="h-10 w-10 text-purple-600 mb-4" />
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.atsAnalysis.scores.experience)}`}>
                    {analysis.atsAnalysis.scores.experience}
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(analysis.atsAnalysis.scores.experience)} transition-all duration-500`}
                      style={{ width: `${analysis.atsAnalysis.scores.experience}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Experience</p>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <Star className="h-10 w-10 text-amber-600 mb-4" />
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.atsAnalysis.scores.skills)}`}>
                    {analysis.atsAnalysis.scores.skills}
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(analysis.atsAnalysis.scores.skills)} transition-all duration-500`}
                      style={{ width: `${analysis.atsAnalysis.scores.skills}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Skills</p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mr-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Improvement Suggestions</h3>
              </div>
              
              <div className="space-y-8">
                {analysis.atsAnalysis.suggestions.map((suggestion, index) => (
                  <div key={index} className={`relative rounded-2xl p-6 border-l-4 ${getPriorityColor(suggestion.priority)} shadow-sm hover:shadow-md transition-all duration-300`}>
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        suggestion.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        suggestion.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        suggestion.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {suggestion.priority?.toUpperCase() || 'MEDIUM'}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-xl text-gray-900 mb-3">{suggestion.section}</h4>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">{suggestion.issue}</p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
                      <p className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Suggested Improvement:
                      </p>
                      <p className="text-blue-800 leading-relaxed">{suggestion.improvement}</p>
                    </div>
                    
                    {suggestion.beforeAfter && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                          <p className="text-sm font-bold text-red-800 mb-3 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Before:
                          </p>
                          <p className="text-red-700 text-sm leading-relaxed">{suggestion.beforeAfter.before}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                          <p className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            After:
                          </p>
                          <p className="text-emerald-700 text-sm leading-relaxed">{suggestion.beforeAfter.after}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
              <button
                onClick={() => {
                  setAnalysis(null)
                  setFile(null)
                  setError('')
                  setUploadProgress(0)
                  resetProcessingSteps()
                }}
                className="w-full sm:w-auto inline-flex items-center px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <Upload className="mr-3 h-5 w-5" />
                Analyze Another Resume
              </button>
              <button
                onClick={downloadReport}
                className="w-full sm:w-auto inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download className="mr-3 h-5 w-5" />
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}