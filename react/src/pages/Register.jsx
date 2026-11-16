
import { useState } from 'react';
import '../stylesheets/Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const csrfResponse = await fetch('/api/auth/csrf/', {
        credentials: 'same-origin',
      });

      if (!csrfResponse.ok) {
        throw new Error('Unable to initialize registration.');
      }

      const { csrfToken } = await csrfResponse.json();

      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.detail ||
          data.email?.[0] ||
          data.password?.[0] ||
          data.name?.[0] ||
          'Registration failed. Please try again.';

        throw new Error(message);
      }

      alert('Registration successful! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-brand">Career Paths Solution</h1>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Create an account to start tracking your job applications.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Name</label>
            <input
              className="auth-input"
              id="register-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              className="auth-input"
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              className="auth-input"
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </section>
    </main>
  );
}

export default Register;
