import { NextResponse } from 'next/server'

// Mock leads data - will replace with Google Sheets integration
export async function GET() {
  try {
    const mockLeads = [
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
      }
    ]

    return NextResponse.json(mockLeads)
  } catch (error) {
    console.error('Leads API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // TODO: Add to Google Sheets
    console.log('Adding new lead:', body)
    
    const newLead = {
      id: `LM-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...body,
      dateAdded: new Date().toLocaleDateString(),
      status: 'NEW'
    }

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error('Create lead API error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}