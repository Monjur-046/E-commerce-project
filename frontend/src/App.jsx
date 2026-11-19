
import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {
  return (
    <Routes>
      {/* Sohan's storefront */}
      <Route path="/" element={<Home />} />

      {/* Monjur's account pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect unknown pages to the homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
