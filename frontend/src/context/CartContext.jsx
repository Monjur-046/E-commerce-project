
import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {AuthContext} from './AuthContext';

export const CartContext = createContext(null);

function formatCartItems(items) {
  return items.map((item) => ({
    ...item.product,
    id: item.product._id,
    quantity: item.quantity
  }));
}

export function CartProvider({children}) {
  const {user} = useContext(AuthContext);
  const token = localStorage.getItem('token');

  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user || !token) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load cart');
      }

      setCart(formatCartItems(data.cart.items));
    } catch (error) {
      console.error('Cart loading error:', error.message);
    }
  }, [user, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    const productId = product.id || product._id;

    if (product.stock <= 0) {
      alert('This product is out of stock!');
      return;
    }

    if (user && token) {
      try {
        const response = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productId,
            quantity: 1
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to add product');
        }

        setCart(formatCartItems(data.cart.items));
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === productId
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert('Available stock limit reached!');
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === productId
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }

      return [...currentCart, {...product, id: productId, quantity: 1}];
    });
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (user && token) {
      try {
        const isRemoving = quantity === 0;

        const response = await fetch(
          isRemoving
            ? `http://localhost:5000/api/cart/remove/${productId}`
            : `http://localhost:5000/api/cart/update/${productId}`,
          {
            method: isRemoving ? 'DELETE' : 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            ...(!isRemoving && {
              body: JSON.stringify({quantity})
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update cart');
        }

        setCart(formatCartItems(data.cart.items));
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {...item, quantity}
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const increaseQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    if (item.quantity >= item.stock) {
      alert('Available stock limit reached!');
      return;
    }

    updateCartQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    updateCartQuantity(productId, item.quantity - 1);
  };

  const removeFromCart = (productId) => {
    updateCartQuantity(productId, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
