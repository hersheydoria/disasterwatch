-- DisasterWatch Database Schema
-- This schema creates tables for the DisasterWatch application connecting admin and public user systems

-- ============================================================
-- 1. USERS TABLE (Coordinators and Admins only - Hardcoded accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'coordinator' CHECK (role IN ('admin', 'coordinator')),
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. REGIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. SHELTERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    region_id INTEGER NOT NULL REFERENCES regions(id),
    shelter_type VARCHAR(50) NOT NULL CHECK (shelter_type IN ('school', 'gym', 'church', 'community_center', 'pavilion', 'hall', 'other')),
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'full', 'maintenance')),
    contact_person VARCHAR(100),
    contact_number VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. EARTHQUAKES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS earthquakes (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(50) UNIQUE NOT NULL,
    magnitude DECIMAL(3, 1) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    depth DECIMAL(5, 2) NOT NULL,
    region_id INTEGER NOT NULL REFERENCES regions(id),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('main_shock', 'aftershock', 'foreshock')),
    description TEXT,
    triggered_at TIMESTAMP NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. ALERTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    alert_id VARCHAR(50) UNIQUE NOT NULL,
    earthquake_id INTEGER REFERENCES earthquakes(id),
    shelter_id INTEGER REFERENCES shelters(id),
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('earthquake', 'fire', 'power_outage', 'overcrowding', 'equipment_failure', 'security_breach', 'other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
    description TEXT,
    triggered_at TIMESTAMP NOT NULL,
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    acknowledged_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. EVACUEES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS evacuees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    age INTEGER,
    gender VARCHAR(10),
    address VARCHAR(255),
    shelter_id INTEGER REFERENCES shelters(id),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'evacuated' CHECK (status IN ('evacuated', 'safe', 'departed', 'pending')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    report_id VARCHAR(50) UNIQUE NOT NULL,
    shelter_id INTEGER REFERENCES shelters(id),
    earthquake_id INTEGER REFERENCES earthquakes(id),
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('incident', 'capacity', 'status_update', 'inventory', 'maintenance', 'safety')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'updated', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. AI_RECOMMENDATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id SERIAL PRIMARY KEY,
    recommendation_id VARCHAR(50) UNIQUE NOT NULL,
    earthquake_id INTEGER REFERENCES earthquakes(id),
    shelter_id INTEGER REFERENCES shelters(id),
    recommendation_text TEXT NOT NULL,
    confidence_score DECIMAL(3, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'implemented', 'rejected', 'in_progress')),
    implemented_at TIMESTAMP,
    implemented_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. ACTIVITY_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. SAFETY_TIPS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS safety_tips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('before_earthquake', 'during_earthquake', 'after_earthquake', 'evacuation', 'shelter_safety')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 11. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id INTEGER,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 12. SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_shelters_region ON shelters(region_id);
CREATE INDEX idx_shelters_status ON shelters(status);
CREATE INDEX idx_earthquakes_region ON earthquakes(region_id);
CREATE INDEX idx_earthquakes_triggered_at ON earthquakes(triggered_at);
CREATE INDEX idx_alerts_shelter ON alerts(shelter_id);
CREATE INDEX idx_alerts_earthquake ON alerts(earthquake_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_evacuees_shelter ON evacuees(shelter_id);
CREATE INDEX idx_evacuees_status ON evacuees(status);
CREATE INDEX idx_reports_shelter ON reports(shelter_id);
CREATE INDEX idx_reports_created_by ON reports(created_by);
CREATE INDEX idx_ai_recommendations_shelter ON ai_recommendations(shelter_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================================
-- SAMPLE DATA INSERTION
-- ============================================================

-- Insert Regions
INSERT INTO regions (name, code, description) VALUES
('Caraga', 'CAR', 'Caraga Administrative Region'),
('Agusan del Norte', 'AGN', 'Province in Caraga'),
('Agusan del Sur', 'AGS', 'Province in Caraga'),
('Surigao del Norte', 'SUN', 'Province in Caraga'),
('Surigao del Sur', 'SUS', 'Province in Caraga')
ON CONFLICT (name) DO NOTHING;

-- Insert Hardcoded Admin and Coordinator Accounts
-- Passwords: {username}123 (e.g., admin123, coordinator_butuan123, etc.)
-- Password hashes generated using bcrypt with salt rounds: 10
INSERT INTO users (username, email, password_hash, full_name, role, phone_number, is_active) VALUES
('admin', 'admin@disasterwatch.com', '$2b$10$8qRA.yO.sX5iIiyj7L7y7eykPu.Hf1zTmJ93xdAw297ZE8KTrc/tW', 'System Administrator', 'admin', '+63-2-1234-5678', true),
('coordinator_butuan', 'coordinator.butuan@disasterwatch.com', '$2b$10$SeIB/PdqvzWJaexmRQpkhu3zrKVf1u6hlIyZng9GsoSGUAssAru1u', 'Maria Santos - Butuan Coordinator', 'coordinator', '+63-917-1234-567', true),
('coordinator_agusan_norte', 'coordinator.agusan.norte@disasterwatch.com', '$2b$10$pdywea9l/dczFB5sGOAzHesI96cw2FTAvcmie4aV/ow0Pfn2MnHpS', 'Juan Dela Cruz - Agusan del Norte Coordinator', 'coordinator', '+63-917-2345-678', true),
('coordinator_surigao_sur', 'coordinator.surigao.sur@disasterwatch.com', '$2b$10$whwDfJ3B1Q7lR9M6IOHmAeVZkK6zQQ245gDniMUnLPO/jwZ1Hpthq', 'Rosa Garcia - Surigao del Sur Coordinator', 'coordinator', '+63-917-3456-789', true),
('coordinator_agusan_sur', 'coordinator.agusan.sur@disasterwatch.com', '$2b$10$ckgo/WbuYikMVKqIf8Jy..mOYW.DtA2otFtSnB0qvqmb58qGCZn0m', 'Pedro Mendoza - Agusan del Sur Coordinator', 'coordinator', '+63-917-4567-890', true),
('coordinator_cabadbaran', 'coordinator.cabadbaran@disasterwatch.com', '$2b$10$ft7KjJX.OG7CNti8Bloe6OLaCGEPZjBAo/n.gcjvjHgIELqcMBtK.', 'Ana Reyes - Cabadbaran Coordinator', 'coordinator', '+63-917-5678-901', true)
ON CONFLICT (username) DO NOTHING;

-- Insert Shelters in Caraga
INSERT INTO shelters (name, address, latitude, longitude, region_id, shelter_type, capacity, status, contact_person, contact_number) 
SELECT 
    'Central High School', '1234 Main Street, Downtown District', 8.2422, 125.2449, r.id, 'school', 500, 'active', 'Mr. Juan Santos', '09123456789'
FROM regions r WHERE r.name = 'Agusan del Norte'
ON CONFLICT DO NOTHING;

INSERT INTO shelters (name, address, latitude, longitude, region_id, shelter_type, capacity, status, contact_person, contact_number) 
SELECT 
    'Community Center East', '567 Oak Avenue, East Side', 8.2450, 125.2500, r.id, 'community_center', 200, 'active', 'Ms. Maria Cruz', '09187654321'
FROM regions r WHERE r.name = 'Agusan del Norte'
ON CONFLICT DO NOTHING;

-- Insert Safety Tips
INSERT INTO safety_tips (title, description, category) VALUES
('Drop, Cover, and Hold On', 'When you feel an earthquake, immediately drop to your hands and knees. Take cover under a sturdy desk or table if available, or cover your head and neck with your hands.', 'during_earthquake'),
('Stay Away from Windows', 'Move away from windows, mirrors, and other glass objects that could shatter during an earthquake.', 'during_earthquake'),
('Check for Hazards', 'After an earthquake, carefully inspect your surroundings for gas leaks, electrical damage, and structural damage before moving about.', 'after_earthquake'),
('Have an Emergency Kit', 'Prepare an emergency kit with water, food, first aid supplies, flashlight, and batteries before an earthquake occurs.', 'before_earthquake'),
('Know Your Shelter Routes', 'Before an earthquake, know the fastest route to your designated shelter and inform your family members.', 'evacuation')
ON CONFLICT DO NOTHING;

-- ============================================================
-- GRANT PERMISSIONS (if needed for specific users)
-- ============================================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO disasterwatch_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO disasterwatch_user;
