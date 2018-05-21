const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message:'handling GET request to /products'
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(id=='special') {
        res.status(200).json({
            message:'you found the special id'
        })
    } else {
        res.status(200).json({
            message:'handling GET request to /product/'+id
        })
    }
    
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message:'handling PATCH request to /product/'+id
    })
    
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message:'handling DELETE request to /product/'+id
    })
    
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message:'handling POST request to /products',
        createdProduct: product
    })
})

module.exports = router;