
import { formatPrice } from "../data/products";

function CartDrawer({
  isOpen,
  cart,
  cartCount,
  cartTotal,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onExploreProducts,
}) {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-header">
          <div>
            <p className="eyebrow">YOUR SELECTION</p>
            <h2 id="cart-title">Cart ({cartCount})</h2>
          </div>

          <button
            className="cart-close"
            type="button"
            aria-label="Close cart"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">◇</span>
            <h3>Your cart is empty</h3>
            <p>Discover something you love and add it to your cart.</p>

            <button
              className="button button-dark"
              type="button"
              onClick={onExploreProducts}
            >
              Explore products ↗
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <p className="product-category">{item.category}</p>
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">
                      {formatPrice(item.price)}
                    </p>

                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => onDecrease(item.id)}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => onIncrease(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-item"
                        type="button"
                        onClick={() => onRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="cart-line-total">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </article>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <p className="cart-shipping-note">
                Delivery charges are calculated at checkout.
              </p>

              <button
                className="button button-dark cart-checkout"
                type="button"
                onClick={() => alert("Checkout will be connected later!")}
              >
                Proceed to checkout <span>↗</span>
              </button>

              <button
                className="continue-shopping"
                type="button"
                onClick={onClose}
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
