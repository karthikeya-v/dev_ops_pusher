'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Sparkles,
  FileUp,
  FileDown,
  Send,
  Settings,
  Loader2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Layers,
  Upload,
  LogOut,
  User
} from 'lucide-react'
import WorkItemCard from '@/components/WorkItemCard'
import PromptBuilder from '@/components/PromptBuilder'
import ConfigPanel from '@/components/ConfigPanel'

export interface WorkItem {
  id?: string
  title: string
  description: string
  type: 'User Story' | 'Task' | 'Bug' | 'Feature' | 'Epic'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  acceptanceCriteria?: string[]
  tags?: string[]
  estimatedHours?: number
  assignedTo?: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet')
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleGenerate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || prompt
    if (!promptToUse.trim()) {
      alert('Please enter a prompt to generate work items')
      return
    }

    // Get API key from localStorage
    const apiKey = localStorage.getItem('openrouter_api_key')
    if (!apiKey || apiKey.trim() === '') {
      setGenerationStatus('error')
      setStatusMessage('OpenRouter API key not configured. Please add your API key in Settings.')
      setShowConfig(true)
      return
    }

    setIsGenerating(true)
    setGenerationStatus('generating')
    setStatusMessage('Generating work items with AI...')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          model: selectedModel,
          apiKey: apiKey
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate work items')
      }

      setWorkItems(data.workItems)
      setGenerationStatus('success')
      setStatusMessage(`Successfully generated ${data.workItems.length} work items`)
    } catch (error: any) {
      console.error('Error generating work items:', error)
      setGenerationStatus('error')
      setStatusMessage(error.message || 'Failed to generate work items. Please check your API configuration and console for details.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePushToAzure = async () => {
    if (workItems.length === 0) {
      alert('No work items to push')
      return
    }

    setIsGenerating(true)
    setGenerationStatus('generating')
    setStatusMessage('Pushing work items to Azure DevOps...')

    try {
      const response = await fetch('/api/azure-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workItems })
      })

      if (!response.ok) {
        throw new Error('Failed to push work items')
      }

      const data = await response.json()
      setGenerationStatus('success')
      setStatusMessage(`Successfully pushed ${data.created} work items to Azure DevOps`)
    } catch (error) {
      console.error('Error pushing to Azure:', error)
      setGenerationStatus('error')
      setStatusMessage('Failed to push work items. Please check your Azure DevOps configuration.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(workItems, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'work-items.json'
    link.click()
  }

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const items = JSON.parse(e.target?.result as string)
          setWorkItems(items)
          setStatusMessage(`Imported ${items.length} work items`)
        } catch (error) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleRemoveItem = (index: number) => {
    setWorkItems(workItems.filter((_, i) => i !== index))
  }

  const handleEditItem = (index: number, updatedItem: WorkItem) => {
    const newItems = [...workItems]
    newItems[index] = updatedItem
    setWorkItems(newItems)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  DevOps AI Pusher
                </h1>
                <p className="text-slate-400 text-sm">Generate & Push Work Items to Azure DevOps</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Panel */}
        {showConfig && (
          <div className="mb-8">
            <ConfigPanel selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </div>
        )}

        {/* Status Message */}
        {generationStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            generationStatus === 'generating' ? 'bg-blue-500/10 border border-blue-500/20' :
            generationStatus === 'success' ? 'bg-green-500/10 border border-green-500/20' :
            'bg-red-500/10 border border-red-500/20'
          }`}>
            {generationStatus === 'generating' && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
            {generationStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
            {generationStatus === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Prompt Builder */}
        <div className="mb-8">
          <PromptBuilder onGenerate={handleGenerate} />
        </div>

        {/* Custom Prompt Input */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold">Custom AI Prompt</h2>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the work items you want to generate...

Example: 'Create 5 user stories for an e-commerce checkout flow with payment integration, including acceptance criteria and tags'"
              className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Sparkles className="w-4 h-4" />
                <span>Using: {selectedModel.split('/')[1].replace(/-/g, ' ').toUpperCase()}</span>
              </div>
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-all font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Work Items</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {workItems.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={handlePushToAzure}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 px-6 py-3 rounded-lg transition-all font-semibold"
            >
              <Send className="w-5 h-5" />
              <span>Push to Azure DevOps</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg transition-all font-semibold"
            >
              <FileDown className="w-5 h-5" />
              <span>Export JSON</span>
            </button>
            <label className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg transition-all font-semibold cursor-pointer">
              <FileUp className="w-5 h-5" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Work Items List */}
        {workItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Layers className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">Generated Work Items</h2>
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {workItems.length}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {workItems.map((item, index) => (
                <WorkItemCard
                  key={index}
                  workItem={item}
                  onRemove={() => handleRemoveItem(index)}
                  onEdit={(updated) => handleEditItem(index, updated)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {workItems.length === 0 && !isGenerating && (
          <div className="text-center py-16">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700 max-w-2xl mx-auto">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Work Items Yet</h3>
              <p className="text-slate-400 mb-6">
                Use AI to generate work items or import from JSON
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>AI Generation</span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    Describe your project needs and let AI create structured work items for you
                  </p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Import Existing</span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    Upload a JSON file with your pre-defined work items
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
