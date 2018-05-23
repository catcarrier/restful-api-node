const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Fetched order ' + id
    })
});


router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId() /* generate an id*/,
        productId: req.body.productId,
        quantity: req.body.quantity
    });
    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order created',
                order: {
                    _id: result._id,
                    productId: result.productId,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url : 'http://localhost:3000/orders/'+result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Order ' + id + ' deleted'
    })
});

module.exports = router;