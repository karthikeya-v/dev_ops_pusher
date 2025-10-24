import { GitBranch, GitCommit, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface DeploymentCardProps {
  deployment: {
    id: number
    name: string
    status: 'success' | 'failed' | 'in_progress'
    branch: string
    commit: string
    timestamp: string
    duration: string
    environment: string
  }
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    label: 'Success'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    label: 'Failed'
  },
  in_progress: {
    icon: Loader2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    label: 'In Progress'
  }
}

export default function DeploymentCard({ deployment }: DeploymentCardProps) {
  const config = statusConfig[deployment.status]
  const StatusIcon = config.icon
  const timeAgo = formatTimeAgo(deployment.timestamp)

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${config.borderColor} hover:border-slate-600 transition-colors`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold">{deployment.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} flex items-center space-x-1`}>
              <StatusIcon className={`w-3 h-3 ${deployment.status === 'in_progress' ? 'animate-spin' : ''}`} />
              <span>{config.label}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <GitBranch className="w-4 h-4" />
              <span>{deployment.branch}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitCommit className="w-4 h-4" />
              <span className="font-mono">{deployment.commit}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{deployment.duration}</span>
            </div>
          </div>
        </div>
        <div className="text-right text-slate-400 text-sm">
          <div className="mb-1">{timeAgo}</div>
          <div className="px-2 py-1 bg-slate-700/50 rounded text-xs font-medium">
            {deployment.environment}
          </div>
        </div>
      </div>

      {deployment.status === 'in_progress' && (
        <div className="mt-4">
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
