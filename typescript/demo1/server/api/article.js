const {app, mongoose} = require('../db');
const Article = mongoose.model('article', new mongoose.Schema({
    uid: mongoose.Schema.Types.ObjectId,
    id: mongoose.Schema.Types.ObjectId,
    title: String,
    feature: String,
    tags: String,
    content: String,
}), 'articles');

// 存入文章
app.post('/', (req, res) => {
    var params = req.body;
    
});

module.exports = app;