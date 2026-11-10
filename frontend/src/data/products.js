
export const products = [
  {
    id: 1,
    name: "Everyday Minimal Watch",
    category: "Accessories",
    price: 8900,
    oldPrice: 12000,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    tag: "BESTSELLER",
  },
  {
    id: 2,
    name: "Essential Leather Bag",
    category: "Bags",
    price: 12500,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
    tag: "NEW",
  },
  {
    id: 3,
    name: "Classic Everyday Sneakers",
    category: "Footwear",
    price: 95000,
    oldPrice: 115000,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    tag: "POPULAR",
  },
  {
    id: 4,
    name: "Modern Studio Headphones",
    category: "Electronics",
    price: 1490,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    tag: "",
  },
];

export const categories = [
  { name: "Accessories", symbol: "◷" },
  { name: "Bags", symbol: "◇" },
  { name: "Footwear", symbol: "↗" },
  { name: "Electronics", symbol: "⌁" },
];

export const formatPrice = (price) =>
  `৳${price.toLocaleString("en-BD")}`;
