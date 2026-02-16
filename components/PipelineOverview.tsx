'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts'
import { 
  TrendingUp, Users, DollarSign, Target, 
  Activity, Zap, Eye, RefreshCw 
} from 'lucide-react'

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

const EliteMetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  gradient,
  delay = 0 
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  trend?: number
  gradient: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ 
      scale: 1.02, 
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)" 
    }}
    className={`relative overflow-hidden rounded-2xl p-6 ${gradient} backdrop-blur-lg border border-white/10`}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-white/70 text-sm font-medium">{title}</p>
        <motion.p 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="text-3xl font-bold text-white"
        >
          {value}
        </motion.p>
        {subtitle && (
          <p className="text-white/60 text-sm">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">+{trend}%</span>
          </div>
        )}
      </div>
      <motion.div
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        className="p-3 bg-white/10 rounded-xl"
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
    </div>
    
    {/* Animated background elements */}
    <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
    <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-white/5 rounded-full blur-lg"></div>
  </motion.div>
)

const PipelineChart = ({ data }: { data: any[] }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
  >
    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
      Pipeline Flow
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="stage" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '12px',
            color: '#F9FAFB'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="#3B82F6" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#pipelineGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </motion.div>
)

const LeadStatusPie = ({ data }: { data: any[] }) => {
  const COLORS = ['#6B7280', '#3B82F6', '#F59E0B', '#10B981']
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <Target className="w-5 h-5 mr-2 text-green-400" />
        Lead Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#F9FAFB'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <span className="text-white/70 text-sm">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const BotStatusCard = ({ bot, index }: {
  bot: {
    id: string
    name: string
    status: 'active' | 'idle' | 'error'
    currentTask: string
    tasksCompleted: number
  }
  index: number
}) => {
  const statusConfig = {
    active: { color: 'from-green-500 to-emerald-600', dot: 'bg-green-400', pulse: true },
    idle: { color: 'from-yellow-500 to-orange-600', dot: 'bg-yellow-400', pulse: false },
    error: { color: 'from-red-500 to-pink-600', dot: 'bg-red-400', pulse: true }
  }

  const config = statusConfig[bot.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-gradient-to-br ${config.color} backdrop-blur-lg rounded-2xl p-6 border border-white/20 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-white text-lg">{bot.name}</h4>
        <div className="flex items-center">
          <motion.div
            animate={config.pulse ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${config.dot} mr-2`}
          />
          <Activity className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <p className="text-white/90 text-sm mb-4 leading-relaxed">{bot.currentTask}</p>
      
      <div className="flex items-center justify-between">
        <div className="text-white/80 text-sm">
          <span className="font-semibold">{bot.tasksCompleted}</span> tasks completed
        </div>
        <Zap className="w-4 h-4 text-white/60" />
      </div>

      {/* Animated background elements */}
      <div className="absolute -top-5 -right-5 w-10 h-10 bg-white/10 rounded-full blur-lg"></div>
      <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-white/5 rounded-full blur-md"></div>
    </motion.div>
  )
}

export default function ElitePipelineOverview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mockBots = [
    {
      id: 'MAX',
      name: 'Max (Lead Gen)',
      status: 'active' as const,
      currentTask: 'Processing leads from Google Sheets with AI qualification',
      tasksCompleted: 47
    },
    {
      id: 'IVY',
      name: 'Ivy (Website)',
      status: 'active' as const, 
      currentTask: 'Building responsive website for Sydney Plumbing Co',
      tasksCompleted: 23
    },
    {
      id: 'SAGE',
      name: 'Sage (SEO)',
      status: 'idle' as const,
      currentTask: 'Awaiting website completion for SEO optimization',
      tasksCompleted: 31
    },
    {
      id: 'RIVER',
      name: 'River (Chatbot)',
      status: 'active' as const,
      currentTask: 'Configuring AI chatbot for Elite Kitchens website',
      tasksCompleted: 19
    },
    {
      id: 'PARKER',
      name: 'Parker (Integration)',
      status: 'error' as const,
      currentTask: 'DNS configuration error - Pro Electricians deployment',
      tasksCompleted: 12
    }
  ]

  useEffect(() => {
    fetchData()
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full"
        />
        <p className="text-white ml-4 text-lg">Loading elite dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-900/30 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-center max-w-md"
        >
          <h3 className="text-red-400 font-bold text-xl mb-4">Connection Error</h3>
          <p className="text-white/80 mb-6">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (!data) return null

  const pipelineChartData = [
    { stage: 'New', count: data.leads.new },
    { stage: 'Qualified', count: data.leads.qualified },
    { stage: 'Contacted', count: data.leads.contacted },
    { stage: 'Converted', count: data.leads.converted }
  ]

  const pieData = [
    { name: 'New', value: data.leads.new },
    { name: 'Qualified', value: data.leads.qualified },
    { name: 'Contacted', value: data.leads.contacted },
    { name: 'Converted', value: data.leads.converted }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-400 rounded-full"
            />
            <span className="text-green-400 font-bold">Live Data Connected</span>
            <Eye className="w-4 h-4 text-green-400" />
            <span className="text-white/70 text-sm">
              Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EliteMetricCard
          title="Active Leads"
          value={data.totalLeads}
          subtitle="From Google Sheets"
          icon={Users}
          trend={12}
          gradient="bg-gradient-to-br from-blue-600/90 to-blue-800/90"
          delay={0}
        />
        <EliteMetricCard
          title="Projects in Progress" 
          value={data.activeProjects}
          subtitle="Being worked on"
          icon={Activity}
          trend={8}
          gradient="bg-gradient-to-br from-purple-600/90 to-purple-800/90"
          delay={0.1}
        />
        <EliteMetricCard
          title="Pipeline Value"
          value={`$${data.pipelineValue.toLocaleString()}`}
          subtitle="Potential revenue"
          icon={DollarSign}
          trend={15}
          gradient="bg-gradient-to-br from-emerald-600/90 to-emerald-800/90"
          delay={0.2}
        />
        <EliteMetricCard
          title="Conversion Rate"
          value={`${data.conversionRate.toFixed(1)}%`}
          subtitle="Leads to customers"
          icon={Target}
          trend={5}
          gradient="bg-gradient-to-br from-orange-600/90 to-orange-800/90"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PipelineChart data={pipelineChartData} />
        <LeadStatusPie data={pieData} />
      </div>

      {/* Bot Status Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-8 h-8 mr-3 text-yellow-400" />
          AI Bot Network
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {mockBots.map((bot, index) => (
            <BotStatusCard key={bot.id} bot={bot} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Recent Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Users className="w-6 h-6 mr-3 text-blue-400" />
          Recent Leads
        </h2>
        <div className="space-y-3">
          {leads.slice(0, 5).map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 10 }}
              className="flex items-center justify-between py-4 px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{lead.businessName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{lead.businessName}</p>
                  <p className="text-white/60 text-sm">{lead.trade} • {lead.location}</p>
                </div>
              </div>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  lead.status === 'NEW' ? 'bg-gray-600 text-white' :
                  lead.status === 'QUALIFIED' ? 'bg-blue-600 text-white' :
                  lead.status === 'CONTACTED' ? 'bg-yellow-600 text-white' :
                  'bg-green-600 text-white'
                }`}
              >
                {lead.status}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}