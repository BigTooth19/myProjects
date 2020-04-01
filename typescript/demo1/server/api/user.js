const models = require('../db');
const app = models.app;
const myConnect = models.myConnect;

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
                req.session.login = {
                    id: data[0].id,
                    username: params.username,
                    login: true
                }
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
    req.session.login = {
        login: false
    };
    res.json({
        code: 0,
        msg: '退出成功'
    });
    res.end();
});

module.exports = app;