# Thodu Elder & Assisted Care Platform — Product Specification & Master Report

## Executive Summary
**Thodu** (తోడు) is an independent, standalone elder and assisted care technology platform. It serves families, senior citizens, and persons with disabilities by providing reliable, verified caregiver assistance on-demand and through scheduled recurring care plans.

While Thodu operates as a self-sustaining commercial technology product, it integrates with charitable and philanthropic partners—including **Sri Divyang Seva Kendram Trust** and corporate CSR programs—who sponsor and subsidize care for underprivileged beneficiaries (BPL, White Ration Card, and UDID Divyang cardholders).

---

## System Architecture & Portals

```
+-----------------------------------------------------------------------------------+
|                            THODU PLATFORM ECOSYSTEM                              |
+-----------------------------------------------------------------------------------+
       |                                      |                               |
       v                                      v                               v
[ Beneficiary / Family ]             [ Caregiver App ]             [ Operations Admin ]
- Live Visit Tracking                - GPS Clock-In / Geo-fence    - City Dispatch Center
- 1-Tap SOS Emergency                - Clinical Visit Checklists   - Live GPS Fleet Map
- Book Care Visits                   - Earnings & Payout Wallet    - Beneficiary Management
- Health Dossier & Vitals            - Verification Onboarding     - Workforce Management
- Subsidy & Grant Tracker                                          - Financial Ledger & Payouts
       |                                      |                               |
       +--------------------------------------+-------------------------------+
                                      |
                                      v
                        [ Thodu Core API & Database ]
                                      ^
                                      | (Funding & Subsidy API Integration)
                                      |
       +---------------------------------------------------------------+
       |             Philanthropic & CSR Funding Partners              |
       |  - Sri Divyang Seva Kendram Trust (Endowments & 80G Grants)   |
       |  - CSR & Philanthropic Donor Programs                         |
       +---------------------------------------------------------------+
```

---

## User Portals & Features

### 1. Operations Admin Console (Completed)
- **Executive Overview & Analytics**: Live operational KPIs, volume trends, service distribution, fast dispatch actions.
- **Live Dispatch Map**: Real-time map with beneficiary homes, caregiver GPS breadcrumbs, and emergency SOS beacons.
- **Care Bookings Dispatch Board**: Direct assignment, broadcast to gig pool, booking status workflows.
- **Beneficiaries & Families**: 4-Step registration wizard, verified identity numbers (Aadhaar, UDID), clinical profiles.
- **Caregiver Workforce**: 4-Step onboarding wizard, shift availability, background verification badges.
- **Caregiver Earnings & Payout Requests**: Shift log, incentive calculations, 1-click payout approval.
- **Billing & Payment Ledger**: Payment transaction tracking, split-funding support, and official receipts.
- **Staff Directory & Access Control**: Role management for platform coordinators and dispatch supervisors.
- **Sponsorship & Subsidies**: Partner grant allocation for eligible beneficiaries.
- **Emergency SOS Command Queue**: Real-time distress queue with 1-click coordinator dispatch and resolution notes.
- **System Audit Logs**: Real-time immutable activity logging.

### 2. Beneficiary & Family Web Dashboard (Active Implementation)
- **Daily Care Overview**: View today's caregiver visit, real-time arrival status, vital signs log.
- **1-Tap SOS**: Dedicated high-visibility emergency panic trigger.
- **On-Demand & Scheduled Booking**: Request household, nursing, companion, or mobility support.
- **Family Health Dossier**: View & update medical conditions, allergies, and attending doctor details.
- **Funding & Subsidy Status**: Track active grants provided by partner trusts like Sri Divyang Seva Kendram Trust.
- **Invoices & Receipts**: View billing breakdown, copayments, and downloadable receipts.
