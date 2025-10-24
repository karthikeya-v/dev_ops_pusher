import { ReactNode } from 'react'

interface QuickActionProps {
  icon: ReactNode
  title: string
  description: string
  color: 'blue' | 'purple' | 'orange' | 'green'
}

const colorConfig = {
  blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
  orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
}

export default function QuickAction({ icon, title, description, color }: QuickActionProps) {
  return (
    <button className={`bg-gradient-to-br ${colorConfig[color]} p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg text-left w-full`}>
      <div className="flex items-start space-x-4">
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
      </div>
    </button>
  )
}
