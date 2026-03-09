-- Create database
CREATE DATABASE erp;

-- Create user
CREATE USER erpuser WITH PASSWORD 'erppassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE erp TO erpuser;

-- Connect to erp database and grant schema privileges
\c erp
GRANT ALL ON SCHEMA public TO erpuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO erpuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO erpuser;
