'use client'

import { useState, useEffect } from 'react'

interface BotStatus {
  id: string
  name: string
  status: 'active' | 'idle' | 'error' | 'offline'
  currentTask: string
  tasksCompleted: number
  avgTaskTime: number
  lastActivity: Date
  uptime: string
}

const StatusIndicator = ({ status }: { status: BotStatus['status'] }) => {
  const colors = {
    active: 'bg-green-500 animate-pulse',
    idle: 'bg-yellow-500',
    error: 'bg-red-500 animate-pulse',
    offline: 'bg-gray-500'
  }

  const labels = {
    active: 'Active',
    idle: 'Idle', 
    error: 'Error',
    offline: 'Offline'
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
      <span className="text-sm font-medium">{labels[status]}</span>
    </div>
  )
}

const BotCard = ({ bot }: { bot: BotStatus }) => {
  const getBorderColor = (status: BotStatus['status']) => {
    switch (status) {
      case 'active': return 'border-l-green-500'
      case 'idle': return 'border-l-yellow-500'
      case 'error': return 'border-l-red-500'
      case 'offline': return 'border-l-gray-500'
      default: return 'border-l-gray-500'
    }
  }

  const formatLastActivity = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className={`bg-surface border border-border ${getBorderColor(bot.status)} border-l-4 rounded-lg p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
          <p className="text-sm text-gray-400">{bot.id}</p>
        </div>
        <StatusIndicator status={bot.status} />
      </div>

      {/* Current Task */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-1">Current Task</h4>
        <p className="text-sm text-white">{bot.currentTask}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xl font-bold text-primary">{bot.tasksCompleted}</div>
          <div className="text-xs text-gray-400">Tasks Completed</div>
        </div>
        <div>
          <div className="text-xl font-bold text-secondary">{bot.avgTaskTime}m</div>
          <div className="text-xs text-gray-400">Avg Task Time</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Last activity: {formatLastActivity(bot.lastActivity)}</span>
        <span>Uptime: {bot.uptime}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <button className="flex-1 bg-background border border-border rounded px-3 py-2 text-xs text-white hover:bg-border/20 transition-colors">
          View Details
        </button>
        <button className="px-3 py-2 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors">
          Pause
        </button>
      </div>
    </div>
  )
}

export default function BotStatusGrid() {
  const [bots, setBots] = useState<BotStatus[]>([])
  const [loading, setLoading] = useState(true)

  // Mock bot data - in production this would come from bot monitoring API
  const mockBots: BotStatus[] = [
    {
      id: 'MAX',
      name: 'Max (Lead Generation Bot)',
      status: 'active',
      currentTask: 'Scraping Google Maps for Sydney electricians - 23% complete',
      tasksCompleted: 47,
      avgTaskTime: 12,
      lastActivity: new Date(),
      uptime: '2d 14h'
    },
    {
      id: 'IVY', 
      name: 'Ivy (Website Builder Bot)',
      status: 'active',
      currentTask: 'Building responsive website for Sydney Plumbing Co',
      tasksCompleted: 23,
      avgTaskTime: 45,
      lastActivity: new Date(Date.now() - 5 * 60000), // 5 min ago
      uptime: '2d 14h'
    },
    {
      id: 'SAGE',
      name: 'Sage (SEO Optimization Bot)',
      status: 'idle',
      currentTask: 'Waiting for website completion from Ivy',
      tasksCompleted: 31,
      avgTaskTime: 25,
      lastActivity: new Date(Date.now() - 15 * 60000), // 15 min ago
      uptime: '2d 12h'
    },
    {
      id: 'RIVER',
      name: 'River (Chatbot Builder Bot)',
      status: 'active',
      currentTask: 'Configuring AI chatbot for Elite Kitchens website',
      tasksCompleted: 19,
      avgTaskTime: 20,
      lastActivity: new Date(Date.now() - 2 * 60000), // 2 min ago
      uptime: '1d 8h'
    },
    {
      id: 'PARKER',
      name: 'Parker (Integration Bot)',
      status: 'error',
      currentTask: 'Failed to deploy Pro Electricians - DNS configuration error',
      tasksCompleted: 12,
      avgTaskTime: 35,
      lastActivity: new Date(Date.now() - 1 * 60000), // 1 min ago
      uptime: '2d 14h'
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setBots(mockBots)
      setLoading(false)
    }, 1000)

    // Set up real-time updates (mock)
    const interval = setInterval(() => {
      setBots(prev => prev.map(bot => ({
        ...bot,
        lastActivity: bot.status === 'active' ? new Date() : bot.lastActivity
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading bot status...</div>
      </div>
    )
  }

  const activeBots = bots.filter(bot => bot.status === 'active').length
  const totalTasks = bots.reduce((sum, bot) => sum + bot.tasksCompleted, 0)
  const avgUptime = '2d 13h' // Mock calculated average

  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Bot Control Center</h1>
          <div className="flex space-x-6 text-sm text-gray-400">
            <span>{activeBots}/{bots.length} bots active</span>
            <span>{totalTasks} total tasks completed</span>
            <span>Avg uptime: {avgUptime}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Start All
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Emergency Stop
          </button>
        </div>
      </div>

      {/* Bot Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {bots.map(bot => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>

      {/* System Health Dashboard */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">98.2%</div>
            <div className="text-sm text-gray-400">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{totalTasks}</div>
            <div className="text-sm text-gray-400">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(totalTasks / bots.length)}
            </div>
            <div className="text-sm text-gray-400">Avg Tasks/Bot</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">24m</div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { bot: 'MAX', action: 'Completed lead qualification for 5 prospects', time: '2m ago' },
            { bot: 'IVY', action: 'Website build progress: 78% complete', time: '5m ago' },
            { bot: 'PARKER', action: 'ERROR: DNS configuration failed', time: '8m ago', error: true },
            { bot: 'RIVER', action: 'Chatbot configured with 15 conversation flows', time: '12m ago' },
            { bot: 'SAGE', action: 'SEO audit completed for 3 websites', time: '18m ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary">{activity.bot}</span>
                <span className={`text-sm ${activity.error ? 'text-red-400' : 'text-gray-300'}`}>
                  {activity.action}
                </span>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}