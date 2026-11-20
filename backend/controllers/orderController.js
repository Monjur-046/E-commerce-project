
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {
            fullName,
            email,
            phone,
            address,
            city,
            postalCode,
            deliveryMethod,
            paymentMethod
        } = req.body;

        if (
            !fullName ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !postalCode ||
            !deliveryMethod ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all shipping and payment information'
            });
        }

        if (!['standard', 'express'].includes(deliveryMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid delivery method'
            });
        }

        if (!['cod', 'online'].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            });
        }

        let createdOrder;

        await session.withTransaction(async () => {
            const cart = await Cart.findOne({
                user: req.user._id
            }).session(session);

            if (!cart || cart.items.length === 0) {
                throw new Error('Your cart is empty');
            }

            const orderItems = [];
            let subtotal = 0;

            for (const item of cart.items) {
                const product = await Product.findById(item.product).session(session);

                if (!product) {
                    throw new Error('A product in your cart is no longer available');
                }

                if (product.stock < item.quantity) {
                    throw new Error(`${product.name} has insufficient stock`);
                }

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity: item.quantity
                });

                subtotal += product.price * item.quantity;
            }

            const deliveryCharge = deliveryMethod === 'express' ? 150 : 120;
            const total = subtotal + deliveryCharge;

            if (paymentMethod === 'cod') {
                for (const item of cart.items) {
                    const updatedProduct = await Product.findOneAndUpdate(
                        {
                            _id: item.product,
                            stock: { $gte: item.quantity }
                        },
                        {
                            $inc: { stock: -item.quantity }
                        },
                        {
                            new: true,
                            session
                        }
                    );

                    if (!updatedProduct) {
                        throw new Error('Product stock changed. Please review your cart');
                    }
                }
            }

            const orders = await Order.create([{
                user: req.user._id,
                items: orderItems,
                shippingAddress: {
                    fullName,
                    email,
                    phone,
                    address,
                    city,
                    postalCode
                },
                deliveryMethod,
                paymentMethod,
                paymentStatus: 'pending',
                orderStatus: 'pending',
                subtotal,
                deliveryCharge,
                total
            }], { session });

            createdOrder = orders[0];

            await Cart.updateOne(
                { user: req.user._id },
                { $set: { items: [] } },
                { session }
            );
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: createdOrder
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Unable to place order'
        });
    } finally {
        await session.endSession();
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch orders'
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID'
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch order'
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch all orders'
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {orderStatus} = req.body;

        const allowedStatuses = [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ];

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID'
            });
        }

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        await session.withTransaction(async () => {
            const order = await Order.findById(req.params.id).session(session);

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.orderStatus === 'cancelled' && orderStatus !== 'cancelled') {
                throw new Error('Cancelled orders cannot be reopened');
            }

            if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
                if (order.paymentMethod === 'cod') {
                    for (const item of order.items) {
                        await Product.findByIdAndUpdate(
                            item.product,
                            {
                                $inc: {stock: item.quantity}
                            },
                            {session}
                        );
                    }
                }
            }

            order.orderStatus = orderStatus;
            await order.save({session});
        });

        const updatedOrder = await Order.findById(req.params.id)
            .populate('user', 'name email');

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Unable to update order status'
        });
    } finally {
        await session.endSession();
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
