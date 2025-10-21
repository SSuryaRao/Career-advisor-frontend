'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  TrendingUp,
  CheckCircle,
  Download,
  Share2,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Clock,
  BookOpen
} from 'lucide-react'
import { Answer, SessionData } from '@/lib/intelligentInterviewApi'
import { FeedbackDisplay } from './FeedbackDisplay'

interface SessionResultsProps {
  sessionData: SessionData
  answers: Answer[]
  onRestart: () => void
  onNewSession: () => void
}

export function SessionResults({ sessionData, answers, onRestart, onNewSession }: SessionResultsProps) {
  const averageScore = answers.reduce((sum, a) => sum + a.analysis.score, 0) / answers.length
  const totalScore = averageScore.toFixed(2)

  const getScoreGrade = (score: number) => {
    if (score >= 90) return {
      grade: 'A+',
      color: 'from-green-500 to-emerald-600',
      text: 'Excellent!',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    }
    if (score >= 80) return {
      grade: 'A',
      color: 'from-green-500 to-emerald-600',
      text: 'Great Job!',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    }
    if (score >= 70) return {
      grade: 'B',
      color: 'from-blue-500 to-cyan-600',
      text: 'Good Work!',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300'
    }
    if (score >= 60) return {
      grade: 'C',
      color: 'from-yellow-500 to-orange-600',
      text: 'Keep Practicing!',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300'
    }
    return {
      grade: 'D',
      color: 'from-red-500 to-pink-600',
      text: 'Needs Improvement',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-300'
    }
  }

  const scoreGrade = getScoreGrade(parseFloat(totalScore))

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Overall Score - Enhanced */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center relative"
      >
        {/* Animated Confetti Background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Grade Badge with Glow Effect */}
        <div className="relative inline-block mb-8">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${scoreGrade.color} rounded-full blur-2xl opacity-40`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          ></motion.div>
          <motion.div
            className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center bg-gradient-to-r ${scoreGrade.color} shadow-2xl`}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Trophy className="w-10 h-10 text-white mb-2" />
            <div className="text-5xl font-bold text-white">{scoreGrade.grade}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Interview Complete!
          </h2>
          <p className="text-2xl font-semibold text-gray-700 mb-2">{scoreGrade.text}</p>
          <div className="flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <p className="text-lg text-gray-600">
              Overall Score: <span className="font-bold text-2xl text-indigo-600">{totalScore}</span>
              <span className="text-gray-500">/100</span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Summary Stats - Enhanced with Modern Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-indigo-600" />
          Session Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">{answers.length}</div>
            <div className="text-sm opacity-90">Questions Answered</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Target className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">{sessionData.level}</div>
            <div className="text-sm opacity-90">Difficulty Level</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${scoreGrade.color} p-6 text-white shadow-lg`}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Trophy className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">{totalScore}%</div>
            <div className="text-sm opacity-90">Average Score</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-4xl font-bold mb-1">
              {sessionData.analysisMode === 'advanced' ? 'AI+' : 'AI'}
            </div>
            <div className="text-sm opacity-90">Analysis Mode</div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Performance by Question - Dark Modern Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
          Performance Overview
        </h3>
        <div className="space-y-4">
          {answers.map((answer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl overflow-hidden relative">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

                <div className="flex items-start justify-between relative">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Question Number Badge */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${
                      answer.analysis.score >= 70 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                      answer.analysis.score >= 50 ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                      'bg-gradient-to-br from-orange-400 to-red-500'
                    } text-white`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1">
                      {/* Question Text */}
                      <p className="text-base font-medium text-white mb-3 leading-relaxed">
                        {answer.questionData.questionText}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-gray-700/50 text-gray-200 border-gray-600 hover:bg-gray-700">
                          {answer.questionData.difficulty}
                        </Badge>
                        <Badge className="bg-gray-700/50 text-gray-200 border-gray-600 hover:bg-gray-700">
                          {answer.questionData.category}
                        </Badge>
                        {answer.questionData.keywords?.slice(0, 2).map((keyword, i) => (
                          <Badge key={i} className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Score Performance</span>
                          <span className={`font-bold ${
                            answer.analysis.score >= 70 ? 'text-green-400' :
                            answer.analysis.score >= 50 ? 'text-blue-400' :
                            'text-orange-400'
                          }`}>
                            {answer.analysis.score.toFixed(2)}%
                          </span>
                        </div>
                        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              answer.analysis.score >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              answer.analysis.score >= 50 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                              'bg-gradient-to-r from-orange-400 to-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${answer.analysis.score}%` }}
                            transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <motion.div
                    className={`ml-6 text-center min-w-[80px]`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className={`text-5xl font-bold ${
                      answer.analysis.score >= 70 ? 'text-green-400' :
                      answer.analysis.score >= 50 ? 'text-blue-400' :
                      'text-orange-400'
                    }`}>
                      {answer.analysis.score.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">out of 100</div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Feedback for Each Question - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-indigo-600" />
          Detailed Feedback
        </h3>
        <div className="space-y-8">
          {answers.map((answer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
            >
              <Card className="overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {/* Header Section */}
                <div className={`p-6 bg-gradient-to-br ${scoreGrade.bgColor} ${scoreGrade.borderColor} border-b-2`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-indigo-600 text-white text-sm px-3 py-1">
                          Question {idx + 1}
                        </Badge>
                        <Badge className="bg-gray-700 text-white text-sm px-3 py-1">
                          {answer.questionData.difficulty}
                        </Badge>
                        <Badge className="bg-gray-600 text-white text-sm px-3 py-1">
                          {answer.questionData.category}
                        </Badge>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 leading-relaxed">
                        {answer.questionData.questionText}
                      </h4>
                    </div>

                    {/* Score Circle */}
                    <motion.div
                      className={`ml-6 relative`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-lg border-4 ${
                        answer.analysis.score >= 70 ? 'border-green-500' :
                        answer.analysis.score >= 50 ? 'border-blue-500' :
                        'border-orange-500'
                      }`}>
                        <div className={`text-2xl font-bold ${
                          answer.analysis.score >= 70 ? 'text-green-600' :
                          answer.analysis.score >= 50 ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                          {answer.analysis.score.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="p-6 bg-white">
                  <FeedbackDisplay
                    analysis={answer.analysis}
                    questionText={answer.questionData.questionText}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8 pb-12"
      >
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 px-8 py-6 text-lg border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
        >
          <RotateCcw className="w-5 h-5" />
          Retake This Interview
        </Button>

        <Button
          onClick={onNewSession}
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Start New Interview
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 px-8 py-6 text-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
        >
          <Download className="w-5 h-5" />
          Download Report
        </Button>
      </motion.div>
    </div>
  )
}
