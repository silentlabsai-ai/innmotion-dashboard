'use client'

import { useState, useEffect } from 'react'

interface OverviewData {
  leads: {
    new: number
    qualified: number
    contacted: number
    converted: number
  }
  activeProjects: number
  pipelineValue: number
  totalLeads: number
  conversionRate: number
  lastUpdated: string
}

const MetricCard = ({ title, value, subtitle, color = 'primary' }: {
  title: string
  value: string | number
  subtitle?: string
  color?: string
}) => (
  <div className="bg-surface rounded-lg p-6 border border-border">
    <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
    <div className={`text-2xl font-bold text-${color} mb-1`}>{value}</div>
    {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
  </div>
)

const BotStatusCard = ({ bot }: {
  bot: {
    id: string
    name: string
    status: 'active' | 'idle' | 'error'
    currentTask: string
    tasksCompleted: number
  }
}) => {
  const statusColor = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500', 
    error: 'bg-red-500'
  }[bot.status]

  return (
    <div className="bg-surface rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-white">{bot.name}</h4>
        <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
      </div>
      <p className="text-sm text-gray-400 mb-2">{bot.currentTask}</p>
      <div className="text-xs text-gray-500">
        {bot.tasksCompleted} tasks completed
      </div>
    </div>
  )
}

export default function PipelineOverview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for now - will connect to Google Sheets API
  const mockData: OverviewData = {
    leads: { new: 12, qualified: 8, contacted: 15, converted: 7 },
    activeProjects: 23,
    pipelineValue: 47300,
    totalLeads: 42,
    conversionRate: 16.7,
    lastUpdated: new Date().toISOString()
  }

  const mockBots = [
    {
      id: 'MAX',
      name: 'Max (Lead Gen)',
      status: 'active' as const,
      currentTask: 'Qualifying 5 new leads from Google Maps',
      tasksCompleted: 47
    },
    {
      id: 'IVY',
      name: 'Ivy (Website)',
      status: 'active' as const, 
      currentTask: 'Building website for Sydney Plumbing Co',
      tasksCompleted: 23
    },
    {
      id: 'SAGE',
      name: 'Sage (SEO)',
      status: 'idle' as const,
      currentTask: 'Awaiting website completion',
      tasksCompleted: 31
    },
    {
      id: 'RIVER',
      name: 'River (Chatbot)',
      status: 'active' as const,
      currentTask: 'Configuring chatbot for Elite Kitchens',
      tasksCompleted: 19
    },
    {
      id: 'PARKER',
      name: 'Parker (Integration)',
      status: 'active' as const,
      currentTask: 'Deploying Pro Electricians website',
      tasksCompleted: 12
    }
  ]

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading pipeline overview...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Leads"
          value={data.totalLeads}
          subtitle="Total in pipeline"
          color="primary"
        />
        <MetricCard
          title="Projects in Progress" 
          value={data.activeProjects}
          subtitle="Being worked on"
          color="secondary"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${data.pipelineValue.toLocaleString()}`}
          subtitle="Potential revenue"
          color="accent"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate.toFixed(1)}%`}
          subtitle="Leads to customers"
          color="primary"
        />
      </div>

      {/* Leads Pipeline */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-white mb-6">🎯 Leads Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'NEW', count: data.leads.new, color: 'bg-gray-600' },
            { label: 'QUALIFIED', count: data.leads.qualified, color: 'bg-blue-600' },
            { label: 'CONTACTED', count: data.leads.contacted, color: 'bg-yellow-600' },
            { label: 'CONVERTED', count: data.leads.converted, color: 'bg-green-600' }
          ].map((stage) => (
            <div key={stage.label} className="text-center">
              <div className={`${stage.color} rounded-lg p-4 mb-2`}>
                <div className="text-2xl font-bold text-white">{stage.count}</div>
              </div>
              <div className="text-sm text-gray-400">{stage.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bot Status */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-white mb-6">🤖 Bot Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockBots.map((bot) => (
            <BotStatusCard key={bot.id} bot={bot} />
          ))}
        </div>
      </div>
    </div>
  )
}