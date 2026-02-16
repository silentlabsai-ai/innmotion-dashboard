import { NextResponse } from 'next/server'

// Mock dashboard data - will replace with Google Sheets integration
export async function GET() {
  try {
    const mockData = {
      leads: {
        new: 12,
        qualified: 8,
        contacted: 15,
        converted: 7
      },
      activeProjects: 23,
      pipelineValue: 47300,
      totalLeads: 42,
      conversionRate: 16.7,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}