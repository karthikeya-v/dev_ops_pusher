import { useState } from 'react'
import { Edit2, Trash2, Save, X, AlertCircle, CheckCircle, Tag, Clock } from 'lucide-react'
import type { WorkItem } from '@/app/page'

interface WorkItemCardProps {
  workItem: WorkItem
  onRemove: () => void
  onEdit: (updated: WorkItem) => void
}

const typeColors = {
  'User Story': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Task': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Bug': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Feature': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Epic': 'bg-orange-500/10 text-orange-400 border-orange-500/20'
}

const priorityColors = {
  'Critical': 'bg-red-500/20 text-red-300',
  'High': 'bg-orange-500/20 text-orange-300',
  'Medium': 'bg-yellow-500/20 text-yellow-300',
  'Low': 'bg-green-500/20 text-green-300'
}

export default function WorkItemCard({ workItem, onRemove, onEdit }: WorkItemCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState<WorkItem>(workItem)

  const handleSave = () => {
    onEdit(editedItem)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedItem(workItem)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              type="text"
              value={editedItem.title}
              onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={editedItem.type}
                onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value as WorkItem['type'] })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="User Story">User Story</option>
                <option value="Task">Task</option>
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
                <option value="Epic">Epic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
              <select
                value={editedItem.priority}
                onChange={(e) => setEditedItem({ ...editedItem, priority: e.target.value as WorkItem['priority'] })}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${typeColors[workItem.type]} hover:border-slate-500 transition-colors`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{workItem.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[workItem.type]}`}>
              {workItem.type}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[workItem.priority]}`}>
              {workItem.priority}
            </span>
          </div>
          <p className="text-slate-300 text-sm mb-3">{workItem.description}</p>

          {workItem.acceptanceCriteria && workItem.acceptanceCriteria.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-slate-400">Acceptance Criteria:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 ml-6">
                {workItem.acceptanceCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-sm">
            {workItem.tags && workItem.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4 text-blue-400" />
                {workItem.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {workItem.estimatedHours && (
              <div className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{workItem.estimatedHours}h</span>
              </div>
            )}
            {workItem.assignedTo && (
              <div className="flex items-center space-x-1 text-slate-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">{workItem.assignedTo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
