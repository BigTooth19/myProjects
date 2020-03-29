/* 工具包 */
// xml2js 将xml转换成js对象
const { parseString } = require('xml2js');
const {writeFile, readFile} = require('fs'); // 引入fs模块
const {resolve} = require('path');
module.exports = {
	getUserDataAsync(req) {
		return new Promise((resolve, reject) => {
			let xmlData = '';

			req.on('data', data => {
				// 读取的数据是buffer,需要toString转成字符串
				xmlData += data.toString();
			}).on('end', () => {  //当数据接收完毕触发
				resolve(xmlData);
			});
		})
	},
	parseXMLAsync(xmlData) {
		return new Promise((resolve, reject) => {
			parseString(xmlData, {trim: true}, (err, data) => {
				if(!err) {
					resolve(data);
				} else {
					reject('parseXMLAsync:' + err);
				}
			});
		});
	},
	formatMessage(jsData) {
		let message = {};
		jsData = jsData.xml;
		if(typeof jsData === 'object') {
			for(let key in jsData) {
				let value = jsData[key];
				if(Array.isArray(value) && value.length > 0) {
					message[key] = value[0];
				}
			}
		}
		return message;
	},
	writeFileAsync(data, fileName) {
		data = JSON.stringify(data);
		const filePath = resolve(__dirname, fileName);
		return new Promise((resolve, reject) => {
			writeFile(filePath, data, err => {
				if(!err) {
					console.log('文件保存成功');
					resolve();
				} else {
					reject('writeFileAsync:' + err);
				}
			});
		});
	},
	readFileAsync(fileName) {
		const filePath = resolve(__dirname, fileName);
		return new Promise((resolve, reject) => {
			readFile(filePath, (err, data) => {
				if(!err) {
					data = JSON.parse(data);
					resolve(data);
				} else {
					reject('readFileAsync:' + err);
				}
			});
		});
	}
}