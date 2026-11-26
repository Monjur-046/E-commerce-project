
import { useEffect, useState } from "react";
import { formatPrice } from "../data/products";

function ProductQuickView({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const stock = Number(product?.stock) || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAddToCart = async () => {
    try {
      setAdding(true);

      for (let i = 0; i < quantity; i++) {
        await onAddToCart(product);
      }

      onClose();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="quick-view-overlay"
      onClick={onClose}
    >
      <div
        className="quick-view-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="quick-view-close"
          type="button"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>

        <div className="quick-view-image">
          <img src={product.image} alt={product.name} />

          {product.tag && (
            <span className="product-tag">{product.tag}</span>
          )}
        </div>

        <div className="quick-view-details">
          <p className="product-category">{product.category}</p>

          <h2 id="quick-view-title">{product.name}</h2>

          <div className="quick-view-price">
            <strong>{formatPrice(product.price)}</strong>

            {product.oldPrice && (
              <del>{formatPrice(product.oldPrice)}</del>
            )}
          </div>

          <div className="quick-view-description">
            <h3>Product Description</h3>
            <p>
              {product.description || "No description available for this product."}
            </p>
          </div>

          <div className="quick-view-stock">
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
          </div>

          {!isOutOfStock && (
            <div className="quick-view-quantity">
              <span>Quantity</span>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1 || adding}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
                  disabled={quantity >= stock || adding}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            className="quick-view-add-button"
            type="button"
            disabled={isOutOfStock || adding}
            onClick={handleAddToCart}
          >
            {isOutOfStock
              ? "Out of Stock"
              : adding
                ? "Adding..."
                : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductQuickView;
