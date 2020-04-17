const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('index');
});

const user = require('./api/user');
app.use('/vue-demo1/user/', user);
// const flight = require('./api/flight');
// app.use('/api/flight/', flight);

app.listen(3001, () => {
    console.log('http://localhost:3001/');
});
