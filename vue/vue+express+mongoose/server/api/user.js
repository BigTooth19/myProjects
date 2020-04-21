const {app, mongoose} = require('../db');
const User = mongoose.model('user', new mongoose.Schema({
    uid: mongoose.Schema.Types.ObjectId,
    tel: String,
    username: String,
    unit_name: String,
    password: {
        type: String,
        default: '123456'
    },
    mlevel: {
        type: Number,
        default: 0
    },
    mclass: {
        type: Number,
        default: 1
    },
    created_time: String,
    status: {
        type: Number,
        default: 1
    },
    token: String
}));

// 登录
app.post('/authorize/login/', (req, res) => {
    let params = {};
    Object.keys(req.body).forEach(key => {
        params[key] = Buffer.from(req.body[key], 'base64').toString('ascii')
    });
    User.find({tel: params.tel}, (err, data) => {
        if(!err) {
            if(data.length === 0) {
                res.send({
                    "code": -1,
                    "data": "",
                    "msg": "用户未注册"
                }); 
            } else {
                if(params.pwd === data[0].password) {
                    req.session.login = Buffer.from(`session_sid_${data[0].uid}`).toString('base64');
                    res.send({
                        code: 0,
                        data: '',
                        msg: '登录成功'
                    });
                } else {
                    res.send({
                        code: -1,
                        data: '',
                        msg: '密码错误'
                    });
                }
            }
        }
    });
});
app.get('/info/detail/', async(req, res) => {
    let uid = Buffer.from(req.session.login, 'base64').toString('ascii').replace('session_sid_', '');
    let result = await User.find({uid}, (err, data) => {
        if(!err) {
            res.send({
                code: 0,
                data: data[0],
                msg: 'success'
            });
        }
    });
    
});
// 退出
app.post('/authorize/logout/', async(req, res) => {
    let result = await User.find();
    res.send(result);
});
// 用户管理
// 添加用户
app.post('/manage/add/', (req, res) => {
    let params = req.body;
    params.created_time = Date.now();
    params.uid = new mongoose.Types.ObjectId;
    User.create(params, (err, data) => {
        if(err) {
            res.send({
                "code": -1,
                "data": err,
                "msg": "error"
            });
        } else {
            res.send({
                "code": 0,
                "data": data,
                "msg": "success"
            });
        }
    });
    
});
// 保存修改
app.post('/manage/save/', (req, res) => {
    let params = req.body;
    User.update({uid: params.uid}, params, (err, data) => {
        if(err) {
            res.send({
                code: -1,
                data: err,
                msg: 'error'
            });
        } else {
            res.send({
                code: 0,
                data: data,
                msg: 'success'
            });
        }
    });
});
// 重置密码
app.post('/manage/pwd/', (req, res) => {
    let uid = req.body.uid;
    User.update({uid: uid}, {password: '111111'}, (err, data) => {
        if(err) {
            res.send({
                code: -1,
                data: err,
                msg: 'error'
            });
        } else {
            res.send({
                code: 0,
                data: data,
                msg: 'success'
            });
        }
    });
    
    
});
// 删除用户
app.post('/manage/del/', async(req, res) => {
    let params = req.body;
    let result = await User.remove({uid: params.uid}, (err, data) => {
        if(err) {
            res.send({
                code: -1,
                data: err,
                msg: 'error'
            });
        } else {
            res.send({
                code: 0,
                data: data,
                msg: 'success'
            });
        }
    });
});
// 用户列表
app.get('/manage/lists/', async(req, res) => {
    let result = await User.find();
    res.send({
        code: 0,
        data: {
            count: result.length,
            list: result
        },
        msg: "success",
	    msgType: "success"
    });
});

module.exports = app;