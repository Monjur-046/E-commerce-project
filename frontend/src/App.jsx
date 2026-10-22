
import { useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Everyday Minimal Watch",
    category: "Accessories",
    price: 8900,
    oldPrice: 12000,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    tag: "BESTSELLER",
  },
  {
    id: 2,
    name: "Essential Leather Bag",
    category: "Bags",
    price: 12500,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
    tag: "NEW",
  },
  {
    id: 3,
    name: "Classic Everyday Sneakers",
    category: "Footwear",
    price: 95000,
    oldPrice: 115000,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    tag: "POPULAR",
  },
  {
    id: 4,
    name: "Modern Studio Headphones",
    category: "Electronics",
    price: 1490,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    tag: "",
  },
];

const categories = [
  { name: "Accessories", symbol: "◷" },
  { name: "Bags", symbol: "◇" },
  { name: "Footwear", symbol: "↗" },
  { name: "Electronics", symbol: "⌁" },
];

const formatPrice = (price) => `৳${price.toLocaleString("en-BD")}`;

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  return (
    <div className="site-shell">
      <div className="announcement">
        Thoughtful essentials. Everyday quality.
        <span> Explore the collection ↗</span>
      </div>

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
          <a href="#products" aria-label="Search products">
            ⌕
          </a>
          <a href="#account" aria-label="Account">
            ♙
          </a>
          <button
            className="cart-trigger"
            type="button"
            aria-label={`Open shopping bag, ${cartCount} items`}
            onClick={() => setIsCartOpen(true)}
          >
            Bag <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">THE EVERYDAY EDIT — 2026</p>

            <h1>
              Less, but
              <br />
              <em>better.</em>
            </h1>

            <p className="hero-description">
              Discover everyday essentials designed with intention,
              made for your style, and chosen to last.
            </p>

            <div className="hero-actions">
              <a className="button button-dark" href="#products">
                Explore collection <span>↗</span>
              </a>

              <a className="text-link" href="#about">
                Our philosophy
              </a>
            </div>

            <div className="hero-note">
              <span className="note-line" />
              CONSIDERED DESIGN. TIMELESS STYLE.
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90"
              alt="Curated fashion store interior"
            />

            <div className="image-caption">
              <span>THE NEW STANDARD</span>
              <span>01 / 04</span>
            </div>

            <div className="floating-note">
              <span className="floating-dot" />
              Curated for everyday living
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Store benefits">
          <div><span>✳</span> Thoughtfully selected</div>
          <div><span>↗</span> Secure checkout</div>
          <div><span>□</span> Easy returns</div>
          <div><span>♡</span> Made for everyday</div>
        </section>

        <section className="category-section section-pad" id="categories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR ESSENTIALS</p>
              <h2>
                Shop by category<span>.</span>
              </h2>
            </div>

            <a className="text-link" href="#products">
              View all categories ↗
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <a
                className="category-card"
                href="#products"
                key={category.name}
              >
                <span className="category-number">0{index + 1}</span>
                <span className="category-symbol">{category.symbol}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-arrow">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="products-section section-pad" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE CURRENT FAVOURITES</p>
              <h2>
                Considered essentials<span>.</span>
              </h2>
              <p className="section-description">
                Everyday pieces. Exceptional details.
              </p>
            </div>

            <a className="text-link" href="#products">
              Shop all products ↗
            </a>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <a
                  className="product-image"
                  href="#products"
                  aria-label={`View ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />

                  {product.tag && (
                    <span className="product-tag">{product.tag}</span>
                  )}
                </a>

                <div className="product-info">
                  <div>
                    <p className="product-category">{product.category}</p>
                    <h3>{product.name}</h3>
                  </div>

                  <div className="product-price">
                    <span>{formatPrice(product.price)}</span>

                    {product.oldPrice && (
                      <del>{formatPrice(product.oldPrice)}</del>
                    )}
                  </div>
                </div>

                <button
                  className="add-button"
                  type="button"
                  onClick={() => addToCart(product)}
                >
                  Add to cart <span>+</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="editorial-section section-pad" id="about">
          <div className="editorial-image">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
              alt="Timeless wardrobe collection"
            />
          </div>

          <div className="editorial-copy">
            <p className="eyebrow">A MORE CONSIDERED WAY TO SHOP</p>

            <h2>Good design is never just about looks.</h2>

            <p>
              We believe the things you choose should feel right,
              work beautifully, and fit naturally into your everyday
              life. Less noise. Better choices.
            </p>

            <a className="button button-dark" href="#products">
              Discover our approach <span>↗</span>
            </a>
          </div>
        </section>

        <section className="newsletter-section">
          <p className="eyebrow">A NOTE FROM US</p>
          <h2>Good things, occasionally.</h2>

          <p>
            New arrivals, thoughtful edits, and a little inspiration.
          </p>

          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              alert("Newsletter signup will be connected later!");
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              required
            />

            <button type="submit">Subscribe ↗</button>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-main">KICHU</span>
          <span className="brand-sub">KINBEN.</span>
        </a>

        <p>Apnar pochonder shopping destination.</p>

        <div className="footer-links">
          <a href="#products">Shop</a>
          <a href="#about">Our story</a>
          <a href="#account">Account</a>
        </div>

        <small>© 2026 KICHU KINBEN. All rights reserved.</small>
      </footer>

      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        >
          <aside
            className="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h2 id="cart-title">Shopping bag ({cartCount})</h2>
              </div>

              <button
                className="cart-close"
                type="button"
                aria-label="Close shopping bag"
                onClick={() => setIsCartOpen(false)}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon">◇</span>
                <h3>Your bag is empty</h3>
                <p>Discover something you love and add it to your bag.</p>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    document.getElementById("products")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Explore products ↗
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-info">
                        <p className="product-category">{item.category}</p>
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">
                          {formatPrice(item.price)}
                        </p>

                        <div className="cart-item-controls">
                          <div className="quantity-control">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.name} quantity`}
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              type="button"
                              aria-label={`Increase ${item.name} quantity`}
                              onClick={() => increaseQuantity(item.id)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-item"
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <p className="cart-line-total">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>

                  <p className="cart-shipping-note">
                    Delivery charges are calculated at checkout.
                  </p>

                  <button
                    className="button button-dark cart-checkout"
                    type="button"
                    onClick={() =>
                      alert("Checkout will be connected later!")
                    }
                  >
                    Proceed to checkout <span>↗</span>
                  </button>

                  <button
                    className="continue-shopping"
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
