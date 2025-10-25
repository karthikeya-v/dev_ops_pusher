import { Key, Cloud, AlertCircle, CheckCircle2, ExternalLink, Cpu } from 'lucide-react'
import { useState } from 'react'

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
  const [config, setConfig] = useState({
    openRouterKey: '',
    azureOrg: '',
    azureProject: '',
    azurePAT: ''
  })

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const isConfigured = config.openRouterKey && config.azureOrg && config.azureProject && config.azurePAT

  const handleTest = async () => {
    setTestStatus('testing')

    // Simulate API test
    setTimeout(() => {
      setTestStatus('success')
    }, 2000)
  }

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
            <h3 className="text-lg font-semibold">OpenRouter API</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                API Key (Set in .env.local)
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
                value={config.openRouterKey}
                onChange={(e) => setConfig({ ...config, openRouterKey: e.target.value })}
                placeholder="Set in environment variables"
                disabled
                className="w-full bg-slate-900/30 border border-slate-700 rounded-lg p-3 text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-400">
                Configure in .env.local: OPENROUTER_API_KEY
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Organization Name (Set in .env.local)
              </label>
              <input
                type="text"
                value={config.azureOrg}
                onChange={(e) => setConfig({ ...config, azureOrg: e.target.value })}
                placeholder="Set in environment variables"
                disabled
                className="w-full bg-slate-900/30 border border-slate-700 rounded-lg p-3 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Name (Set in .env.local)
              </label>
              <input
                type="text"
                value={config.azureProject}
                onChange={(e) => setConfig({ ...config, azureProject: e.target.value })}
                placeholder="Set in environment variables"
                disabled
                className="w-full bg-slate-900/30 border border-slate-700 rounded-lg p-3 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Personal Access Token (PAT)
                <a
                  href="https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center text-xs"
                >
                  How to create <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </label>
              <input
                type="password"
                value={config.azurePAT}
                onChange={(e) => setConfig({ ...config, azurePAT: e.target.value })}
                placeholder="Set in environment variables"
                disabled
                className="w-full bg-slate-900/30 border border-slate-700 rounded-lg p-3 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-300">Environment Variables</h4>
          <p className="text-sm text-slate-300 mb-2">
            Configure these in your <code className="bg-slate-900/50 px-2 py-1 rounded text-xs">.env.local</code> file:
          </p>
          <pre className="text-xs bg-slate-900/50 p-3 rounded overflow-x-auto text-slate-300">
{`OPENROUTER_API_KEY=sk-or-...
AZURE_DEVOPS_ORG=your_org
AZURE_DEVOPS_PROJECT=your_project
AZURE_DEVOPS_PAT=your_pat`}
          </pre>
        </div>
      </div>
    </div>
  )
}
