
import {useState, useEffect, useContext, useCallback} from "react";
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
import {CartContext} from "./context/CartContext";

function Home() {
  const {user} = useContext(AuthContext);

  const {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products/home");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      const formattedProducts = data.products.map((product) => ({
        ...product,
        id: product._id
      }));

      setProducts(formattedProducts);
      setProductsError("");
    } catch (error) {
      setProductsError(error.message);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    await fetchProducts();
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
            onAddToCart={handleAddToCart}
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
