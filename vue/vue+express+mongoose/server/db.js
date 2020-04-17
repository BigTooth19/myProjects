const express = require('express');
const app = express();

app.use(require('cors')());
app.use(express.json());
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vue-demo1', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true
});

module.exports = {
    app,
    mongoose
}