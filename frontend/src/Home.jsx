
import {useState, useEffect, useContext} from "react";
import "./App.css";
import Announcement from "./components/Announcement";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import ProductSection from "./components/ProductSection";
import EditorialSection from "./components/EditorialSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import {AuthContext} from "./context/AuthContext";

function Home() {
  const {user} = useContext(AuthContext);
  const token = localStorage.getItem('token');

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load products');
        }

        const formattedProducts = data.products.map((product) => ({
          ...product,
          id: product._id
        }));

        setProducts(formattedProducts);
      } catch (error) {
        setProductsError(error.message);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !token) {
        setCart([]);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load cart');
        }

        const formattedCart = data.cart.items.map((item) => ({
          ...item.product,
          id: item.product._id,
          quantity: item.quantity
        }));

        setCart(formattedCart);
      } catch (error) {
        console.error('Cart loading error:', error.message);
      }
    };

    fetchCart();
  }, [user, token]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSearch = () => {
    scrollToProducts();
    document.getElementById("product-search")?.focus();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const addToCart = async (product) => {
    if (product.stock <= 0) {
      alert('This product is out of stock!');
      return;
    }

    if (user && token) {
      try {
        const response = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to add product');
        }

        const formattedCart = data.cart.items.map((item) => ({
          ...item.product,
          id: item.product._id,
          quantity: item.quantity
        }));

        setCart(formattedCart);
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert('Available stock limit reached!');
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }

      return [...currentCart, {...product, quantity: 1}];
    });
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (user && token) {
      try {
        const isRemoving = quantity === 0;

        const response = await fetch(
          isRemoving
            ? `http://localhost:5000/api/cart/remove/${productId}`
            : `http://localhost:5000/api/cart/update/${productId}`,
          {
            method: isRemoving ? 'DELETE' : 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            ...(!isRemoving && {
              body: JSON.stringify({quantity})
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update cart');
        }

        const formattedCart = data.cart.items.map((item) => ({
          ...item.product,
          id: item.product._id,
          quantity: item.quantity
        }));

        setCart(formattedCart);
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {...item, quantity}
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const increaseQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    if (item.quantity >= item.stock) {
      alert('Available stock limit reached!');
      return;
    }

    updateCartQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    updateCartQuantity(productId, item.quantity - 1);
  };

  const removeFromCart = (productId) => {
    updateCartQuantity(productId, 0);
  };

  const exploreProducts = () => {
    setIsCartOpen(false);
    scrollToProducts();
  };

  return (
    <div className="site-shell">
      <Announcement />

      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={handleSearch}
      />

      <main>
        <Hero />
        <TrustStrip />

        {productsLoading ? (
          <section className="products-section section-pad" id="products">
            <h2>Loading products...</h2>
          </section>
        ) : productsError ? (
          <section className="products-section section-pad" id="products">
            <h2>Unable to load products</h2>
            <p>{productsError}</p>
          </section>
        ) : (
          <ProductSection
            products={filteredProducts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddToCart={addToCart}
            onResetFilters={resetFilters}
          />
        )}

        <EditorialSection />
        <Newsletter />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onClose={() => setIsCartOpen(false)}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
        onExploreProducts={exploreProducts}
      />
    </div>
  );
}

export default Home;
