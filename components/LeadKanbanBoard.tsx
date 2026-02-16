'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  businessName: string
  trade: string
  location: string
  phone: string
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'CONVERTED'
  dateAdded: string
  notes: string
}

const LeadCard = ({ lead, onStatusChange }: {
  lead: Lead
  onStatusChange: (leadId: string, newStatus: Lead['status']) => void
}) => {
  const statusColors = {
    NEW: 'border-l-gray-500',
    QUALIFIED: 'border-l-blue-500',
    CONTACTED: 'border-l-yellow-500',
    CONVERTED: 'border-l-green-500'
  }

  return (
    <div className={`bg-background p-4 rounded-lg border border-border ${statusColors[lead.status]} border-l-4 mb-3 cursor-move hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-white text-sm">{lead.businessName}</h4>
        <span className="text-xs text-gray-400">{lead.dateAdded}</span>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-gray-300">{lead.trade}</p>
        <p className="text-sm text-gray-400">{lead.location}</p>
        {lead.phone && (
          <p className="text-sm text-blue-400">{lead.phone}</p>
        )}
      </div>

      {lead.notes && (
        <p className="text-xs text-gray-500 mt-2 italic">{lead.notes}</p>
      )}

      {/* Quick action buttons */}
      <div className="flex space-x-2 mt-3">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
          className="bg-surface border border-border rounded px-2 py-1 text-xs text-white"
        >
          <option value="NEW">NEW</option>
          <option value="QUALIFIED">QUALIFIED</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CONVERTED">CONVERTED</option>
        </select>
      </div>
    </div>
  )
}

const KanbanColumn = ({ title, status, leads, count, onStatusChange }: {
  title: string
  status: Lead['status']
  leads: Lead[]
  count: number
  onStatusChange: (leadId: string, newStatus: Lead['status']) => void
}) => {
  const columnColors = {
    NEW: 'bg-gray-600',
    QUALIFIED: 'bg-blue-600', 
    CONTACTED: 'bg-yellow-600',
    CONVERTED: 'bg-green-600'
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4 min-h-96">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className={`${columnColors[status]} text-white text-xs px-2 py-1 rounded-full`}>
          {count}
        </span>
      </div>

      {/* Lead Cards */}
      <div className="space-y-3">
        {leads
          .filter(lead => lead.status === status)
          .map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={onStatusChange}
            />
          ))}
      </div>

      {/* Add Lead Button */}
      {status === 'NEW' && (
        <button className="w-full mt-4 p-3 border-2 border-dashed border-border rounded-lg text-gray-400 hover:text-white hover:border-primary transition-colors">
          + Add New Lead
        </button>
      )}
    </div>
  )
}

export default function LeadKanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  // Mock leads data - will connect to Google Sheets
  const mockLeads: Lead[] = [
    {
      id: 'LM-001',
      businessName: 'Sydney Plumbing Co',
      trade: 'Plumber',
      location: 'Sydney, NSW',
      phone: '0412 345 678',
      status: 'NEW',
      dateAdded: '2026-02-16',
      notes: 'Hot water system specialists'
    },
    {
      id: 'LM-002',
      businessName: 'Elite Kitchens',
      trade: 'Kitchen Renovation',
      location: 'Melbourne, VIC', 
      phone: '0423 456 789',
      status: 'QUALIFIED',
      dateAdded: '2026-02-15',
      notes: 'High-end custom kitchens'
    },
    {
      id: 'LM-003',
      businessName: 'Pro Electricians',
      trade: 'Electrician',
      location: 'Brisbane, QLD',
      phone: '0434 567 890',
      status: 'CONTACTED',
      dateAdded: '2026-02-14',
      notes: 'Commercial and residential'
    },
    {
      id: 'LM-004',
      businessName: 'Master Builders',
      trade: 'Builder',
      location: 'Perth, WA',
      phone: '0445 678 901',
      status: 'CONVERTED',
      dateAdded: '2026-02-13',
      notes: 'New home construction'
    },
    // Add more mock leads for each status
    {
      id: 'LM-005',
      businessName: 'Quick Fix Plumbing',
      trade: 'Plumber',
      location: 'Adelaide, SA',
      phone: '0456 789 012',
      status: 'NEW',
      dateAdded: '2026-02-16',
      notes: 'Emergency repairs'
    },
    {
      id: 'LM-006',
      businessName: 'Dream Kitchens',
      trade: 'Kitchen Renovation',
      location: 'Gold Coast, QLD',
      phone: '0467 890 123',
      status: 'QUALIFIED',
      dateAdded: '2026-02-15',
      notes: 'Budget-friendly renovations'
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLeads(mockLeads)
      setLoading(false)
    }, 800)
  }, [])

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    // Update local state immediately
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ))

    // TODO: Update Google Sheets via API
    console.log(`Updated lead ${leadId} to status ${newStatus}`)
  }

  const getLeadsByStatus = (status: Lead['status']) => 
    leads.filter(lead => lead.status === status)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading leads pipeline...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Leads Pipeline</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
          + Add New Lead
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KanbanColumn
          title="NEW"
          status="NEW"
          leads={leads}
          count={getLeadsByStatus('NEW').length}
          onStatusChange={handleStatusChange}
        />
        <KanbanColumn
          title="QUALIFIED"
          status="QUALIFIED" 
          leads={leads}
          count={getLeadsByStatus('QUALIFIED').length}
          onStatusChange={handleStatusChange}
        />
        <KanbanColumn
          title="CONTACTED"
          status="CONTACTED"
          leads={leads}
          count={getLeadsByStatus('CONTACTED').length}
          onStatusChange={handleStatusChange}
        />
        <KanbanColumn
          title="CONVERTED"
          status="CONVERTED"
          leads={leads}
          count={getLeadsByStatus('CONVERTED').length}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Summary Stats */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-white mb-4">Pipeline Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{leads.length}</div>
            <div className="text-sm text-gray-400">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{getLeadsByStatus('CONVERTED').length}</div>
            <div className="text-sm text-gray-400">Converted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{getLeadsByStatus('CONTACTED').length}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {leads.length > 0 ? ((getLeadsByStatus('CONVERTED').length / leads.length) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-400">Conversion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}