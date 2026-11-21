
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Footer() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAccount = () => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" to="/">
        <span className="brand-main"> KICHU </span>
        <span className="brand-sub"> KINBEN.</span>
      </Link>

      <p>Apnar pochonder shopping destination.</p>

      <div className="footer-links">
        <Link to="/shop">Shop</Link>
        <Link to="/#about">Our story</Link>
        <button
          type="button"
          onClick={handleAccount}
          className="footer-account-link"
        >
          Account
        </button>
      </div>

      <small>© 2026 KICHU KINBEN. All rights reserved.</small>
    </footer>
  );
}

export default Footer;
