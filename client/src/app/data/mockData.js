// Mock data for the CRM system
// This file contains sample data for demonstration purposes
// In a real application, this data would come from an API/database

export const leads = [
  {
    id: 1,
    clientName: 'Acme Corporation',
    contactPerson: 'Jane Smith',
    email: 'jane@acme.com',
    phone: '+1 234 567 8900',
    service: 'Website Development',
    budget: '$15,000',
    deadline: '2026-05-15',
    status: 'new',
    source: 'Website',
    notes: 'Interested in e-commerce platform',
    assignedTo: 'Sarah Sales',
    createdAt: '2026-04-01'
  },
  {
    id: 2,
    clientName: 'TechStart Inc',
    contactPerson: 'Mike Johnson',
    email: 'mike@techstart.com',
    phone: '+1 234 567 8901',
    service: 'Graphic Design',
    budget: '$5,000',
    deadline: '2026-04-20',
    status: 'discussing',
    source: 'Referral',
    notes: 'Logo and brand identity package',
    assignedTo: 'Sarah Sales',
    createdAt: '2026-03-28'
  },
  {
    id: 3,
    clientName: 'Global Media',
    contactPerson: 'Emily Brown',
    email: 'emily@globalmedia.com',
    phone: '+1 234 567 8902',
    service: 'Video Editing',
    budget: '$8,000',
    deadline: '2026-04-25',
    status: 'proposal',
    source: 'LinkedIn',
    notes: 'YouTube channel content series',
    assignedTo: 'John Admin',
    createdAt: '2026-03-25'
  },
  {
    id: 4,
    clientName: 'FitLife Studios',
    contactPerson: 'David Lee',
    email: 'david@fitlife.com',
    phone: '+1 234 567 8903',
    service: 'Website Development',
    budget: '$12,000',
    deadline: '2026-05-01',
    status: 'negotiation',
    source: 'Google Ads',
    notes: 'Fitness booking platform',
    assignedTo: 'Sarah Sales',
    createdAt: '2026-03-20'
  },
  {
    id: 5,
    clientName: 'Blue Ocean Ventures',
    contactPerson: 'Lisa Chen',
    email: 'lisa@blueocean.com',
    phone: '+1 234 567 8904',
    service: 'Graphic Design',
    budget: '$3,500',
    deadline: '2026-04-18',
    status: 'closed-won',
    source: 'Referral',
    notes: 'Marketing materials for product launch',
    assignedTo: 'John Admin',
    createdAt: '2026-03-15'
  },
  {
    id: 6,
    clientName: 'RetailPro Systems',
    contactPerson: 'Tom Wilson',
    email: 'tom@retailpro.com',
    phone: '+1 234 567 8905',
    service: 'Video Editing',
    budget: '$6,500',
    deadline: '2026-04-30',
    status: 'closed-lost',
    source: 'Cold Email',
    notes: 'Product demo videos',
    assignedTo: 'Sarah Sales',
    createdAt: '2026-03-10'
  }
];

export const projects = [
  {
    id: 1,
    clientName: 'Blue Ocean Ventures',
    service: 'Graphic Design',
    assignedTo: 'Alex Designer',
    deadline: '2026-04-18',
    status: 'in-progress',
    progress: 65,
    startDate: '2026-04-02',
    files: 12,
    revisions: 2,
    priority: 'high'
  },
  {
    id: 2,
    clientName: 'Urban Eats',
    service: 'Website Development',
    assignedTo: 'Mike Developer',
    deadline: '2026-04-22',
    status: 'in-progress',
    progress: 40,
    startDate: '2026-03-25',
    files: 8,
    revisions: 1,
    priority: 'medium'
  },
  {
    id: 3,
    clientName: 'Fashion Forward',
    service: 'Video Editing',
    assignedTo: 'Sam Editor',
    deadline: '2026-04-15',
    status: 'review',
    progress: 90,
    startDate: '2026-03-20',
    files: 15,
    revisions: 3,
    priority: 'high'
  },
  {
    id: 4,
    clientName: 'Green Energy Co',
    service: 'Graphic Design',
    assignedTo: 'Alex Designer',
    deadline: '2026-04-28',
    status: 'not-started',
    progress: 0,
    startDate: '2026-04-10',
    files: 0,
    revisions: 0,
    priority: 'low'
  },
  {
    id: 5,
    clientName: 'Smart Home Tech',
    service: 'Website Development',
    assignedTo: 'Mike Developer',
    deadline: '2026-05-05',
    status: 'completed',
    progress: 100,
    startDate: '2026-03-10',
    files: 25,
    revisions: 4,
    priority: 'medium'
  }
];

export const activities = [
  {
    id: 1,
    type: 'call',
    clientName: 'Acme Corporation',
    duration: '25 min',
    notes: 'Discussed project requirements and timeline',
    date: '2026-04-08',
    time: '10:30 AM',
    user: 'Sarah Sales'
  },
  {
    id: 2,
    type: 'meeting',
    clientName: 'TechStart Inc',
    duration: '1 hr',
    notes: 'Presented design mockups and gathered feedback',
    date: '2026-04-08',
    time: '2:00 PM',
    user: 'John Admin'
  },
  {
    id: 3,
    type: 'email',
    clientName: 'Global Media',
    notes: 'Sent proposal document with pricing breakdown',
    date: '2026-04-07',
    time: '4:15 PM',
    user: 'Sarah Sales'
  },
  {
    id: 4,
    type: 'call',
    clientName: 'FitLife Studios',
    duration: '15 min',
    notes: 'Follow-up call regarding contract terms',
    date: '2026-04-07',
    time: '11:00 AM',
    user: 'Sarah Sales'
  }
];

export const teamMembers = [
  {
    id: 1,
    name: 'Sarah Sales',
    role: 'Sales Manager',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Sales&background=6366f1&color=fff',
    leads: 45,
    deals: 12,
    revenue: '$142,000',
    conversionRate: 26.7,
    status: 'online'
  },
  {
    id: 2,
    name: 'John Admin',
    role: 'Admin',
    avatar: 'https://ui-avatars.com/api/?name=John+Admin&background=10b981&color=fff',
    leads: 38,
    deals: 15,
    revenue: '$180,000',
    conversionRate: 39.5,
    status: 'online'
  },
  {
    id: 3,
    name: 'Alex Designer',
    role: 'Graphic Designer',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Designer&background=f59e0b&color=fff',
    projects: 23,
    completed: 20,
    rating: 4.8,
    status: 'busy'
  },
  {
    id: 4,
    name: 'Mike Developer',
    role: 'Web Developer',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Developer&background=8b5cf6&color=fff',
    projects: 18,
    completed: 15,
    rating: 4.9,
    status: 'online'
  },
  {
    id: 5,
    name: 'Sam Editor',
    role: 'Video Editor',
    avatar: 'https://ui-avatars.com/api/?name=Sam+Editor&background=ec4899&color=fff',
    projects: 31,
    completed: 28,
    rating: 4.7,
    status: 'offline'
  }
];

export const targets = {
  daily: {
    calls: { target: 20, current: 14 },
    meetings: { target: 5, current: 3 },
    emails: { target: 30, current: 22 },
    leads: { target: 8, current: 5 }
  },
  weekly: {
    newLeads: { target: 40, current: 28 },
    proposals: { target: 15, current: 10 },
    closedDeals: { target: 5, current: 3 },
    revenue: { target: 50000, current: 32000 }
  },
  monthly: {
    leads: { target: 160, current: 112 },
    deals: { target: 20, current: 14 },
    revenue: { target: 200000, current: 142000 },
    conversionRate: { target: 12.5, current: 12.5 }
  }
};

export const dashboardStats = {
  leads: { value: 142, change: 12, trend: 'up' },
  deals: { value: 38, change: 5, trend: 'up' },
  followups: { value: 23, change: -3, trend: 'down' },
  revenue: { value: '324K', change: 18, trend: 'up' }
};

export const chartData = {
  leadsByService: [
    { name: 'Website Dev', value: 45, color: '#6366f1' },
    { name: 'Graphic Design', value: 38, color: '#10b981' },
    { name: 'Video Editing', value: 32, color: '#f59e0b' }
  ],
  monthlyDeals: [
    { month: 'Jan', deals: 12, revenue: 48 },
    { month: 'Feb', deals: 15, revenue: 62 },
    { month: 'Mar', deals: 18, revenue: 75 },
    { month: 'Apr', deals: 8, revenue: 32 }
  ]
};

export const tasks = [
  { id: 1, title: 'Follow up with Acme Corp', priority: 'high', time: '10:00 AM', completed: false },
  { id: 2, title: 'Send proposal to TechStart', priority: 'high', time: '11:30 AM', completed: true },
  { id: 3, title: 'Review Global Media contract', priority: 'medium', time: '2:00 PM', completed: false },
  { id: 4, title: 'Team standup meeting', priority: 'low', time: '3:30 PM', completed: false }
];