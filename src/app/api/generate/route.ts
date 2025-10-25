import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, model } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Fetch user settings from database
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('openrouter_api_key, default_model')
      .eq('user_id', session.user.id)
      .single()

    if (settingsError || !settings) {
      return NextResponse.json(
        { error: 'Please configure your OpenRouter API key in Settings before generating work items.' },
        { status: 400 }
      )
    }

    const apiKey = settings.openrouter_api_key
    const modelToUse = model || settings.default_model || 'anthropic/claude-3.5-sonnet'

    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add your API key in Settings.' },
        { status: 400 }
      )
    }

    console.log('Using OpenRouter model:', modelToUse)
    console.log('API Key present:', !!apiKey)

    // Initialize OpenAI client with OpenRouter
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        'X-Title': 'DevOps AI Pusher',
      }
    })

    const systemPrompt = `You are an expert project manager and DevOps consultant. Generate structured work items based on user requirements.

For each work item, provide:
- title: Clear, concise title (max 100 chars)
- description: Detailed description of the work (2-3 sentences)
- type: One of: "User Story", "Task", "Bug", "Feature", or "Epic"
- priority: One of: "Critical", "High", "Medium", or "Low"
- acceptanceCriteria: Array of 2-4 specific, testable acceptance criteria (optional for bugs/tasks)
- tags: Array of relevant tags (e.g., ["frontend", "api", "security"])
- estimatedHours: Estimated hours to complete (number)

Respond ONLY with valid JSON array of work items. No additional text or markdown.

Example format:
[
  {
    "title": "Implement user authentication",
    "description": "Create a secure authentication system with JWT tokens and password hashing. Include login, logout, and session management.",
    "type": "Feature",
    "priority": "High",
    "acceptanceCriteria": [
      "Users can login with email and password",
      "JWT tokens expire after 24 hours",
      "Failed login attempts are rate limited"
    ],
    "tags": ["authentication", "security", "backend"],
    "estimatedHours": 8
  }
]`

    console.log('Sending request to OpenRouter...')

    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })

    console.log('Received response from OpenRouter')

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from AI')
    }

    console.log('AI Response length:', response.length)

    // Parse the JSON response
    let workItems
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      workItems = JSON.parse(cleanedResponse)
    } catch (e) {
      console.error('Failed to parse AI response:', response)
      throw new Error('Invalid JSON response from AI')
    }

    // Validate work items
    if (!Array.isArray(workItems)) {
      throw new Error('AI response is not an array')
    }

    console.log('Successfully generated', workItems.length, 'work items')

    return NextResponse.json({ workItems })
  } catch (error: any) {
    console.error('Error generating work items:', error)
    console.error('Error details:', error.response?.data || error.message)
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate work items',
        details: error.response?.data || error.toString()
      },
      { status: 500 }
    )
  }
}
