
const mongoose = require('mongoose');
const crypto = require('crypto');

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const initiatePayment = async (req, res) => {
    const session = await mongoose.startSession();
    let createdOrder;

    try {
        const {
            fullName,
            email,
            phone,
            address,
            city,
            postalCode,
            deliveryMethod
        } = req.body;

        if (
            !fullName ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !postalCode ||
            !deliveryMethod
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all shipping information'
            });
        }

        if (!['standard', 'express'].includes(deliveryMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid delivery method'
            });
        }

        if (
            !process.env.AAMARPAY_STORE_ID ||
            !process.env.AAMARPAY_SIGNATURE_KEY ||
            !process.env.AAMARPAY_BASE_URL ||
            !process.env.BACKEND_PUBLIC_URL ||
            !process.env.FRONTEND_URL
        ) {
            return res.status(500).json({
                success: false,
                message: 'Payment gateway configuration is incomplete'
            });
        }

        const transactionId =
            `KK${Date.now()}${crypto.randomBytes(4).toString('hex')}`;

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
                const product = await Product.findById(
                    item.product
                ).session(session);

                if (!product) {
                    throw new Error(
                        'A product in your cart is no longer available'
                    );
                }

                if (
                    !Number.isInteger(item.quantity) ||
                    item.quantity < 1
                ) {
                    throw new Error('Invalid product quantity');
                }

                if (product.stock < item.quantity) {
                    throw new Error(
                        `${product.name} has insufficient stock`
                    );
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

            const deliveryCharge =
                deliveryMethod === 'express' ? 150 : 120;

            const total = Number(
                (subtotal + deliveryCharge).toFixed(2)
            );

            for (const item of cart.items) {
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        stock: { $gte: item.quantity }
                    },
                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if (!updatedProduct) {
                    throw new Error(
                        'Product stock changed. Please review your cart'
                    );
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
                paymentMethod: 'online',
                paymentStatus: 'pending',
                paymentGateway: 'aamarpay',
                transactionId,
                stockReserved: true,
                orderStatus: 'pending',
                subtotal,
                deliveryCharge,
                total
            }], { session });

            createdOrder = orders[0];
        });

        const backendUrl =
            process.env.BACKEND_PUBLIC_URL.replace(/\/+$/, '');

        const paymentData = {
            store_id: process.env.AAMARPAY_STORE_ID,
            signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
            tran_id: transactionId,
            amount: createdOrder.total.toFixed(2),
            currency: 'BDT',
            desc: `KICHU KINBEN Order ${createdOrder._id}`,
            cus_name: fullName,
            cus_email: email,
            cus_phone: phone,
            cus_add1: address,
            cus_city: city,
            cus_country: 'Bangladesh',
            success_url: `${backendUrl}/api/payments/success?tran_id=${encodeURIComponent(transactionId)}`,
            fail_url: `${backendUrl}/api/payments/fail?tran_id=${encodeURIComponent(transactionId)}`,
            cancel_url: `${backendUrl}/api/payments/cancel?tran_id=${encodeURIComponent(transactionId)}`,
            type: 'json',
            opt_a: createdOrder._id.toString()
        };

        const gatewayResponse = await fetch(
            process.env.AAMARPAY_BASE_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            }
        );

        const gatewayData = await gatewayResponse.json();

        if (
            !gatewayResponse.ok ||
            String(gatewayData.result).toLowerCase() !== 'true' ||
            !gatewayData.payment_url
        ) {
            throw new Error(
                'Unable to initialize aamarPay payment'
            );
        }

        await Cart.updateOne(
            { user: req.user._id },
            { $set: { items: [] } }
        );

        return res.status(200).json({
            success: true,
            message: 'Payment initialized successfully',
            paymentUrl: gatewayData.payment_url,
            orderId: createdOrder._id
        });

    } catch (error) {
        console.error(
            'Payment initiation error:',
            error.message
        );

        if (createdOrder) {
            try {
                await restoreReservedStock(
                    createdOrder._id,
                    'failed'
                );
            } catch (restoreError) {
                console.error(
                    'Stock restoration failed:',
                    restoreError.message
                );
            }
        }

        return res.status(400).json({
            success: false,
            message: error.message ||
                'Unable to initialize payment'
        });

    } finally {
        await session.endSession();
    }
};

const restoreReservedStock = async (orderId, paymentStatus) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const order = await Order.findOne({
                _id: orderId,
                paymentStatus: { $ne: 'paid' }
            }).session(session);

            if (!order) {
                return;
            }

            if (order.stockReserved) {
                for (const item of order.items) {
                    const product = await Product.findByIdAndUpdate(
                        item.product,
                        {
                            $inc: {
                                stock: item.quantity
                            }
                        },
                        { session }
                    );

                    if (!product) {
                        throw new Error(
                            `Product not found: ${item.name}`
                        );
                    }
                }
            }

            order.stockReserved = false;
            order.paymentStatus = paymentStatus;
            order.orderStatus = 'cancelled';

            await order.save({ session });
        });
    } finally {
        await session.endSession();
    }
};

const verifyGatewayTransaction = async (transactionId) => {
    const params = new URLSearchParams({
        request_id: transactionId,
        store_id: process.env.AAMARPAY_STORE_ID,
        signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
        type: 'json'
    });

    const response = await fetch(
        `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            'Unable to verify gateway transaction'
        );
    }

    return response.json();
};

const processGatewayCallback = async (
    req,
    res,
    callbackType
) => {
    const frontendUrl = (
        process.env.FRONTEND_URL ||
        'http://localhost:5173'
    ).replace(/\/+$/, '');

    let order;

    try {
        const body = req.body || {};

        const transactionId =
            body.mer_txnid ||
            body.tran_id ||
            req.query?.tran_id;

        if (!transactionId) {
            return res.redirect(`${frontendUrl}/`);
        }

        order = await Order.findOne({
            transactionId,
            paymentGateway: 'aamarpay'
        });

        if (!order) {
            return res.redirect(`${frontendUrl}/`);
        }

        const gatewayData =
            await verifyGatewayTransaction(transactionId);

        const verifiedTransactionId = String(
            gatewayData.mer_txnid || ''
        );

        const statusCode = String(
            gatewayData.status_code || ''
        );

        const gatewayAmount = Number(
            gatewayData.amount_bdt ?? gatewayData.amount
        );

        const amountMatches =
            Number.isFinite(gatewayAmount) &&
            gatewayAmount.toFixed(2) ===
                order.total.toFixed(2);

        const transactionMatches =
            verifiedTransactionId === order.transactionId;

        const currencyMatches =
            String(gatewayData.currency || '')
                .toUpperCase() === 'BDT';

        const storeMatches =
            !gatewayData.store_id ||
            String(gatewayData.store_id) ===
                String(process.env.AAMARPAY_STORE_ID);

        if (
            !transactionMatches ||
            !amountMatches ||
            !currencyMatches ||
            !storeMatches
        ) {
            console.error(
                'Gateway verification mismatch:',
                transactionId
            );

            return res.redirect(
                `${frontendUrl}/order-confirmation?orderId=${order._id}&payment=pending`
            );
        }

        const payStatus = String(
            gatewayData.pay_status || ''
        ).toLowerCase();

        if (
            statusCode === '2' &&
            payStatus === 'successful'
        ) {
            const session = await mongoose.startSession();
            let latePayment = false;

            try {
                await session.withTransaction(async () => {
                    const currentOrder = await Order.findOne({
                        transactionId,
                        paymentGateway: 'aamarpay'
                    }).session(session);

                    if (!currentOrder) {
                        throw new Error('Order not found');
                    }

                    latePayment =
                        currentOrder.orderStatus === 'cancelled';

                    if (currentOrder.paymentStatus !== 'paid') {
                        currentOrder.paymentStatus = 'paid';

                        currentOrder.gatewayTransactionId =
                            gatewayData.pg_txnid || '';

                        if (!latePayment) {
                            currentOrder.orderStatus = 'pending';
                        }

                        await currentOrder.save({ session });
                    }
                });
            } finally {
                await session.endSession();
            }

            return res.redirect(
                `${frontendUrl}/order-confirmation?orderId=${order._id}&payment=${latePayment ? 'late-success' : 'success'}`
            );
        }

        if (statusCode === '3') {
            await restoreReservedStock(
                order._id,
                'cancelled'
            );

            return res.redirect(
                `${frontendUrl}/order-confirmation?orderId=${order._id}&payment=cancelled`
            );
        }

        if (statusCode === '7') {
            await restoreReservedStock(
                order._id,
                'failed'
            );

            return res.redirect(
                `${frontendUrl}/order-confirmation?orderId=${order._id}&payment=failed`
            );
        }

        return res.redirect(
            `${frontendUrl}/order-confirmation?orderId=${order._id}&payment=pending`
        );

    } catch (error) {
        console.error(
            'Payment callback error:',
            error.message
        );

        if (order) {
            return res.redirect(
                `${frontendUrl}/order-confirmation?orderId=${order._id}&payment=pending`
            );
        }

        return res.redirect(`${frontendUrl}/`);
    }
};

const paymentSuccess = (req, res) => {
    return processGatewayCallback(
        req,
        res,
        'success'
    );
};

const paymentFail = (req, res) => {
    return processGatewayCallback(
        req,
        res,
        'fail'
    );
};

const paymentCancel = (req, res) => {
    return processGatewayCallback(
        req,
        res,
        'cancel'
    );
};

module.exports = {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel
};
