const models = require('../db');
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
var myConnect = mysql.createConnection(models.mysql);
myConnect.connect();

// 判断是否登录
app.get('/', (req, res) => {
    if(req.session.login) {
        res.send(req.session.login);
    } else {
        res.send('');
    }
});

// 注册
app.post('/register', (req, res) => {
    var params = req.body;
    myConnect.query(`select id from user where name='${params.username}'`, (err, data) => {
        if(err) {
            res.write(err);
            res.end();
        } else {
            if(data.length) {
                res.json({
                    code: 1,
                    msg: '此用户名已被占用'
                });
                res.end();
            } else {
                myConnect.query(`insert into user(name, password) values('${params.username}', '${params.password}')`, (err, data) => {
                    if(err) {
                        res.json({
                            code: 500,
                            msg: err
                        });
                    } else {
                        res.json({
                            code: 0,
                            msg: '注册成功'
                        });
                    }
                    res.end();
                });
            } 
        }
    });
});

// 登录
app.post('/login', (req, res) => {
    var params = req.body;
    myConnect.query(`select id from user where name='${params.username}'`, (err, data) => {
        if(err) {
            res.write(err);
            res.end();
        } else {
            if(data.length) {
                req.session.login = params.username;
                res.json({
                    code: 0,
                    msg: '登录成功'
                });
                res.end();
            }
        }
    });
});

// 注销
app.post('/logout', (req, res) => {
    req.session.login = '';
    res.json({
        code: 0,
        msg: '退出成功'
    });
    res.end();
});

module.exports = app;