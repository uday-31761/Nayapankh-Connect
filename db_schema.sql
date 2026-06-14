-- NayePankh Connect Database Schema Setup

-- 1. Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS otp_verification;
DROP TABLE IF EXISTS profile_update_requests;
DROP TABLE IF EXISTS volunteer_profiles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS batches;

-- 2. Create Sequence for 4-digit User IDs starting at 1000
CREATE SEQUENCE IF NOT EXISTS users_id_seq START WITH 1000;

-- 3. Create Batches Table
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    batch_name VARCHAR(100) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Users Table
CREATE TABLE users (
    id INT PRIMARY KEY DEFAULT nextval('users_id_seq'),
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    dob DATE,
    city VARCHAR(100),
    mobile VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ROLE_ADMIN', 'ROLE_VOLUNTEER')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PROFILE_UPDATE_PENDING')),
    batch_id INT REFERENCES batches(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Volunteer Profiles Table
CREATE TABLE volunteer_profiles (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    college VARCHAR(255),
    course VARCHAR(100),
    skills TEXT,
    interests TEXT,
    availability_days VARCHAR(255)
);

-- 6. Create Profile Update Requests Table
CREATE TABLE profile_update_requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    updated_data TEXT NOT NULL, -- JSON string representation
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create OTP Verification Table
CREATE TABLE otp_verification (
    id SERIAL PRIMARY KEY,
    mobile VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expiry_time TIMESTAMP NOT NULL
);

-- 8. Insert Default Batches
INSERT INTO batches (batch_name) VALUES 
('Batch 2026-A'),
('Batch 2026-B'),
('Summer Batch'),
('Winter Batch')
ON CONFLICT (batch_name) DO NOTHING;

-- 9. Insert Initial Admin User (password: admin123, bcrypt-hashed)
-- Bcrypt hash of 'admin123' is '$2a$10$w/rLd7/U03V7740YjD3.P.x3v6vM8pI7oWc4vX720X1c324r3675y'
INSERT INTO users (firstname, lastname, gender, dob, city, mobile, email, password, role, status, batch_id) VALUES
('System', 'Admin', 'Other', '1990-01-01', 'Delhi', '9999999999', 'admin@nayepankh.org', '$2a$10$w/rLd7/U03V7740YjD3.P.x3v6vM8pI7oWc4vX720X1c324r3675y', 'ROLE_ADMIN', 'APPROVED', NULL)
ON CONFLICT (email) DO NOTHING;
