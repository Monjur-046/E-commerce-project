
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

function Profile() {
  const {user} = useContext(AuthContext);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>My Profile</h1>
        <p>Welcome, {user.name}!</p>

        <div className="form-group">
          <label>Full Name</label>
          <p>{user.name}</p>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <p>{user.email}</p>
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <p>{user.role}</p>
        </div>
      </section>
    </main>
  );
}

export default Profile;
