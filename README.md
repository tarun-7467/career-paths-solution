
# Career Paths Solution
Career Paths Solution is a personal tool for managing a job search end-to-end. Each application is logged with the company, the resume version used, current status, salary, and location, so nothing falls through the cracks across a long search. Automated reminders prompt follow-ups at the right time, and a dashboard summarizes application statistics with a filterable search, making it easy to see where things stand at a glance.

## Supabase Database Setup

The project uses a shared PostgreSQL database hosted on Supabase. Django reads the database connection settings from environment variables.

### 1. Install Dependencies

Install the project dependencies:

```bash
pip install -r requirements.txt
```

The required PostgreSQL and environment variable dependencies are already included in the project requirements.

### 2. Configure Environment Variables

Create a `.env` file in the project root directory if one does not already exist.

Add the following database settings:

```env
DB_NAME=postgres
DB_USER=your_supabase_database_user
DB_PASSWORD=your_supabase_database_password
DB_HOST=your_supabase_database_host
DB_PORT=5432
```

Replace the placeholder values with the shared Supabase connection information provided by the team.

Do not commit the `.env` file or database password to GitHub.

### 3. Verify the Connection

Run the Django system check:

```bash
python career_paths_solution/manage.py check
```

Then verify the database connection:

```bash
python career_paths_solution/manage.py shell -c "from django.db import connection; connection.ensure_connection(); print('Database connection successful')"
```

If configured correctly, the terminal should display:

```text
Database connection successful
```
