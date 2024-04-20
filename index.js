const express = require('express');
import adminRouter from './routers/admin.router';
import userRouter from './routers/user.router';
import categoryRouter from './routers/category.router';
import productRouter from './routers/product.router';
import cartRouter from './routers/cart.router';
import cookieParser from 'cookie-parser';
import cors from 'cors'
require('./db/connect');
require('dotenv').config();

const app = express();


const port = 8001;




// middleware
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(cookieParser())


var whitelist = ['https://e-products.onrender.com/','https://admin.onrender.com/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue : false,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// var corsOptions = {
//   origin: ["https://e-products.onrender.com/","https://admin.onrender.com/"],
//   credentials: true,
//   methods : "GET,HEAD,PUT,PATCH,POST,DELETE",

//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(cors(corsOptions))

// routing

app.use('/apiv1/admin', adminRouter);
app.use('/apiv1/user', userRouter);
app.use('/apiv1/category',categoryRouter);
app.use('/apiv1/products', productRouter);
app.use('/apiv1/cart',cartRouter);



app.listen(port, ()=> {
    console.log(`connected on port ${port}`);
})