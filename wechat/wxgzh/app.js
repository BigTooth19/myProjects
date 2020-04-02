const express = require('express')
const sha1 = require('sha1');
const ejs = require('ejs');

const app = express()
const port = 3033

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
app.get('/search', async (req, res) => {
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
    res.render('search', {
        signature,
        timestamp,
        noncestr
    });
});
// 接收处理所有消息
app.use(auth());


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
