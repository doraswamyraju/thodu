import React, { useState } from 'react';
import { 
  Heart, LayoutDashboard, Calendar, Users, ShieldCheck, 
  Settings, AlertTriangle, Search, Bell, Plus, CheckCircle2,
  DollarSign, FileText, Activity, Clock
} from 'lucide-react';
import './style.css';

type NavSection = 'overview' | 'bookings' | 'beneficiaries' | 'workforce' | 'funding' | 'sos';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');

  return (
    <div className="web-layout">
      {/* Left Desktop Sidebar */}
      <aside className="web-sidebar">
        <div className="sidebar-brand" style={{ padding: '20px 16px' }}>
          <img 
            src="/thodu_logo_dark_banner.png" 
            alt="Thodu Elder Care Services" 
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
          />
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview & Analytics</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveSection('bookings')}
          >
            <Calendar size={18} />
            <span>Care Bookings</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'beneficiaries' ? 'active' : ''}`}
            onClick={() => setActiveSection('beneficiaries')}
          >
            <Users size={18} />
            <span>Beneficiaries & Families</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'workforce' ? 'active' : ''}`}
            onClick={() => setActiveSection('workforce')}
          >
            <ShieldCheck size={18} />
            <span>Caregiver Workforce</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'funding' ? 'active' : ''}`}
            onClick={() => setActiveSection('funding')}
          >
            <DollarSign size={18} />
            <span>Sponsorship & Subsidies</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'sos' ? 'active' : ''}`}
            onClick={() => setActiveSection('sos')}
          >
            <AlertTriangle size={18} color="#FF8A80" />
            <span style={{ color: activeSection === 'sos' ? '#FFF' : '#FF8A80' }}>SOS Emergency Queue</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              TA
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Trust Operations</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>admin@thodu.sriddha.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="web-main">
        {/* Top Utility Bar */}
        <header className="web-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>
              {activeSection === 'overview' && 'Executive Operations Dashboard'}
              {activeSection === 'bookings' && 'Care Service Bookings & Dispatch'}
              {activeSection === 'beneficiaries' && 'Beneficiary Registry & Care Profiles'}
              {activeSection === 'workforce' && 'Caregiver Workforce & Verification'}
              {activeSection === 'funding' && 'Trust Sponsorship & Subsidy Allocation'}
              {activeSection === 'sos' && 'Emergency Rapid Response Queue'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input 
                placeholder="Search records, beneficiaries, IDs..." 
                style={{ padding: '8px 14px 8px 36px', borderRadius: '10px', border: '1px solid #E5E9E6', fontSize: '13px', width: '280px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#E8F5E9', padding: '6px 12px', borderRadius: '8px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E7D32' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0B5D3B' }}>Live Backend Port 5089</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="web-content">
          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <div>
              <div className="grid-stats">
                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Active Beneficiaries</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0B5D3B', marginTop: 4 }}>142</h2>
                    <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 4 }}>+12 registered this month</p>
                  </div>
                  <Users size={36} color="#0B5D3B" style={{ opacity: 0.8 }} />
                </div>

                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Visits This Week</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#F9B233', marginTop: 4 }}>68</h2>
                    <p style={{ fontSize: '12px', color: '#6B7C72', marginTop: 4 }}>94% on-time completion</p>
                  </div>
                  <Calendar size={36} color="#F9B233" style={{ opacity: 0.8 }} />
                </div>

                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Trust Sponsored Value</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#D81B60', marginTop: 4 }}>₹84,500</h2>
                    <p style={{ fontSize: '12px', color: '#D81B60', marginTop: 4 }}>42% of total service volume</p>
                  </div>
                  <DollarSign size={36} color="#D81B60" style={{ opacity: 0.8 }} />
                </div>

                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Active Caregivers</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2E7D32', marginTop: 4 }}>24</h2>
                    <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 4 }}>16 Salaried • 8 Gig</p>
                  </div>
                  <ShieldCheck size={36} color="#2E7D32" style={{ opacity: 0.8 }} />
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="data-table-card">
                <div className="table-header">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Recent Care Operations</h3>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Real-time booking and dispatch status across Tirupati service zones</p>
                  </div>
                  <button className="btn-primary" onClick={() => setActiveSection('bookings')}>
                    <Plus size={16} /> New Booking
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Beneficiary & Category</th>
                      <th>Care Service</th>
                      <th>Schedule</th>
                      <th>Assigned Caregiver</th>
                      <th>Funding Route</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>#TH-8901</strong></td>
                      <td>
                        <strong>Saraswathi Garu</strong>
                        <div style={{ fontSize: '12px', color: '#6B7C72' }}>Senior Citizen (Mother)</div>
                      </td>
                      <td>Household Support</td>
                      <td>Today, 10:00 AM - 12:00 PM</td>
                      <td>Anitha (Salaried)</td>
                      <td><span className="badge badge-success">Trust Sponsored (100%)</span></td>
                      <td><span className="badge badge-success">In Progress</span></td>
                    </tr>
                    <tr>
                      <td><strong>#TH-8898</strong></td>
                      <td>
                        <strong>Lakshmi Narasimha Rao</strong>
                        <div style={{ fontSize: '12px', color: '#6B7C72' }}>Senior Citizen (Father)</div>
                      </td>
                      <td>Cooking Assistance</td>
                      <td>Tomorrow, 11:00 AM - 1:00 PM</td>
                      <td>K. Ramesh (Gig Claimed)</td>
                      <td><span className="badge badge-warning">Split Funded (50%)</span></td>
                      <td><span className="badge badge-warning">Confirmed</span></td>
                    </tr>
                    <tr>
                      <td><strong>#TH-8892</strong></td>
                      <td>
                        <strong>Raghav</strong>
                        <div style={{ fontSize: '12px', color: '#6B7C72' }}>Person with Disability</div>
                      </td>
                      <td>Disability Mobility Support</td>
                      <td>12 Mar 2026, 09:00 AM</td>
                      <td>P. Venkatesh (Salaried)</td>
                      <td><span className="badge badge-success">Donor Sponsored</span></td>
                      <td><span className="badge badge-success">Scheduled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CARE BOOKINGS SECTION */}
          {activeSection === 'bookings' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>All Bookings & Roster Coordination</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Manage salaried roster assignment and gig job broadcasts</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-primary"><Plus size={16} /> Broadcast Gig Job</button>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Family Guardian</th>
                    <th>Beneficiary</th>
                    <th>Address</th>
                    <th>Time & Duration</th>
                    <th>Charge / Subsidy</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>BK-1024</strong></td>
                    <td>Anita Sharma (+91 98765 43210)</td>
                    <td>Saraswathi Garu</td>
                    <td>Home - T.T.D. Colony, Tirupati</td>
                    <td>10 Mar 2026 (2 Hours)</td>
                    <td>₹600 (100% Trust Covered)</td>
                    <td><button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #0B5D3B', background: '#FFF', color: '#0B5D3B', cursor: 'pointer', fontWeight: 600 }}>Manage</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* BENEFICIARIES SECTION */}
          {activeSection === 'beneficiaries' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiary Directory</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Verified records of elderly individuals and persons with disabilities</p>
                </div>
                <button className="btn-primary"><Plus size={16} /> Register Beneficiary</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Age</th>
                    <th>Primary Guardian</th>
                    <th>Location</th>
                    <th>Care Needs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Saraswathi Garu</strong></td>
                    <td><span className="badge badge-success">Senior Citizen</span></td>
                    <td>68</td>
                    <td>Anita Sharma (Daughter)</td>
                    <td>Tirupati Urban</td>
                    <td>Mobility support, knee care</td>
                  </tr>
                  <tr>
                    <td><strong>Lakshmi Narasimha Rao</strong></td>
                    <td><span className="badge badge-success">Senior Citizen</span></td>
                    <td>72</td>
                    <td>Anita Sharma (Daughter)</td>
                    <td>Tirupati Urban</td>
                    <td>Dietary supervision, walking assistance</td>
                  </tr>
                  <tr>
                    <td><strong>Raghav</strong></td>
                    <td><span className="badge badge-warning">Person with Disability</span></td>
                    <td>28</td>
                    <td>Anita Sharma (Sister)</td>
                    <td>Tirupati Urban</td>
                    <td>Wheelchair accompaniment</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* WORKFORCE SECTION */}
          {activeSection === 'workforce' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Directory & Employment Status</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Salaried Trust staff and verified independent gig caregivers</p>
                </div>
                <button className="btn-primary"><Plus size={16} /> Add Caregiver</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Caregiver</th>
                    <th>Type</th>
                    <th>Verification</th>
                    <th>Rating</th>
                    <th>Primary Skills</th>
                    <th>Active Assignments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Anitha</strong></td>
                    <td><span className="badge badge-success">Salaried Staff</span></td>
                    <td><span className="badge badge-success">Verified & Background Checked</span></td>
                    <td>★ 4.8 / 5.0</td>
                    <td>Elder companionship, Cooking, Household</td>
                    <td>3 today</td>
                  </tr>
                  <tr>
                    <td><strong>K. Ramesh</strong></td>
                    <td><span className="badge badge-warning">Freelancer / Gig</span></td>
                    <td><span className="badge badge-success">Verified</span></td>
                    <td>★ 4.9 / 5.0</td>
                    <td>Cooking, Errands, Medication Reminders</td>
                    <td>Available for broadcasts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* FUNDING & SPONSORSHIP SECTION */}
          {activeSection === 'funding' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Sponsorship Applications & Subsidies</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Review and approve Trust/Donor sponsored care aid</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Application Ref</th>
                    <th>Beneficiary</th>
                    <th>Programme</th>
                    <th>Documents Provided</th>
                    <th>Requested Subsidy</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>SP-2026-09</strong></td>
                    <td>Saraswathi Garu</td>
                    <td>Elder Care Support Programme</td>
                    <td>Aadhaar, Income Proof Verified</td>
                    <td>100% Subsidized</td>
                    <td><span className="badge badge-warning">Under Review</span></td>
                    <td>
                      <button style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#0B5D3B', color: '#FFF', cursor: 'pointer', fontWeight: 600, marginRight: 6 }}>Approve</button>
                      <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #C62828', background: '#FFF', color: '#C62828', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* SOS EMERGENCY QUEUE */}
          {activeSection === 'sos' && (
            <div className="data-table-card" style={{ borderLeft: '4px solid #C62828' }}>
              <div className="table-header" style={{ background: '#FFF5F5' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#C62828' }}>Live SOS Rapid Responder Queue</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Emergency triggers dispatched by family members or caregivers</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Beneficiary</th>
                    <th>Triggered By</th>
                    <th>Time</th>
                    <th>Contacts Notified</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>SOS-9912</strong></td>
                    <td>Saraswathi Garu</td>
                    <td>Anita Sharma (+91 98765 43210)</td>
                    <td>5 mins ago</td>
                    <td>Anita Sharma, Local Trust Desk</td>
                    <td><span className="badge badge-danger">Responder Dispatched</span></td>
                    <td>
                      <button style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#2E7D32', color: '#FFF', cursor: 'pointer', fontWeight: 600 }}>Mark Resolved</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
