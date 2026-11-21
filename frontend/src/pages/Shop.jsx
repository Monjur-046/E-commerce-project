
import {useCallback, useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSearch from "../components/ProductSearch";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import {CartContext} from "../context/CartContext";
import "./Shop.css";

function Shop() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
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

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const handleAddToCart = async (product) => {
    await addToCart(product);
    await fetchProducts();
  };

  const handleSearch = () => {
    document.getElementById("product-search")?.focus();
  };

  const exploreProducts = () => {
    setIsCartOpen(false);
    document.getElementById("shop-products")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div className="site-shell">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={handleSearch}
      />

      <main className="shop-page section-pad" id="shop-products">
        <div className="shop-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Shop All Products</span>
        </div>

        <div className="shop-heading">
          <p className="eyebrow">EXPLORE OUR COLLECTION</p>
          <h1>Shop All Products<span>.</span></h1>
          <p>
            Discover everyday essentials, thoughtfully selected for you.
          </p>
        </div>

        {loading ? (
          <div className="shop-message">
            <h2>Loading products...</h2>
          </div>
        ) : error ? (
          <div className="shop-message">
            <h2>Unable to load products</h2>
            <p>{error}</p>
            <button
              className="button button-dark"
              onClick={fetchProducts}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <ProductSearch
              products={products}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              resultCount={filteredProducts.length}
            />

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="no-products-found">
                <span className="no-products-icon">⌕</span>
                <h3>No products found</h3>
                <p>
                  Try another search term or choose a different category.
                </p>
                <button
                  className="button button-dark"
                  onClick={resetFilters}
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </>
        )}
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

export default Shop;
