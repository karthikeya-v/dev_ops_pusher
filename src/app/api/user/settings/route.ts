import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/user/settings - Retrieve user settings
export async function GET() {
  try {
    const supabase = createClient()

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user settings
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching user settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If no settings exist, return empty object
    if (!data) {
      return NextResponse.json({
        openrouter_api_key: '',
        default_model: 'anthropic/claude-3.5-sonnet',
        azure_devops_org: '',
        azure_devops_project: '',
        azure_devops_pat: '',
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/user/settings - Create or update user settings
export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      openrouter_api_key,
      default_model,
      azure_devops_org,
      azure_devops_project,
      azure_devops_pat,
    } = body

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    const settingsData = {
      user_id: session.user.id,
      openrouter_api_key: openrouter_api_key || null,
      default_model: default_model || 'anthropic/claude-3.5-sonnet',
      azure_devops_org: azure_devops_org || null,
      azure_devops_project: azure_devops_project || null,
      azure_devops_pat: azure_devops_pat || null,
    }

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('user_settings')
        .update(settingsData)
        .eq('user_id', session.user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(data)
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('user_settings')
        .insert(settingsData)
        .select()
        .single()

      if (error) {
        console.error('Error creating settings:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(data)
    }
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
