import { GitBranch, GitCommit, Users, Star } from 'lucide-react'

export default function RepoStats() {
  const stats = [
    { icon: GitBranch, label: 'Active Branches', value: '12', color: 'text-blue-400' },
    { icon: GitCommit, label: 'Commits This Week', value: '47', color: 'text-purple-400' },
    { icon: Users, label: 'Contributors', value: '8', color: 'text-green-400' },
    { icon: Star, label: 'Pull Requests', value: '5', color: 'text-yellow-400' },
  ]

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-6">Repository Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
