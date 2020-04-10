const puppeteer = require('puppeteer');

// 爬取热门电影信息
const url = 'https://movie.douban.com/cinema/nowplaying/hefei/';

module.exports = async () => {    
    // 1.打开浏览器
    const browser = await puppeteer.launch({
        // args: [''],
        headless: false, //true以无头浏览器的形式打开，没有界面显示，在后台运行的
    });
    // 2.创建tab标签页
    const page = await browser.newPage();
    // 3.跳转到指定网址
    await page.goto(url, {
        waitUntil: 'networkidle2', //等待网络空闲时，再跳转加载页面
    });
    // 4.等待网址加载完成,开始爬取数据
    // 开启延时器，延时2秒钟再开始爬取数据
    await timeout();
    let result = await page.evaluate(() => {
        // 对加载好的页面进行dom操作
        let result = [];
        // 获取所有电影的list
        let $list = $('#upcoming .mod-bd .lists .list-item');
        // 只取8条
        for( let i = 0; i< 8; i++) {
            let liDom = $list[i];
            let dobanId = $(liDom).attr('id');
            let title = $(liDom).data('title');
            let rating = $(liDom).data('score');
            let runtime = $(liDom).data('duration');
            let directors = $(liDom).data('director');
            let casts = $(liDom).data('actors');
            let href = $(liDom).find('.poster>a').attr('href');
            let image = $(liDom).find('.poster>a>img').attr('src');
            result.push({
                title,
                rating,
                runtime,
                directors,
                casts,
                href,
                image,
                dobanId,
            });
        }
        // 将爬取的数据返回出去
        return result;
    });

    // 遍历爬取到的8条数据
    for(let i=0; i<result.length; i++) {
        let item = result[i];
        // 获取电影详情的网址
        let url = item.href.toString();
        // 3.跳转到指定网址
        await page.goto(url, {
            waitUntil: 'networkidle2', //等待网络空闲时，再跳转加载页面
        });

        let itemResult = await page.evaluate(() => {
            // 类型
            let genre = [];
            const $genre = $('[property="v:genre"]');
            for(let j=0; j<$genre.length; j++) {
                genre.push($genre[j].innerText);
            }

            const summary = $('[property="v:summary"]').html().replace(/\s+/g, '');
            const releaseDate = $('[property="v:initialReleaseDate"]')[0].innerText;
            return {
                genre,
                summary,
                releaseDate
            }
        });

        // 在最后给当前对象添加两个属性
        // 在evalate中没办法读取到服务器中的变量
        item.genre = itemResult.genre;
        item.summary = itemResult.summary;
        item.releaseDate = itemResult.releaseDate;
        console.log(result);
    }
    // 5.关闭浏览器
    await browser.close();
    // 最终会将数据全部返回出去
    return result;
}

function timeout() {
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    })
}