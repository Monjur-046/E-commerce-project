
function Navbar({ cartCount, onOpenCart, onSearch }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Kichu Kinben homepage">
        <span className="brand-main">KICHU</span>
        <span className="brand-sub">KINBEN.</span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#categories">Categories</a>
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
          ⌕
        </button>

        <a href="#account" aria-label="Account">
          ♙
        </a>

        <button
          className="cart-trigger"
          type="button"
          aria-label={`Open cart, ${cartCount} items`}
          onClick={onOpenCart}
        >
          Cart <span>{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
