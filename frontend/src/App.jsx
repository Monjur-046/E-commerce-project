
import { useState, useEffect, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";
import { API_BASE_URL } from "./config/api";
import "./App.css";
import Announcement from "./components/Announcement";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import ProductSection from "./components/ProductSection";
import EditorialSection from "./components/EditorialSection";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProductQuickView from "./components/ProductQuickView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Shop from "./pages/Shop";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        setProducts(
          data.products.map((product) => ({
            ...product,
            id: product._id
          }))
        );
      } catch (error) {
        console.error("Failed to load homepage products:", error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    ...new Set(
      products
        .map((product) => product.category?.trim())
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b));

  const filteredProducts = products
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((product) => {
      const matchesSearch = `${product.name} ${product.category}`
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.trim() === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .slice(0, 8);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth"
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

  const exploreProducts = () => {
    setIsCartOpen(false);
    scrollToProducts();
  };

  const handleAddToCart = async (product) => {
    await addToCart(product);
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

        <ProductSection
          products={filteredProducts}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={handleAddToCart}
          onViewDetails={setSelectedProduct}
          onResetFilters={resetFilters}
        />

        <EditorialSection />
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

      <ProductQuickView
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-confirmation"
        element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
