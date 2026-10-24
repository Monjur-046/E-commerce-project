import { Navigate, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';

function RegisterPlaceholder() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Create Account</h1>
        <p>We'll build your registration form next.</p>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPlaceholder />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;