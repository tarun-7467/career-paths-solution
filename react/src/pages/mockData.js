// Mock data shaped exactly like the initial database schema
// fake data before importing ur data tables

export const jobApplications = [
  {
    job_id: 1,
    user_id: 1,
    company: "Google",
    position: "Frontend Intern",
    status: "Applied",
    date_applied: "2026-09-15",
    notes: "Referred by a friend"
  },
  {
    job_id: 2,
    user_id: 1,
    company: "Amazon",
    position: "Software Engineer",
    status: "Interview",
    date_applied: "2026-09-11",
    notes: "Phone screen done"
  },
  {
    job_id: 3,
    user_id: 1,
    company: "Meta",
    position: "Data Analyst",
    status: "Offer",
    date_applied: "2026-09-30",
    notes: "Waiting to negotiate"
  }
];

export const reminders = [
  {
    reminder_id: 1,
    job_id: 2,
    reminder_name: "Amazon Interview",
    reminder_date: "2026-09-25",
    description: "Technical interview, prepare data structures",
    completed: false
  },
  {
    reminder_id: 2,
    job_id: 3,
    reminder_name: "Follow up with Meta",
    reminder_date: "2026-10-22",
    description: "Ask about offer timeline",
    completed: false
  }
];