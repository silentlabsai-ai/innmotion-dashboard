'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: string
  clientName: string
  trade: string
  status: 'active' | 'paused' | 'completed' | 'on-hold'
  dueDate: string
  value: number
  stages: {
    website: 'pending' | 'in-progress' | 'completed'
    seo: 'pending' | 'in-progress' | 'completed' 
    chatbot: 'pending' | 'in-progress' | 'completed'
    deployment: 'pending' | 'in-progress' | 'completed'
  }
  assignedBots: string[]
  progress: number
  notes: string
}

const StageIndicator = ({ stage, status }: {
  stage: string
  status: 'pending' | 'in-progress' | 'completed'
}) => {
  const colors = {
    pending: 'bg-gray-500',
    'in-progress': 'bg-yellow-500',
    completed: 'bg-green-500'
  }

  const icons = {
    pending: '○',
    'in-progress': '◐',
    completed: '●'
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className={`w-8 h-8 rounded-full ${colors[status]} flex items-center justify-center text-white text-xs font-bold`}>
        {icons[status]}
      </div>
      <span className="text-xs text-gray-400 text-center">{stage}</span>
    </div>
  )
}

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-background rounded-full h-2">
    <div 
      className="bg-primary h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
)

const ProjectCard = ({ project }: { project: Project }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'border-l-green-500'
      case 'paused': return 'border-l-yellow-500'
      case 'completed': return 'border-l-blue-500'
      case 'on-hold': return 'border-l-red-500'
      default: return 'border-l-gray-500'
    }
  }

  const formatValue = (value: number) => {
    return value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `Due in ${diffDays} days`
  }

  return (
    <div className={`bg-surface border border-border ${getStatusColor(project.status)} border-l-4 rounded-lg p-6`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{project.clientName}</h3>
          <p className="text-sm text-gray-400">{project.trade}</p>
          <p className="text-xs text-gray-500">Project ID: {project.id}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{formatValue(project.value)}</div>
          <div className="text-xs text-gray-400">{formatDate(project.dueDate)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm font-medium text-white">{project.progress}%</span>
        </div>
        <ProgressBar progress={project.progress} />
      </div>

      {/* Stages Pipeline */}
      <div className="mb-4">
        <div className="flex justify-between items-center space-x-2">
          <StageIndicator stage="Website" status={project.stages.website} />
          <div className="flex-1 h-px bg-border"></div>
          <StageIndicator stage="SEO" status={project.stages.seo} />
          <div className="flex-1 h-px bg-border"></div>
          <StageIndicator stage="Chatbot" status={project.stages.chatbot} />
          <div className="flex-1 h-px bg-border"></div>
          <StageIndicator stage="Deploy" status={project.stages.deployment} />
        </div>
      </div>

      {/* Assigned Bots */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Assigned Bots</div>
        <div className="flex space-x-2">
          {project.assignedBots.map(bot => (
            <span key={bot} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
              {bot}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      {project.notes && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Notes</div>
          <p className="text-sm text-gray-300">{project.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-white hover:bg-border/20 transition-colors">
          View Details
        </button>
        <button className="px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary/80 transition-colors">
          Update
        </button>
        <button className="px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors">
          Pause
        </button>
      </div>
    </div>
  )
}

export default function ProjectPipeline() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('active')

  // Mock project data
  const mockProjects: Project[] = [
    {
      id: 'PRJ-001',
      clientName: 'Sydney Plumbing Co',
      trade: 'Plumber',
      status: 'active',
      dueDate: '2026-02-20',
      value: 2500,
      stages: {
        website: 'in-progress',
        seo: 'pending',
        chatbot: 'pending',
        deployment: 'pending'
      },
      assignedBots: ['IVY'],
      progress: 35,
      notes: 'Rush job - client needs website live by end of week'
    },
    {
      id: 'PRJ-002', 
      clientName: 'Elite Kitchens',
      trade: 'Kitchen Renovation',
      status: 'active',
      dueDate: '2026-02-25',
      value: 3200,
      stages: {
        website: 'completed',
        seo: 'in-progress',
        chatbot: 'pending',
        deployment: 'pending'
      },
      assignedBots: ['SAGE', 'RIVER'],
      progress: 60,
      notes: 'High-end client, needs premium design elements'
    },
    {
      id: 'PRJ-003',
      clientName: 'Pro Electricians',
      trade: 'Electrician', 
      status: 'paused',
      dueDate: '2026-02-18',
      value: 1800,
      stages: {
        website: 'completed',
        seo: 'completed',
        chatbot: 'completed',
        deployment: 'in-progress'
      },
      assignedBots: ['PARKER'],
      progress: 85,
      notes: 'DNS configuration issues - waiting for client'
    },
    {
      id: 'PRJ-004',
      clientName: 'Master Builders',
      trade: 'Builder',
      status: 'completed',
      dueDate: '2026-02-10',
      value: 4500,
      stages: {
        website: 'completed',
        seo: 'completed', 
        chatbot: 'completed',
        deployment: 'completed'
      },
      assignedBots: [],
      progress: 100,
      notes: 'Successfully delivered ahead of schedule'
    },
    {
      id: 'PRJ-005',
      clientName: 'Quick Fix Plumbing',
      trade: 'Plumber',
      status: 'active',
      dueDate: '2026-03-01',
      value: 2200,
      stages: {
        website: 'pending',
        seo: 'pending',
        chatbot: 'pending', 
        deployment: 'pending'
      },
      assignedBots: ['MAX'],
      progress: 5,
      notes: 'Just started - gathering requirements'
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setProjects(mockProjects)
      setLoading(false)
    }, 800)
  }, [])

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  )

  const getProjectStats = () => {
    const totalValue = projects.reduce((sum, p) => sum + p.value, 0)
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length

    return { totalValue, activeProjects, completedProjects, avgProgress }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading project pipeline...</div>
      </div>
    )
  }

  const stats = getProjectStats()

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Active Projects</h1>
          <div className="flex space-x-6 text-sm text-gray-400">
            <span>{stats.activeProjects} active</span>
            <span>{stats.completedProjects} completed</span>
            <span>${stats.totalValue.toLocaleString()} total value</span>
          </div>
        </div>
        <div className="flex space-x-2">
          {['all', 'active', 'paused', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface text-gray-400 hover:text-white border border-border'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-primary">{projects.length}</div>
          <div className="text-sm text-gray-400">Total Projects</div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-green-400">${stats.totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Value</div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.avgProgress.toFixed(0)}%</div>
          <div className="text-sm text-gray-400">Avg Progress</div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats.completedProjects > 0 ? Math.round((stats.completedProjects / projects.length) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-400">Completion Rate</div>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No projects found</div>
          <div className="text-sm text-gray-500">
            {filter === 'all' ? 'No projects in the system' : `No ${filter} projects`}
          </div>
        </div>
      )}
    </div>
  )
}