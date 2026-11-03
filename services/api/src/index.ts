import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5089;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Thodu API Engine',
    port: PORT,
    timestamp: new Date().toISOString(),
    organization: 'Sri Divyang Seva Kendram Trust'
  });
});

// Demo / Seed Authentication & Workspaces
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Initial flexible role credential mapping for immediate live testing
  let user = {
    id: 'u-family-1',
    name: 'Anita Sharma',
    email: email || 'anita@thodu.org',
    roles: ['FAMILY', 'CAREGIVER_GIG', 'ADMIN_STAFF'],
    phone: '+91 98765 43210'
  };

  if (email && email.includes('admin')) {
    user = {
      id: 'u-admin-1',
      name: 'Trust Administrator',
      email: email,
      roles: ['ADMIN', 'ADMIN_STAFF'],
      phone: '+91 94444 56789'
    };
  } else if (email && email.includes('care')) {
    user = {
      id: 'u-care-1',
      name: 'Anitha',
      email: email,
      roles: ['CAREGIVER_SALARIED', 'CAREGIVER_GIG'],
      phone: '+91 98765 11111'
    };
  }

  res.json({
    success: true,
    token: 'jwt-thodu-mock-token-' + Date.now(),
    user,
    workspaces: user.roles
  });
});

// Beneficiaries
app.get('/api/v1/beneficiaries', (req: Request, res: Response) => {
  res.json({
    success: true,
    beneficiaries: [
      {
        id: 'ben-1',
        name: 'Lakshmi Narasimha Rao',
        age: 72,
        category: 'Senior Citizen',
        relationship: 'Father',
        primaryContact: 'Anita Sharma (+91 98765 43210)',
        address: 'Home - T.T.D. Colony, Tirupati',
        accessibilityNeeds: 'Walking support, large fonts'
      },
      {
        id: 'ben-2',
        name: 'Saraswathi Garu',
        age: 68,
        category: 'Senior Citizen',
        relationship: 'Mother',
        primaryContact: 'Anita Sharma (+91 98765 43210)',
        address: 'Home - T.T.D. Colony, Tirupati',
        accessibilityNeeds: 'Knee pain care, assisted walking'
      },
      {
        id: 'ben-3',
        name: 'Raghav',
        age: 28,
        category: 'Person with Disability',
        relationship: 'Son',
        primaryContact: 'Anita Sharma (+91 98765 43210)',
        address: 'Home - T.T.D. Colony, Tirupati',
        accessibilityNeeds: 'Wheelchair assistance, companion support'
      }
    ]
  });
});

// Services
app.get('/api/v1/services', (req: Request, res: Response) => {
  res.json({
    success: true,
    categories: [
      { id: 'cat-1', name: 'Household Support', icon: 'home', color: '#E8F5E9' },
      { id: 'cat-2', name: 'Cooking Assistance', icon: 'utensils', color: '#FFF3E0' },
      { id: 'cat-3', name: 'Medication Reminders', icon: 'pill', color: '#F3E5F5' },
      { id: 'cat-4', name: 'Grocery & Errands', icon: 'shopping-bag', color: '#E0F2F1' },
      { id: 'cat-5', name: 'Companionship & Care', icon: 'heart', color: '#FCE4EC' },
      { id: 'cat-6', name: 'Disability Support', icon: 'accessibility', color: '#E8EAF6' }
    ],
    services: [
      {
        id: 'srv-1',
        categoryId: 'cat-1',
        name: 'Household Support',
        duration: '1 - 3 hours',
        pricePaise: 60000,
        formattedPrice: '₹600 / visit',
        description: 'Light housekeeping, laundry, home organization and daily household tasks.',
        includes: ['Light housekeeping', 'Laundry and folding', 'Home organization']
      },
      {
        id: 'srv-2',
        categoryId: 'cat-2',
        name: 'Cooking Assistance',
        duration: '1 - 2 hours',
        pricePaise: 45000,
        formattedPrice: '₹450 / visit',
        description: 'Nutritious meal preparation according to dietary preferences.',
        includes: ['Meal prep', 'Kitchen tidying', 'Diet tracking']
      }
    ]
  });
});

// Bookings
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  res.json({
    success: true,
    bookings: [
      {
        id: 'bk-1',
        serviceName: 'Household Support',
        date: '10 Mar 2026',
        time: '10:00 AM - 12:00 PM',
        address: 'Home - T.T.D. Colony, Tirupati',
        beneficiaryName: 'Saraswathi Garu',
        caregiver: {
          name: 'Anitha',
          rating: 4.8,
          verified: true,
          phone: '+91 98765 11111'
        },
        funding: 'Self-Funded • ₹600',
        status: 'Confirmed'
      },
      {
        id: 'bk-2',
        serviceName: 'Cooking Assistance',
        date: '12 Mar 2026',
        time: '11:00 AM - 1:00 PM',
        address: 'Home - T.T.D. Colony, Tirupati',
        beneficiaryName: 'Lakshmi Narasimha Rao',
        funding: 'Pending Approval',
        status: 'Pending'
      }
    ]
  });
});

// SOS Alert Dispatch
app.post('/api/v1/sos/trigger', (req: Request, res: Response) => {
  const { familyUserId, beneficiaryId, location } = req.body;
  const alertId = 'sos-' + Date.now();

  res.json({
    success: true,
    alertId,
    status: 'TRIGGERED',
    message: 'Urgent SOS Case opened. Responders notified.',
    emergencyContacts: [
      { name: 'Anita Sharma', phone: '+91 98765 43210', status: 'NOTIFIED' },
      { name: 'Trust Local Support Desk', phone: '+91 94444 56789', status: 'ALERTED' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[Thodu API] Running on port ${PORT}`);
  console.log(`[Thodu API] Live destination: https://thodu.sriddha.com (Port ${PORT})`);
});

