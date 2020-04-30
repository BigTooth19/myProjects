const {app, mongoose} = require('../db');
const User = mongoose.model('user', new mongoose.Schema({
    uid: mongoose.Schema.Types.ObjectId,
    username: String,
    password: {
        type: String,
        default: '123456'
    }
}), 'users');

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
    let params = req.body;
    params.uid = new mongoose.Types.ObjectId;
    params.username = params.username;
    User.find({username: params.username}, (err, data) => {
        if(!err) {
            if(data.length === 0) {
                User.create(params, (err, data) => {
                    if(!err){
                        res.send({
                            "code": 0,
                            "data": data,
                            "msg": "注册成功"
                        });
                    }
                });
            } else {
                res.json({
                    code: 1,
                    msg: '此用户已存在'
                });
            }
        }
    });
});

// 登录
app.post('/login', (req, res) => {
    var params = req.body;
    User.find({username: params.username}, (err, data) => {
        if(!err) {
            req.session.login = {
                uid: data[0].uid,
                username: params.username,
                login: true
            }
            res.json({
                code: 0,
                msg: '登录成功'
            });
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