const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
    'mongodb://localhost:27017/node-shop', {
         //useMongoClient:true
     })

// middleware - handle requests


// log basic request stats to console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // client is asking if a certain request -- usually a PUT or POST -- is allowed
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET, PUT, POST, PATCH, DELETE' );

        // No need to let this req through to the router, we can return here
        return res.status(200).json({});
    }
    
    next();
})

// more middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next ) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// handle errors thrown anywhere else in the app - note the additional 1st param
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;