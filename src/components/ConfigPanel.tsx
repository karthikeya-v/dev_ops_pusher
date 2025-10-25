import { Key, Cloud, AlertCircle, CheckCircle2, ExternalLink, Cpu, Save } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ConfigPanelProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

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

export default function ConfigPanel({ selectedModel, onModelChange }: ConfigPanelProps) {
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_api_key')
    if (savedKey) {
      setOpenRouterKey(savedKey)
    }
  }, [])

  const handleSaveApiKey = () => {
    setSaveStatus('saving')
    localStorage.setItem('openrouter_api_key', openRouterKey)
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 500)
  }

  const isKeyConfigured = openRouterKey.trim().length > 0

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold mb-6">Configuration</h2>

      <div className="space-y-6">
        {/* AI Model Selection */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">AI Model Selection</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Choose AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
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

        {/* OpenRouter Configuration */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">OpenRouter API Key</h3>
          </div>
          <div className="space-y-3">
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
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveApiKey}
                  disabled={!openRouterKey.trim() || saveStatus === 'saving'}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save'}</span>
                </button>
              </div>
              {isKeyConfigured && (
                <p className="mt-2 text-xs text-green-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>API Key configured and saved</span>
                </p>
              )}
              {!isKeyConfigured && (
                <p className="mt-2 text-xs text-yellow-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Please add your OpenRouter API key to use AI generation</span>
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                Your API key is stored locally in your browser and sent directly to OpenRouter.
              </p>
            </div>
          </div>
        </div>

        {/* Azure DevOps Configuration */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Cloud className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Azure DevOps</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              Azure DevOps credentials are configured in environment variables for security.
              Contact your administrator to update these settings.
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-300">How to get OpenRouter API Key</h4>
          <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
            <li>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">openrouter.ai/keys</a></li>
            <li>Sign up or log in to your account</li>
            <li>Create a new API key</li>
            <li>Add credits to your account (pay-as-you-go)</li>
            <li>Copy the key and paste it above</li>
            <li>Click "Save" to store it securely in your browser</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
