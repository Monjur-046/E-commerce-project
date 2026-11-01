
function Navbar({ cartCount, onOpenCart, onSearch }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Kichu Kinben homepage">
        <img src="/logo.png" alt="Kichu Kinben" className="brand-logo" />
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#products">Categories</a>
        <a href="#products">Shop</a>
        <a href="#about">About</a>
      </nav>

      <div className="header-actions">
        <button
          className="header-search-button"
          type="button"
          aria-label="Search products"
          onClick={onSearch}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.2 4.2" />
          </svg>
        </button>

        <a href="#account" className="account-link" aria-label="Account">
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 21a7 7 0 0 1 14 0" />
          </svg>
        </a>

        <button
          className="cart-trigger"
          type="button"
          aria-label={`Open cart, ${cartCount} items`}
          onClick={onOpenCart}
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8h14l1 13H4L5 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          <span>{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
