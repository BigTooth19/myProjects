const models = require('../db');
const app = models.app;
const myConnect = models.myConnect;

// 存入文章
app.post('/', (req, res) => {
    var params = req.body;
    // myConnect.query(`select id from user where name='${params.username}'`, (err, data) => {
    //     if(err) {
    //         res.write(err);
    //         res.end();
    //     } else {
            
    //     }
    // });
});

module.exports = app;