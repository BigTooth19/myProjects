const {app, mongoose} = require('../db');
// 文章
const Article = mongoose.model('article', new mongoose.Schema({
    uid: mongoose.Schema.Types.ObjectId,
    id: mongoose.Schema.Types.ObjectId,
    title: String,
    tags: String,
    content: String,
}), 'articles');
// 存入文章
app.post('/add', (req, res) => {
    var params = req.body;
    params.uid = req.session.login.uid;
    if(!(params.uid && params.id)) {
        params.id = new mongoose.Types.ObjectId;
        Article.create(params, (err, data) => {
            if(!err){
                res.send({
                    code: 0,
                    data,
                    msg: '保存成功'
                });
            }
        });
    } else {
        Article.find({id: params.id}, (err, data) => {
            if(!err) {
                res.send({
                    code: 0,
                    data,
                    msg: '保存成功'
                });
            }
        });
    }
});
// 文章列表
app.get('/list', (req, res) => {
    let uid = req.session.login.uid;
    Article.find({uid}, (err, data) => {
        if(!err) {
            res.send({
                code: 0,
                data,
                msg: 'success'
            });
        }
    })
});
// 上传图片
app.post('/uploadimg', (req, res) => {
    
});

module.exports = app;