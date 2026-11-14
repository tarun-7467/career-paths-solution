ALTER TABLE "job_applications"
  ALTER COLUMN "status" TYPE VARCHAR(50);

UPDATE "job_applications"
SET "status" = 'Applied'
WHERE "status" IS NULL OR "status" = '';

ALTER TABLE "job_applications"
  ADD CONSTRAINT "job_applications_status_check"
  CHECK ("status" IN ('Applied', 'Interviewing', 'Round 2', 'Offer', 'Rejected', 'Withdrawn'))
  NOT VALID;
