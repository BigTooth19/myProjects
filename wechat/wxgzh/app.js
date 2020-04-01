const express = require('express')
const sha1 = require('sha1');
const ejs = require('ejs');

const app = express()
const port = 3002

const auth = require('./wechat/auth');

// 引入wechat模块
const Wechat = require('./wechat/wechat');
const wechatApi = new Wechat(); //创建实例对象
const {url} = require('./config');

//配置模块资源目录
app.set('views', './views');
// 配置模块引擎
app.set('view engine', 'ejs');
//配置模块资源目录
app.set('views', './views');
// 配置模块引擎
app.set('view engine', 'ejs');
// 页面路由
app.get('/', async (req, res) => {
    /*
        生成js-sdk使用的方法
        1.四个参数 jsapi_ticket（临时票据）,noncestr(随机字符串),timestamp（时间戳），url(当前服务器地址)
        2.将其进程字典序排序，以‘&’拼接在一起
        3.进程sha1加密，最终生成signature
    */
    // 获取随机字符串
    const noncestr = Math.random().toString().split('.')[1];
    // 时间戳
    const timestamp = Date.now();
    const {ticket} = await wechatApi.fetchTicket();
    const arr = [
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ];
    // 将其进程字典序排序，以'&'拼接在一起
    const str = arr.sort().join('&');
    // 进行sha1加密，最终成生signature
    const signature = sha1(str);
    // 将渲染好的页面返回给服务器
    res.render('index', {
        signature,
        timestamp,
        noncestr
    });
    // ejs.renderFile('./views/index.ejs', {
    //     title: 'ejs-index',  // 渲染的数据key: 对应到了ejs中的title
    //     index: '首页'},  // 渲染的数据key: 对应到了ejs中的index
    //     (err, data) => {
    //     if (err ) {
    //         console.log(err);
    //     } else {
    //         console.log(data);
    //         res.end(data);
    //     }
    // })
});
// 接收处理所有消息
app.use(auth());


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// http.createServer((req, res) => {
//     if (req.url === '/') {
//         res.writeHead(200, {
//             'Content-Type': 'text/html' 
//         });
//         // 渲染文件 index.ejs
        
//     }
// }).listen(3002);