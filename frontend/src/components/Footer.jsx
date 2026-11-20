
import {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

function Footer() {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  const accountPath = !user
    ? '/login'
    : user.role === 'admin'
      ? '/admin'
      : '/profile';

  const handleSectionClick = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" to="/">
        <span className="brand-main">KICHU</span>
        <span className="brand-sub">KINBEN.</span>
      </Link>

      <p>Apnar pochonder shopping destination.</p>

      <div className="footer-links">
        <a href="#products" onClick={(e) => {
          e.preventDefault();
          handleSectionClick('products');
        }}>
          Shop
        </a>

        <a href="#about" onClick={(e) => {
          e.preventDefault();
          handleSectionClick('about');
        }}>
          Our story
        </a>

        <Link to={accountPath}>Account</Link>
      </div>

      <small>© 2026 KICHU KINBEN. All rights reserved.</small>
    </footer>
  );
}

export default Footer;
