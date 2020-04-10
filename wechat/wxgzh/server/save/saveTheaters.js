const Theaters = require('../../model/Theaters');

module.exports = async data => {
    for(var i =0; i< data.length; i++) {
        let item = data[i];
        const result = await Theaters.create({
            title: data.title,
            runtime: data.runtime,
            directors: data.directors,
            casts: data.casts,
            image: data.image,
            doubanId: data.doubanId,
            genre: data.genre,
            summary: data.summary,
            releaseDate: data.releaseDate
        });
    }
    console.log('数据保存成功');
    console.log(result);
}