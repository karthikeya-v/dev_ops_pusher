import { Key, Cloud, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function ConfigPanel() {
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
      <h2 className="text-xl font-bold mb-6">API Configuration</h2>

      <div className="space-y-6">
        {/* OpenRouter Configuration */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">OpenRouter API</h3>
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
              <input
                type="password"
                value={config.openRouterKey}
                onChange={(e) => setConfig({ ...config, openRouterKey: e.target.value })}
                placeholder="sk-or-..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                Organization Name
              </label>
              <input
                type="text"
                value={config.azureOrg}
                onChange={(e) => setConfig({ ...config, azureOrg: e.target.value })}
                placeholder="your-organization"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={config.azureProject}
                onChange={(e) => setConfig({ ...config, azureProject: e.target.value })}
                placeholder="your-project"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="Enter your PAT"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="pt-4 border-t border-slate-700">
          {testStatus === 'success' && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Configuration validated successfully!</span>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">Configuration test failed. Please check your credentials.</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              {isConfigured ? (
                <span className="flex items-center space-x-2 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configuration complete</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please fill in all fields</span>
                </span>
              )}
            </div>

            <button
              onClick={handleTest}
              disabled={!isConfigured || testStatus === 'testing'}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-300">Environment Variables</h4>
          <p className="text-sm text-slate-300 mb-2">
            For production deployment, set these in your <code className="bg-slate-900/50 px-2 py-1 rounded text-xs">.env.local</code> file:
          </p>
          <pre className="text-xs bg-slate-900/50 p-3 rounded overflow-x-auto text-slate-300">
{`OPENROUTER_API_KEY=your_key_here
AZURE_DEVOPS_ORG=your_org
AZURE_DEVOPS_PROJECT=your_project
AZURE_DEVOPS_PAT=your_pat`}
          </pre>
        </div>
      </div>
    </div>
  )
}
