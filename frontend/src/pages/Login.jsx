import './Login.css';
import {useState} from 'react';
import {Link} from 'react-router-dom';

function Login(){
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      'The login form is ready. Backend authentication is not connected yet.'
    );
  }

    
  return (
    
    <main className="auth-page">
      <section className="auth-card">
        <h1> WELCOME BACK </h1>
        <p>Sign in to your account to continue shopping.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          
          </div>

          <button type="submit">Sign In</button>

          {message && <p role="status">{message}</p>}
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;