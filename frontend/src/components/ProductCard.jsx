
import { formatPrice } from "../data/products";

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
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
        onClick={() => onAddToCart(product)}
      >
        Add to cart <span>+</span>
      </button>
    </article>
  );
}

export default ProductCard;
