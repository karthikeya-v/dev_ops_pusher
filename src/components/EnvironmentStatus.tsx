import { CheckCircle2, Loader2, AlertCircle, ExternalLink } from 'lucide-react'

interface EnvironmentStatusProps {
  name: string
  status: 'healthy' | 'deploying' | 'error'
  version: string
  url: string
  uptime: string
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
    label: 'Healthy'
  },
  deploying: {
    icon: Loader2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    label: 'Deploying'
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30',
    label: 'Error'
  }
}

export default function EnvironmentStatus({ name, status, version, url, uptime }: EnvironmentStatusProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${config.borderColor} hover:border-slate-600 transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className={`flex items-center space-x-1 ${config.bgColor} ${config.color} px-2 py-1 rounded-full text-xs font-medium`}>
          <StatusIcon className={`w-3 h-3 ${status === 'deploying' ? 'animate-spin' : ''}`} />
          <span>{config.label}</span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Version</span>
          <span className="font-mono text-slate-200">{version}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Uptime</span>
          <span className="text-slate-200">{uptime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">URL</span>
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="text-xs">{url}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
