
import { categories } from "../data/products";

function CategorySection({ selectedCategory, onChooseCategory }) {
  return (
    <section className="category-section section-pad" id="categories">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FIND YOUR ESSENTIALS</p>
          <h2>
            Shop by category<span>.</span>
          </h2>
        </div>

        <button
          className="text-link category-reset-link"
          type="button"
          onClick={() => onChooseCategory("All")}
        >
          View all products ↗
        </button>
      </div>

      <div className="category-grid">
        {categories.map((category, index) => (
          <button
            className={`category-card ${
              selectedCategory === category.name ? "is-selected" : ""
            }`}
            type="button"
            key={category.name}
            aria-pressed={selectedCategory === category.name}
            onClick={() => onChooseCategory(category.name)}
          >
            <span className="category-number">0{index + 1}</span>
            <span className="category-symbol">{category.symbol}</span>
            <span className="category-name">{category.name}</span>
            <span className="category-arrow">↗</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
