
import { categories } from "../data/products";

function ProductSearch({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  resultCount,
}) {
  return (
    <div className="product-discovery">
      <label className="product-search-box" htmlFor="product-search">
        <span aria-hidden="true">⌕</span>

        <input
          id="product-search"
          type="search"
          placeholder="Search products or categories..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        {searchQuery && (
          <button
            type="button"
            className="clear-search-button"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
          >
            ×
          </button>
        )}
      </label>

      <div className="filter-row" aria-label="Filter by category">
        <span className="filter-label">Category</span>

        <div className="filter-buttons">
          <button
            className={`filter-chip ${
              selectedCategory === "All" ? "active" : ""
            }`}
            type="button"
            aria-pressed={selectedCategory === "All"}
            onClick={() => onCategoryChange("All")}
          >
            All products
          </button>

          {categories.map((category) => (
            <button
              className={`filter-chip ${
                selectedCategory === category.name ? "active" : ""
              }`}
              type="button"
              key={category.name}
              aria-pressed={selectedCategory === category.name}
              onClick={() => onCategoryChange(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <p className="search-results-count" aria-live="polite">
        {resultCount} {resultCount === 1 ? "product" : "products"} found
        {selectedCategory !== "All" && ` in ${selectedCategory}`}
        {searchQuery.trim() && ` for "${searchQuery.trim()}"`}
      </p>
    </div>
  );
}

export default ProductSearch;
