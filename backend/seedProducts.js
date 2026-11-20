
require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        name: 'Everyday Minimal Watch',
        description: 'Minimal everyday wrist watch.',
        category: 'Accessories',
        price: 8900,
        oldPrice: 12000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85',
        tag: 'BESTSELLER',
        stock: 10
    },
    {
        name: 'Essential Leather Bag',
        description: 'Elegant essential leather bag.',
        category: 'Bags',
        price: 12500,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85',
        tag: 'NEW',
        stock: 10
    },
    {
        name: 'Classic Everyday Sneakers',
        description: 'Classic everyday sneakers.',
        category: 'Footwear',
        price: 95000,
        oldPrice: 115000,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85',
        tag: 'POPULAR',
        stock: 10
    },
    {
        name: 'Modern Studio Headphones',
        description: 'Modern studio headphones.',
        category: 'Electronics',
        price: 1490,
        oldPrice: null,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85',
        tag: '',
        stock: 10
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingProducts = await Product.countDocuments();

        if (existingProducts > 0) {
            console.log('Products already exist. No products were added.');
            return;
        }

        await Product.insertMany(products);

        console.log('4 demo products added successfully!');
    } catch (error) {
        console.error(error.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedProducts();
