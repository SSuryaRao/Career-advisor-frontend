'use client'

import { useState } from 'react'
import { Download, Sparkles, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react'
import { improveResume, type ImproveResumeResponse } from '@/lib/api/resume'
import { Button } from '@/components/ui/button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Progress } from '@/components/ui/progress'

interface ImproveResumeButtonProps {
  resumeId: string
  currentScore: number
  suggestionsCount: number
  onImproveComplete?: (result: ImproveResumeResponse) => void
}

export default function ImproveResumeButton({
  resumeId,
  currentScore,
  suggestionsCount,
  onImproveComplete
}: ImproveResumeButtonProps) {
  const [isImproving, setIsImproving] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [improvementResult, setImprovementResult] = useState<ImproveResumeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  const handleImprove = async () => {
    try {
      setIsImproving(true)
      setError(null)
      setStatus('Generating improved content...')

      // Call API to improve resume
      const result = await improveResume(resumeId, (progressStatus) => {
        setStatus(progressStatus)
      })

      setImprovementResult(result)
      setShowResult(true)
      setIsImproving(false)

      // Notify parent component
      if (onImproveComplete) {
        onImproveComplete(result)
      }

    } catch (err) {
      console.error('Resume improvement error:', err)
      setError(err instanceof Error ? err.message : 'Failed to improve resume')
      setIsImproving(false)
    }
  }

  const handleDownload = () => {
    if (improvementResult?.download.url) {
      window.open(improvementResult.download.url, '_blank')
    }
  }

  return (
    <>
      {/* Improve Resume Button */}
      <Button
        onClick={handleImprove}
        disabled={isImproving}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
      >
        {isImproving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Improving...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Improve Resume with AI
          </>
        )}
      </Button>

      {/* Processing Modal */}
      <Modal open={isImproving} onOpenChange={() => {}}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Improving Your Resume
            </ModalTitle>
            <ModalDescription>
              Please wait while AI enhances your resume...
            </ModalDescription>
          </ModalHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              <span className="text-sm text-gray-700">{status}</span>
            </div>

            <Progress value={isImproving ? 66 : 0} className="h-2" />

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-purple-900">
                Applying {suggestionsCount} improvements:
              </p>
              <ul className="text-xs text-purple-700 space-y-1 ml-4">
                <li>• Adding missing keywords</li>
                <li>• Enhancing action verbs</li>
                <li>• Improving formatting</li>
                <li>• Optimizing for ATS</li>
              </ul>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Results Modal */}
      <Modal open={showResult} onOpenChange={setShowResult}>
        <ModalContent className="sm:max-w-2xl">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Resume Improved Successfully!
            </ModalTitle>
            <ModalDescription>
              Your resume has been enhanced with AI-powered improvements
            </ModalDescription>
          </ModalHeader>

          {improvementResult && (
            <div className="space-y-6 py-4">
              {/* Score Improvement */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Original Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {improvementResult.improvement.originalScore}
                      <span className="text-sm text-gray-500">/100</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-700">
                        +{improvementResult.improvement.scoreIncrease}
                      </p>
                      <p className="text-xs text-green-600">
                        ({improvementResult.improvement.percentageIncrease}% increase)
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Improved Score</p>
                    <p className="text-3xl font-bold text-green-600">
                      {improvementResult.improvement.improvedScore}
                      <span className="text-sm text-gray-500">/100</span>
                    </p>
                  </div>
                </div>

                <Progress
                  value={improvementResult.improvement.improvedScore}
                  className="h-3"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">
                    Suggestions Applied
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {improvementResult.appliedSuggestions}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-purple-900">
                    Processing Time
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(improvementResult.processingTime / 1000).toFixed(1)}s
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Improved Resume
                </Button>

                <Button
                  onClick={() => setShowResult(false)}
                  variant="outline"
                  className="px-6"
                >
                  Close
                </Button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Your improved resume has been generated with enhanced keywords, better formatting,
                    and optimized content for ATS systems. Download and use it for your job applications!
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Error Alert */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </>
  )
}
