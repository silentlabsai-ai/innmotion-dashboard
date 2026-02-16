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

interface Lead {
  id: string
  businessName: string
  trade: string
  location: string
  phone: string
  email: string
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'CONVERTED'
  source: string
  dateAdded: string
  notes: string
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
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mockBots = [
    {
      id: 'MAX',
      name: 'Max (Lead Gen)',
      status: 'active' as const,
      currentTask: 'Processing leads from Google Sheets',
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
    fetchData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/sheets')
      const result = await response.json()
      
      if (result.success) {
        setData(result.overview)
        setLeads(result.leads)
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError('Network error: Unable to fetch data')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading live data from Google Sheets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <h3 className="text-red-400 font-semibold mb-2">Connection Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-semibold">Live Data Connected</span>
          <span className="text-gray-400 text-sm">
            • Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Leads"
          value={data.totalLeads}
          subtitle="From Google Sheets"
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
        <h2 className="text-xl font-bold text-white mb-6">🎯 Live Leads Pipeline</h2>
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

      {/* Recent Leads Preview */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-white mb-6">📋 Recent Leads</h2>
        <div className="space-y-3">
          {leads.slice(0, 5).map((lead, index) => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary">#{lead.id}</span>
                <span className="text-sm text-white">{lead.businessName}</span>
                <span className="text-sm text-gray-400">{lead.trade}</span>
                <span className="text-sm text-gray-500">{lead.location}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                lead.status === 'NEW' ? 'bg-gray-600 text-white' :
                lead.status === 'QUALIFIED' ? 'bg-blue-600 text-white' :
                lead.status === 'CONTACTED' ? 'bg-yellow-600 text-white' :
                'bg-green-600 text-white'
              }`}>
                {lead.status}
              </span>
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