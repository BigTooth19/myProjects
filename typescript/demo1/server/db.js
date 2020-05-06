const express = require('express');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);

app.use(session({
　　secret: 'keyboard cat',
　　resave: false,
　　saveUninitialized: true,
　　rolling:true,
　　cookie:{
    　　maxAge: 1000*3600*24
    },
    store: new MongoStore({
    　　url: 'mongodb://127.0.0.1:27017/login',
    　　touchAfter: 24 * 3600 // time period in seconds
    })
}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ts-demo1', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true
});

module.exports = {
    app,
    mongoose
}