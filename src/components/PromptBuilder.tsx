import { BookOpen, ShoppingCart, Code, Bug, Rocket, Zap } from 'lucide-react'

interface PromptBuilderProps {
  onGenerate: (prompt: string) => void
}

const templates = [
  {
    icon: ShoppingCart,
    title: 'E-Commerce',
    description: 'Shopping & Payment Flow',
    prompt: 'Create 5 user stories for an e-commerce checkout flow including cart management, payment processing, order confirmation, and email notifications. Include acceptance criteria for each story.'
  },
  {
    icon: Code,
    title: 'API Development',
    description: 'REST API Endpoints',
    prompt: 'Generate 6 tasks for building a RESTful API with CRUD operations, including authentication, error handling, rate limiting, and API documentation. Add estimated hours for each task.'
  },
  {
    icon: Bug,
    title: 'Bug Fixes',
    description: 'Common Issues',
    prompt: 'Create 4 bug work items for fixing critical issues in a web application, including login failures, data validation errors, performance issues, and UI responsiveness problems.'
  },
  {
    icon: Rocket,
    title: 'MVP Features',
    description: 'Product Launch',
    prompt: 'Generate an epic with 8 user stories for an MVP product launch, including user authentication, dashboard, data visualization, user settings, and reporting features.'
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Technical Docs',
    prompt: 'Create 5 tasks for comprehensive technical documentation including API docs, setup guides, architecture diagrams, user manual, and troubleshooting guide.'
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimization Tasks',
    prompt: 'Generate 6 tasks for improving application performance including database query optimization, caching implementation, code splitting, image optimization, and load testing.'
  }
]

export default function PromptBuilder({ onGenerate }: PromptBuilderProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold mb-4">Quick Templates</h2>
      <p className="text-slate-400 text-sm mb-6">
        Choose a template to quickly generate work items for common scenarios
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => {
          const Icon = template.icon
          return (
            <button
              key={index}
              onClick={() => onGenerate(template.prompt)}
              className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-700 hover:border-blue-500/50 rounded-lg p-4 text-left transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{template.title}</h3>
                  <p className="text-xs text-slate-400">{template.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
