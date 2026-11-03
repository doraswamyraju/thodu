-- Thodu Database Schema (PostgreSQL)
-- Sri Divyang Seva Kendram Trust

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & IDENTITY
CREATE TYPE user_role_enum AS ENUM ('FAMILY', 'CAREGIVER_SALARIED', 'CAREGIVER_GIG', 'ADMIN', 'ADMIN_STAFF');
CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    status user_status_enum DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role)
);

-- 2. BENEFICIARIES & RELATIONSHIPS
CREATE TYPE beneficiary_category_enum AS ENUM ('SENIOR_CITIZEN', 'PERSON_WITH_DISABILITY');

CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    category beneficiary_category_enum NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20),
    relationship_label VARCHAR(100), -- 'Mother', 'Father', 'Self'
    address TEXT NOT NULL,
    primary_contact_phone VARCHAR(20) NOT NULL,
    accessibility_needs TEXT,
    care_preferences JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE family_beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    is_primary_guardian BOOLEAN DEFAULT TRUE,
    consent_recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(family_user_id, beneficiary_id)
);

-- 3. CAREGIVERS & PROFILES
CREATE TYPE caregiver_type_enum AS ENUM ('SALARIED', 'FREELANCER_GIG');
CREATE TYPE caregiver_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

CREATE TABLE caregiver_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caregiver_type caregiver_type_enum NOT NULL,
    verification_status caregiver_status_enum DEFAULT 'APPROVED',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    experience_years INT DEFAULT 1,
    skills TEXT[] DEFAULT '{}',
    service_areas TEXT[] DEFAULT '{}',
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SERVICES & PRICING
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    duration_hours NUMERIC(3,1) DEFAULT 2.0,
    base_price_paise BIGINT NOT NULL, -- in Paise (e.g., 60000 = ₹600)
    includes TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SPONSORSHIP PROGRAMMES
CREATE TYPE funding_type_enum AS ENUM ('SELF_FUNDED', 'TRUST_SPONSORED', 'DONOR_SPONSORED', 'SPLIT_FUNDING');
CREATE TYPE application_status_enum AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

CREATE TABLE sponsorship_programmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subsidy_percentage INT DEFAULT 100, -- e.g. 100% or 50%
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE sponsorship_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_user_id UUID NOT NULL REFERENCES users(id),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id),
    programme_id UUID REFERENCES sponsorship_programmes(id),
    status application_status_enum DEFAULT 'SUBMITTED',
    reason_for_support TEXT,
    id_proof_url TEXT,
    income_proof_url TEXT,
    medical_records_url TEXT,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. BOOKINGS & VISITS
CREATE TYPE booking_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    family_user_id UUID NOT NULL REFERENCES users(id),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id),
    service_id UUID NOT NULL REFERENCES services(id),
    caregiver_id UUID REFERENCES users(id),
    service_address TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIME NOT NULL,
    scheduled_end_time TIME NOT NULL,
    special_instructions TEXT,
    funding_type funding_type_enum DEFAULT 'SELF_FUNDED',
    total_amount_paise BIGINT NOT NULL,
    subsidy_amount_paise BIGINT DEFAULT 0,
    family_payable_paise BIGINT NOT NULL,
    status booking_status_enum DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. VISITS & CHECKLISTS
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES users(id),
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    checklist_completed JSONB DEFAULT '[]'::jsonb,
    caregiver_notes TEXT,
    incident_reported BOOLEAN DEFAULT FALSE,
    incident_details TEXT,
    status VARCHAR(50) DEFAULT 'SCHEDULED'
);

-- 8. SOS & EMERGENCY CASES
CREATE TYPE sos_status_enum AS ENUM ('TRIGGERED', 'ACKNOWLEDGED', 'RESPONDER_DISPATCHED', 'RESOLVED');

CREATE TABLE sos_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_user_id UUID NOT NULL REFERENCES users(id),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    status sos_status_enum DEFAULT 'TRIGGERED',
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
