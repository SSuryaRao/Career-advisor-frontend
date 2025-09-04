'use client'

import React, { useState } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Download, Zap, Target, Star, TrendingUp, AlertCircle, CheckCircle, Award, Sparkles, BarChart3 } from 'lucide-react'
import { uploadAndAnalyzeResume, type BackendResumeAnalysis } from '@/lib/api/resume'
import { validatePDFFile } from '@/lib/pdf-utils'

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<BackendResumeAnalysis | null>(null)
  const [error, setError] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)

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

  const analyzeResume = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError('')
    setUploadProgress(0)

    try {
      // Determine upload method based on how file was added
      const uploadMethod = 'file-picker' // You can track this in onDrop if needed
      
      const result = await uploadAndAnalyzeResume(
        file, 
        uploadMethod,
        (progress) => {
          setUploadProgress(progress)
        }
      )
      
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                {isAnalyzing && uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Processing...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
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
                }}
                className="w-full sm:w-auto inline-flex items-center px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <Upload className="mr-3 h-5 w-5" />
                Analyze Another Resume
              </button>
              <button className="w-full sm:w-auto inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
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