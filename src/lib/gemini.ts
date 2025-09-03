import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the API - make sure to add your API key to .env.local
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
if (!apiKey) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(apiKey || '')

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface MentorContext {
  mentorName: string
  specialty: string
  personality: string
  language: string
}

export interface AIResponse {
  content: string
  suggestions?: string[]
}

export class GeminiAI {
  private model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  })

  private createSystemPrompt(context: MentorContext): string {
    const languageInstruction = context.language !== 'English' 
      ? `IMPORTANT: Respond entirely in ${context.language} language.` 
      : ''

    return `You are ${context.mentorName}, a professional career mentor specializing in ${context.specialty}. 
    Your personality is ${context.personality}. 
    ${languageInstruction}
    
    You are helping Indian students and professionals with career advice, skill development, job search strategies, and professional growth.
    
    Core Responsibilities:
    1. Provide personalized career guidance based on individual strengths and market demands
    2. Analyze skill gaps and recommend specific learning paths
    3. Offer practical advice for the Indian job market
    4. Support students in making informed career decisions
    
    Guidelines:
    - Provide practical, actionable advice with specific steps
    - Be supportive, encouraging, and empathetic
    - Use Indian context for salaries (in Lakhs/Crores), companies, education system, and market trends
    - Include specific timelines and milestones when creating roadmaps
    - Ask clarifying questions to better understand the user's situation
    - Keep responses concise (under 300 words) but comprehensive
    - Use markdown formatting for better readability
    - Include relevant examples from Indian companies and success stories
    
    Career Focus Areas:
    - Career planning and exploration (traditional + emerging fields)
    - Skill gap analysis and development roadmaps
    - Interview preparation (technical + HR rounds)
    - Resume/CV optimization for ATS systems
    - Salary negotiation in Indian context
    - Industry insights and job market trends
    - Learning resources, MOOCs, and certifications
    - Internship and placement strategies
    - Higher education guidance (India and abroad)
    
    Response Structure:
    1. Acknowledge the user's query
    2. Provide structured advice with clear points
    3. Include specific actionable steps
    4. Mention relevant resources or next steps
    5. End with encouragement or a clarifying question
    
    Remember: Focus on the Indian education system, job market, and career landscape. Consider factors like campus placements, off-campus opportunities, service-based vs product companies, and startup culture in India.`
  }

  async generateResponse(
    message: string, 
    context: MentorContext,
    chatHistory: ChatMessage[] = []
  ): Promise<AIResponse> {
    try {
      if (!apiKey) {
        throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.')
      }

      const systemPrompt = this.createSystemPrompt(context)
      
      // Build conversation with proper formatting
      const messages: string[] = [systemPrompt]
      
      // Add conversation history (limit to last 10 messages to avoid token limits)
      const recentHistory = chatHistory.slice(-10)
      recentHistory.forEach(msg => {
        if (msg.role === 'user') {
          messages.push(`User: ${msg.content}`)
        } else {
          messages.push(`Assistant: ${msg.content}`)
        }
      })
      
      // Add current message
      messages.push(`User: ${message}`)
      messages.push('Assistant:')
      
      const prompt = messages.join('\n\n')

      // Generate response
      const result = await this.model.generateContent(prompt)
      const response = result.response
      
      if (!response || !response.text) {
        throw new Error('Invalid response from Gemini API')
      }
      
      const content = response.text().trim()
      
      // Generate context-aware suggestions
      const suggestions = await this.generateSuggestions(message, content, context)

      return {
        content,
        suggestions
      }
    } catch (error) {
      console.error('Error in generateResponse:', error)
      
      // Provide fallback response for common errors
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('API configuration error. Please check your settings.')
        }
        if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.')
        }
        if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection.')
        }
      }
      
      throw new Error('Unable to generate response. Please try again.')
    }
  }

  private async generateSuggestions(
    userMessage: string, 
    aiResponse: string, 
    context: MentorContext
  ): Promise<string[]> {
    try {
      // Create a focused prompt for suggestions
      const promptForSuggestions = `Based on this career counseling conversation in the Indian context:

User Query: "${userMessage.substring(0, 200)}"
Mentor's Response Summary: "${aiResponse.substring(0, 300)}"
Mentor Specialty: ${context.specialty}

Generate exactly 4 relevant follow-up questions or action items that would help the user progress in their career journey. Each suggestion should be:
- Maximum 10 words
- Specific and actionable
- Relevant to Indian job market
- Natural follow-ups to the conversation

Format: One suggestion per line, no numbering or bullets.`

      const result = await this.model.generateContent(promptForSuggestions)
      const response = result.response
      
      if (!response || !response.text) {
        return this.getDefaultSuggestions(context)
      }
      
      const suggestions = response.text()
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.length < 80) // Filter out empty or too long suggestions
        .slice(0, 4)

      // Ensure we have at least 2 suggestions
      if (suggestions.length < 2) {
        return this.getDefaultSuggestions(context)
      }

      return suggestions
    } catch (error) {
      console.error('Error generating suggestions:', error)
      return this.getDefaultSuggestions(context)
    }
  }

  private getDefaultSuggestions(context: MentorContext): string[] {
    const suggestionSets: Record<string, string[]> = {
      'Career Planning': [
        'Show me high-demand career paths',
        'Analyze my skills and interests',
        'Create 6-month career roadmap',
        'Find mentors in my field'
      ],
      'Technology Careers': [
        'Latest tech skills in demand',
        'Best programming languages to learn',
        'Tech interview preparation tips',
        'Product vs Service companies comparison'
      ],
      'Skill Development': [
        'Identify my skill gaps',
        'Recommend online courses',
        'Create learning schedule',
        'Track skill progress'
      ],
      'Interview Preparation': [
        'Common interview questions',
        'Mock interview practice',
        'Salary negotiation strategies',
        'Body language tips'
      ]
    }

    return suggestionSets[context.specialty] || [
      'Tell me about career opportunities',
      'Help me with skill development',
      'Create a learning roadmap',
      'Prepare for interviews'
    ]
  }

  // Additional utility method for analyzing user profile
  async analyzeCareerProfile(
    profile: {
      education: string
      skills: string[]
      experience: string
      interests: string[]
      goals: string
    },
    context: MentorContext
  ): Promise<AIResponse> {
    const profileSummary = `
    Education: ${profile.education}
    Current Skills: ${profile.skills.join(', ')}
    Experience: ${profile.experience}
    Interests: ${profile.interests.join(', ')}
    Career Goals: ${profile.goals}
    `

    const analysisPrompt = `As ${context.mentorName}, analyze this career profile and provide comprehensive guidance:
    ${profileSummary}
    
    Provide:
    1. Career path recommendations (3-4 options)
    2. Skill gaps to address
    3. Immediate action steps (next 30 days)
    4. 6-month roadmap
    5. Recommended resources and certifications
    
    Keep it specific to the Indian job market and include salary expectations.`

    return this.generateResponse(analysisPrompt, context)
  }
}

// Export singleton instance
export const geminiAI = new GeminiAI()