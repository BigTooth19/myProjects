const {app, mongoose} = require('../db');
const User = mongoose.model('user', new mongoose.Schema({
    uid: String,
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
    }
}));
const user = new User();

// 登录
app.post('/authorize/login/', async(req, res) => {
    let result = await User.find();
    res.send({
        "code": 0,
        "data": "",
        "msg": ""
    });
});
app.get('/info/detail/', async(req, res) => {
    let result = await User.find();
    res.send({
        "code": 0,
        "data": {
            "uid": "4",
            "unit_name": "12",
            "area_code": "86",
            "username": "18096652709",
            "mlevel": "1",
            "mclass": "1",
            "created_time": "1581044538",
            "astatus": "1"
        },
        "msg": "请求成功",
        "msgType": "success"
    });
});
// 退出
app.post('/authorize/logout/', async(req, res) => {
    let result = await User.find();
    res.send(result);
});
// 用户管理
// 添加用户
app.post('/manage/add/', async(req, res) => {
    console.log('req.body:',req, res);
    // let result = await user.save(req.body);
    // result = {...result, uid: result.id, created_time: Date.now()}
    // res.send({
    //     "code": 0,
    //     "data": result,
    //     "msg": "请求成功"
    // });
});
// 保存修改
app.post('/manage/save/', async(req, res) => {
    let result = await User.find();
    res.send({
        code: 0,
        data: {
            count: 0,
            list: []
        },
        msg: "请求成功",
	    msgType: "success"
    });
});
// 重置密码
app.post('/manage/pwd/', async(req, res) => {
    let result = await User.find();
    res.send(result);
});
// 删除用户
app.post('/manage/del/', async(req, res) => {
    let result = await User.remove();
    res.send({
        "code": 0,
        "data": {},
        "msg": "请求成功"
    });
});
// 用户列表
app.get('/manage/lists/', async(req, res) => {
    let result = await User.find();
    console.log(result);
    res.send({
        code: 0,
        data: {
            count: 0,
            list: result
        },
        msg: "请求成功",
	    msgType: "success"
    });
});

module.exports = app;