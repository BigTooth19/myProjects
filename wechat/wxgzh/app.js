const express = require('express')
const ejs = require('ejs');

const app = express()
const port = 3033
const router = require('./router');
//配置模块资源目录
app.set('views', './views');
// 配置模块引擎
app.set('view engine', 'ejs');
// 应用路由器
app.use(router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
