// Dashboard Google Sheets Service
// Extends our working google-sheets-config.js for web dashboard

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const path = require('path');

class DashboardSheetsService {
    constructor() {
        this.SHEET_ID = '12O-wtCg4Tew-GejLCp3W2yxlxgLt2rDbEqZMUHvUEFE';
        this.CREDENTIALS_PATH = path.join(process.env.HOME, 'Documents/innmotion-bot-credentials.json');
        this.doc = null;
        this.worksheets = {};
        this.lastUpdate = null;
    }

    async initialize() {
        try {
            const credentials = require(this.CREDENTIALS_PATH);
            
            const serviceAccountAuth = new JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: [
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive.file',
                ],
            });
            
            this.doc = new GoogleSpreadsheet(this.SHEET_ID, serviceAccountAuth);
            await this.doc.loadInfo();
            
            // Cache worksheet references
            this.worksheets = {
                leads: this.doc.sheetsByTitle['Lead Gen Tracker'],
                pipeline: this.doc.sheetsByTitle['Pipeline Master'],
                clients: this.doc.sheetsByTitle['Client Detail Input'],
                website: this.doc.sheetsByTitle['Website Bot Input'],
                seo: this.doc.sheetsByTitle['SEO Bot Input'],
                chatbot: this.doc.sheetsByTitle['Chatbot Bot Input'],
                pricing: this.doc.sheetsByTitle['Pricing Reference']
            };
            
            console.log('✅ Dashboard Sheets Service initialized');
            return true;
        } catch (error) {
            console.error('❌ Dashboard Sheets Service failed:', error.message);
            return false;
        }
    }

    // Dashboard-specific methods for real-time UI

    async getDashboardOverview() {
        await this.initialize();
        
        try {
            // Get leads summary
            const leads = await this.worksheets.leads.getRows({ limit: 1000 });
            const leadsByStatus = {
                new: leads.filter(row => row.get('Status') === 'NEW').length,
                qualified: leads.filter(row => row.get('Status') === 'QUALIFIED').length,
                contacted: leads.filter(row => row.get('Status') === 'CONTACTED').length,
                converted: leads.filter(row => row.get('Status') === 'CONVERTED').length
            };

            // Get pipeline projects
            const projects = await this.worksheets.pipeline.getRows({ limit: 100 });
            const activeProjects = projects.filter(row => 
                row.get('Status') === 'ACTIVE' || row.get('Status') === 'IN_PROGRESS'
            );

            // Calculate pipeline value
            const pipelineValue = activeProjects.reduce((sum, project) => {
                const value = parseFloat(project.get('Project Value') || '0');
                return sum + value;
            }, 0);

            return {
                leads: leadsByStatus,
                activeProjects: activeProjects.length,
                pipelineValue,
                totalLeads: leads.length,
                conversionRate: leadsByStatus.converted / (leads.length || 1) * 100,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting dashboard overview:', error);
            throw error;
        }
    }

    async getLeadsForKanban() {
        await this.initialize();
        
        try {
            const rows = await this.worksheets.leads.getRows({ limit: 500 });
            
            return rows.map(row => ({
                id: row.get('Lead ID') || `LEAD_${Date.now()}`,
                businessName: row.get('Business Name') || '',
                trade: row.get('Trade') || '',
                location: row.get('Location') || '',
                phone: row.get('Phone') || '',
                email: row.get('Email') || '',
                status: row.get('Status') || 'NEW',
                source: row.get('Lead Source') || '',
                dateAdded: row.get('Date Added') || '',
                notes: row.get('Notes') || '',
                rowIndex: row.rowIndex // For updates
            }));
        } catch (error) {
            console.error('Error getting leads for kanban:', error);
            throw error;
        }
    }

    async updateLeadStatus(leadId, newStatus) {
        await this.initialize();
        
        try {
            const rows = await this.worksheets.leads.getRows();
            const leadRow = rows.find(row => row.get('Lead ID') === leadId);
            
            if (leadRow) {
                leadRow.set('Status', newStatus);
                leadRow.set('Last Updated', new Date().toLocaleDateString());
                await leadRow.save();
                
                return {
                    success: true,
                    leadId,
                    newStatus,
                    updatedAt: new Date().toISOString()
                };
            } else {
                throw new Error(`Lead ${leadId} not found`);
            }
        } catch (error) {
            console.error('Error updating lead status:', error);
            throw error;
        }
    }

    async addNewLead(leadData) {
        await this.initialize();
        
        try {
            const newRow = await this.worksheets.leads.addRow({
                'Lead ID': `LM-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                'Lead Source': leadData.source || 'DASHBOARD',
                'Business Name': leadData.businessName,
                'Trade': leadData.trade,
                'Location': leadData.location,
                'Phone': leadData.phone || '',
                'Email': leadData.email || '',
                'Status': 'NEW',
                'Date Added': new Date().toLocaleDateString(),
                'Notes': leadData.notes || 'Added via dashboard'
            });

            return {
                success: true,
                leadId: newRow.get('Lead ID'),
                rowIndex: newRow.rowIndex
            };
        } catch (error) {
            console.error('Error adding new lead:', error);
            throw error;
        }
    }

    async getActiveProjects() {
        await this.initialize();
        
        try {
            const rows = await this.worksheets.pipeline.getRows({ limit: 100 });
            
            return rows
                .filter(row => row.get('Status') === 'ACTIVE' || row.get('Status') === 'IN_PROGRESS')
                .map(row => ({
                    id: row.get('Project ID') || '',
                    clientName: row.get('Client Name') || '',
                    trade: row.get('Trade') || '',
                    status: row.get('Status') || '',
                    assignedBot: row.get('Assigned Bot') || '',
                    dueDate: row.get('Due Date') || '',
                    value: parseFloat(row.get('Project Value') || '0'),
                    stages: {
                        website: row.get('Website Status') || 'pending',
                        seo: row.get('SEO Status') || 'pending',
                        chatbot: row.get('Chatbot Status') || 'pending',
                        deployment: row.get('Deployment Status') || 'pending'
                    },
                    rowIndex: row.rowIndex
                }));
        } catch (error) {
            console.error('Error getting active projects:', error);
            throw error;
        }
    }

    // Mock bot status - in production this would come from bot monitoring
    getBotStatus() {
        return [
            {
                id: 'MAX',
                name: 'Max (Lead Gen)',
                status: 'active',
                currentTask: 'Qualifying 5 new leads from Google Maps',
                tasksCompleted: 47,
                avgTaskTime: 12,
                lastActivity: new Date()
            },
            {
                id: 'IVY', 
                name: 'Ivy (Website Builder)',
                status: 'active',
                currentTask: 'Building website for Sydney Plumbing Co',
                tasksCompleted: 23,
                avgTaskTime: 45,
                lastActivity: new Date(Date.now() - 5 * 60000) // 5 min ago
            },
            {
                id: 'SAGE',
                name: 'Sage (SEO Specialist)', 
                status: 'idle',
                currentTask: 'Awaiting website completion',
                tasksCompleted: 31,
                avgTaskTime: 25,
                lastActivity: new Date(Date.now() - 15 * 60000) // 15 min ago
            },
            {
                id: 'RIVER',
                name: 'River (Chatbot Builder)',
                status: 'active', 
                currentTask: 'Configuring chatbot for Elite Kitchens',
                tasksCompleted: 19,
                avgTaskTime: 20,
                lastActivity: new Date(Date.now() - 2 * 60000) // 2 min ago
            },
            {
                id: 'PARKER',
                name: 'Parker (Integration Bot)',
                status: 'active',
                currentTask: 'Deploying Pro Electricians website',
                tasksCompleted: 12,
                avgTaskTime: 35,
                lastActivity: new Date(Date.now() - 1 * 60000) // 1 min ago
            }
        ];
    }
}

module.exports = DashboardSheetsService;