
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: { items: [] }
            });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Valid product ID and quantity are required'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient product stock'
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            if (existingItem.quantity + quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Available stock limit reached'
                });
            }

            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a positive integer'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: 'Available stock limit reached'
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        item.quantity = quantity;

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await cart.save();

        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
};
