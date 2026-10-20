-- TFCRT-48: Add detailed job application fields
-- Run against the existing PostgreSQL database.

BEGIN;

ALTER TABLE public.job_applications
    ADD COLUMN IF NOT EXISTS location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS requisition_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS employment_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS work_mode VARCHAR(50),
    ADD COLUMN IF NOT EXISTS posted_date VARCHAR(100),
    ADD COLUMN IF NOT EXISTS job_url TEXT,
    ADD COLUMN IF NOT EXISTS job_description TEXT;

COMMIT;