'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Key, Cloud, AlertCircle, CheckCircle2, ExternalLink, Cpu, Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const AI_MODELS = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', recommended: true },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (Fast & Cheap)', provider: 'Anthropic' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'openai/gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Cheap)', provider: 'OpenAI' },
  { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', provider: 'Meta' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [user, setUser] = useState<any>(null)

  // Form fields
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [defaultModel, setDefaultModel] = useState('anthropic/claude-3.5-sonnet')
  const [azureOrg, setAzureOrg] = useState('')
  const [azureProject, setAzureProject] = useState('')
  const [azurePat, setAzurePat] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
      return
    }

    setUser(session.user)
    await loadSettings()
    setLoading(false)
  }

  async function loadSettings() {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        setOpenRouterKey(data.openrouter_api_key || '')
        setDefaultModel(data.default_model || 'anthropic/claude-3.5-sonnet')
        setAzureOrg(data.azure_devops_org || '')
        setAzureProject(data.azure_devops_project || '')
        setAzurePat(data.azure_devops_pat || '')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  async function handleSaveSettings() {
    setSaveStatus('saving')

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openrouter_api_key: openRouterKey,
          default_model: defaultModel,
          azure_devops_org: azureOrg,
          azure_devops_project: azureProject,
          azure_devops_pat: azurePat,
        }),
      })

      if (response.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    )
  }

  const isOpenRouterConfigured = openRouterKey.trim().length > 0
  const isAzureConfigured = azureOrg && azureProject && azurePat

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-slate-400">
            Configure your API keys and Azure DevOps credentials
          </p>
        </div>

        <div className="space-y-6">
          {/* AI Model Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-2 mb-4">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold">AI Model Selection</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Default AI Model
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {model.recommended ? '(Recommended)' : ''} - {model.provider}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-400">
                Different models have different capabilities and costs. Claude 3.5 Sonnet is recommended for best results.
              </p>
            </div>
          </div>

          {/* OpenRouter API Key */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-2 mb-4">
              <Key className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">OpenRouter API Key</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                API Key
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center text-xs"
                >
                  Get Key <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </label>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isOpenRouterConfigured && (
                <p className="mt-2 text-xs text-green-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>API Key configured</span>
                </p>
              )}
              {!isOpenRouterConfigured && (
                <p className="mt-2 text-xs text-yellow-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Please add your OpenRouter API key to use AI generation</span>
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                Your API key is stored securely in the database and used for all AI requests.
              </p>
            </div>

            {/* Help Text */}
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-300">How to get OpenRouter API Key</h4>
              <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">openrouter.ai/keys</a></li>
                <li>Sign up or log in to your account</li>
                <li>Create a new API key</li>
                <li>Add credits to your account (pay-as-you-go)</li>
                <li>Copy the key and paste it above</li>
              </ol>
            </div>
          </div>

          {/* Azure DevOps Configuration */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-2 mb-4">
              <Cloud className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold">Azure DevOps Configuration</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Organization Name
                  <a
                    href="https://dev.azure.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center text-xs"
                  >
                    Open Azure DevOps <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </label>
                <input
                  type="text"
                  value={azureOrg}
                  onChange={(e) => setAzureOrg(e.target.value)}
                  placeholder="your-organization"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Found in your Azure DevOps URL: https://dev.azure.com/<strong>your-organization</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={azureProject}
                  onChange={(e) => setAzureProject(e.target.value)}
                  placeholder="your-project"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Your Azure DevOps project name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Personal Access Token (PAT)
                  <a
                    href="https://dev.azure.com/_usersSettings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center text-xs"
                  >
                    Create Token <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </label>
                <input
                  type="password"
                  value={azurePat}
                  onChange={(e) => setAzurePat(e.target.value)}
                  placeholder="Your Azure DevOps PAT"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Requires <strong>Work Items: Read & Write</strong> permissions
                </p>
              </div>

              {isAzureConfigured && (
                <p className="text-xs text-green-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Azure DevOps configured</span>
                </p>
              )}
              {!isAzureConfigured && (
                <p className="text-xs text-yellow-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Please configure Azure DevOps to push work items</span>
                </p>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-300">How to get Azure DevOps PAT</h4>
              <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://dev.azure.com/_usersSettings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Azure DevOps User Settings</a></li>
                <li>Click "New Token"</li>
                <li>Give it a name and set expiration</li>
                <li>Select "Work Items" scope with "Read & Write" permissions</li>
                <li>Click "Create" and copy the token immediately</li>
                <li>Paste it above and save</li>
              </ol>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Saved!</span>
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>Error - Try Again</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
