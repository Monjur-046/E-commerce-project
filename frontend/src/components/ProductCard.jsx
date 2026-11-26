
import { formatPrice } from "../data/products";

function ProductCard({ product, onAddToCart, onViewDetails }) {
  console.log("ProductCard callback:", typeof onViewDetails);
  const stock = Number(product.stock) || 0;

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <article className="product-card">
      <button
        className="product-image"
        type="button"
        aria-label={`View details of ${product.name}`}
        onClick={() => onViewDetails(product)}
        style={{
          width: "100%",
          padding: 0,
          border: 0,
          textAlign: "left",
          cursor: "pointer"
        }}
      >
        <img src={product.image} alt={product.name} />

        {product.tag && (
          <span className="product-tag">{product.tag}</span>
        )}

        {isOutOfStock && (
          <span className="product-tag">Out of Stock</span>
        )}
      </button>

      <div className="product-info">
        <div>
          <p className="product-category">{product.category}</p>

          <button
            type="button"
            onClick={() => onViewDetails(product)}
            style={{
              display: "block",
              padding: 0,
              border: 0,
              background: "transparent",
              color: "inherit",
              textAlign: "left",
              font: "inherit",
              cursor: "pointer"
            }}
          >
            <h3>{product.name}</h3>
          </button>

          <p className="product-stock">
            {isOutOfStock ? (
              <span className="stock-out">Out of stock</span>
            ) : isLowStock ? (
              <span className="stock-low">
                Only {stock} left in stock
              </span>
            ) : (
              <span className="stock-available">
                Available stock: {stock}
              </span>
            )}
          </p>
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
        disabled={isOutOfStock}
        onClick={() => onAddToCart(product)}
      >
        {isOutOfStock ? (
          "Out of Stock"
        ) : (
          <>
            Add to cart <span>+</span>
          </>
        )}
      </button>
    </article>
  );
}

export default ProductCard;
