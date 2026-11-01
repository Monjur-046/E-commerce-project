
import ProductCard from "./ProductCard";
import ProductSearch from "./ProductSearch";

function ProductSection({
  products,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  onResetFilters,
}) {
  return (
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

        <button
          className="text-link shop-all-button"
          type="button"
          onClick={onResetFilters}
        >
          Shop all products ↗
        </button>
      </div>

      <ProductSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        resultCount={products.length}
      />

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
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
            type="button"
            onClick={onResetFilters}
          >
            Clear search and filters
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductSection;
