const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const createHttpError = require('http-errors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));

app.get('/hello', (req, res) => {
    res.send("heelos api")
})
app.use('/api/auth', require('./src/routes/authRoute'));
app.use('/api/users', require('./src/routes/userRoute'));
app.use('/api/products', require('./src/routes/productsRoute'));

app.use((req, res, next) => {
    next(createHttpError.NotFound())
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
     error: {
     status: error.status || 500,
     message: error.message || "Internal Server Error",
    },
 });
});

mongoose.connect(process.env.DB_CONNECT , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("connection successfull"));

app.listen(PORT, () => {
    console.log(`Server is listening on port : ${PORT}`);
})
// $env:NODE_ENV="development"  
//set the environment variable first