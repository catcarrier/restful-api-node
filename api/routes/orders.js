const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id quantity productId')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        productId: doc.productId,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                }),

            });
        })
        .catch(err => res.status(500).json({ error: err }));
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id productId quantity')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            return res.status(200).json(order);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {

    // confirm the product exists
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId() /* generate an id*/,
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save()
                .then(result => {
                    res.status(201).json({
                        message: 'Order created',
                        order: {
                            _id: result._id,
                            productId: result.productId,
                            quantity: result.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + result._id
                            }
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Product not found, or could not save your order',
                        error: err
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found, or could not save your order',
                error: err
            });
        })
})

router.delete('/:orderId', (req, res, next) => {
    // confirm the order exists
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            Order.remove({ _id: req.params.orderId })
                .exec()
                .then(result => {
                    return res.status(200).json({
                        message:'Order deleted'
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        });
});

module.exports = router;