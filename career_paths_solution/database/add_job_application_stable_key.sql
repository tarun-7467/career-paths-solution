-- Add a per-user stable key for Workday job postings.
-- Existing rows are assigned a key when they are next saved through the API.

BEGIN;

ALTER TABLE public.job_applications
    ADD COLUMN IF NOT EXISTS stable_job_key varchar(64);

CREATE UNIQUE INDEX IF NOT EXISTS job_applications_user_stable_job_key_idx
    ON public.job_applications (user_id, stable_job_key)
    WHERE stable_job_key IS NOT NULL;

COMMIT;
