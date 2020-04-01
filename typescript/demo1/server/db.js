const express = require('express');
const session = require('express-session');
const FileStore = require('nedb-session-store')(session);
var app = express();
const mysql = require('mysql');

// 创建 session 中间件
const sessionStore = session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year
    },
    store: new FileStore({
      filename: 'path_to_nedb_persistence_file.db'
    })
});

app.use(sessionStore);

// mysql.createConnection方法有一个缺陷，就是它一次只能创建一个连接，一旦有多个用户同时请求，就会造成请求排队等待。
// var myConnect = mysql.createConnection(models.mysql);
// 因此为了提高性能，可以改用mysql.createPool方法，创建一个连接池，它可以创建n个与服务器之间的连接，需要使用时，可以自动从中选取一个空闲的连接使用。
var myConnect = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'a123456',
    database: 'ts_data',
    port: '3306'
});
myConnect.connect();

// 数据库连接配置
module.exports = {
    myConnect: myConnect,
    app: app
}