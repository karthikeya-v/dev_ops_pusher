'use client'

import { useState, useEffect } from 'react'
import {
  GitBranch,
  GitCommit,
  Rocket,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Globe,
  Terminal,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import DeploymentCard from '@/components/DeploymentCard'
import QuickAction from '@/components/QuickAction'
import EnvironmentStatus from '@/components/EnvironmentStatus'
import RepoStats from '@/components/RepoStats'

export default function Home() {
  const [deployments, setDeployments] = useState([
    {
      id: 1,
      name: 'Production Deploy',
      status: 'success' as const,
      branch: 'main',
      commit: 'a1b2c3d',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      duration: '2m 34s',
      environment: 'production'
    },
    {
      id: 2,
      name: 'Staging Deploy',
      status: 'in_progress' as const,
      branch: 'develop',
      commit: 'e4f5g6h',
      timestamp: new Date().toISOString(),
      duration: '1m 12s',
      environment: 'staging'
    },
    {
      id: 3,
      name: 'Feature Branch',
      status: 'failed' as const,
      branch: 'feature/new-ui',
      commit: 'i7j8k9l',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      duration: '45s',
      environment: 'preview'
    },
  ])

  const [stats, setStats] = useState({
    totalDeployments: 127,
    successRate: 94.5,
    avgDeployTime: '2m 15s',
    activeEnvironments: 3
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                <Rocket className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  DevOps Pusher
                </h1>
                <p className="text-slate-400 text-sm">Deployment Dashboard</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Deployments</p>
                <p className="text-3xl font-bold">{stats.totalDeployments}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-green-400">{stats.successRate}%</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Avg Deploy Time</p>
                <p className="text-3xl font-bold text-purple-400">{stats.avgDeployTime}</p>
              </div>
              <Clock className="w-10 h-10 text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Active Environments</p>
                <p className="text-3xl font-bold text-orange-400">{stats.activeEnvironments}</p>
              </div>
              <Server className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Terminal className="w-6 h-6 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction
              icon={<Rocket className="w-5 h-5" />}
              title="Deploy to Production"
              description="Push latest changes to production"
              color="blue"
            />
            <QuickAction
              icon={<GitBranch className="w-5 h-5" />}
              title="Create Preview"
              description="Deploy a preview environment"
              color="purple"
            />
            <QuickAction
              icon={<RefreshCw className="w-5 h-5" />}
              title="Rollback"
              description="Revert to previous deployment"
              color="orange"
            />
          </div>
        </div>

        {/* Environment Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            Environment Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnvironmentStatus
              name="Production"
              status="healthy"
              version="v1.2.5"
              url="app.example.com"
              uptime="99.98%"
            />
            <EnvironmentStatus
              name="Staging"
              status="deploying"
              version="v1.3.0-beta"
              url="staging.example.com"
              uptime="99.95%"
            />
            <EnvironmentStatus
              name="Preview"
              status="error"
              version="v1.3.0-rc"
              url="preview.example.com"
              uptime="98.50%"
            />
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2" />
            Recent Deployments
          </h2>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <DeploymentCard key={deployment.id} deployment={deployment} />
            ))}
          </div>
        </div>

        {/* Repository Stats */}
        <RepoStats />
      </div>
    </main>
  )
}
