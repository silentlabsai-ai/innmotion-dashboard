'use client'

import { useState, useEffect } from 'react'
import PipelineOverview from '../components/PipelineOverview'
import LeadKanbanBoard from '../components/LeadKanbanBoard'
import BotStatusGrid from '../components/BotStatusGrid'
import ProjectPipeline from '../components/ProjectPipeline'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              InnMotion Pipeline Control
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">F</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-surface border-b border-border px-6">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'leads', label: 'Leads Pipeline' },
            { id: 'projects', label: 'Active Projects' },
            { id: 'bots', label: 'Bot Status' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && <PipelineOverview />}
        {activeTab === 'leads' && <LeadKanbanBoard />}
        {activeTab === 'projects' && <ProjectPipeline />}
        {activeTab === 'bots' && <BotStatusGrid />}
      </main>
    </div>
  )
}