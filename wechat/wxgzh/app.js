const express = require('express')
const app = express()
const port = 3033

const auth = require('./wechat/auth');
//配置模块资源目录
app.set('views', './views');
// 配置模块引擎
app.set('view engine', 'ejs');
// 页面路由
app.get('/search', (req, res) => {
	// 将渲染好的页面返回给服务器
	res.render('search');
});
// 接收处理所有消息
app.use(auth());


app.listen(port, () => console.log(`Example app listening on port ${port}!`))