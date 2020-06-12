const sha1 = require('sha1');
const config = require('../config');
const {getUserDataAsync, parseXMLAsync, formatMessage} = require('../utils/tool');
const template = require('./template');
const reply = require('./reply');

module.exports = () => {
	
	return async (req, res, next) => {
	  	const {timestamp, nonce, signature, echostr} = req.query;
	  	const {token} = config;
	  	const sha1Str = sha1([token, timestamp, nonce].sort().join(''));

	  	if(req.method === 'GET') {
	  		if(sha1Str === signature) {
		  		res.send(echostr);
		  	} else {
		  		res.end('error');
		  	}
	  	} else if(req.method === 'POST'){
	  		if(sha1Str !== signature) {
	  			res.end('error');
	  		}

	  		const xmlData = await getUserDataAsync(req);
	  		// 将xml解析成js
	  		const jsData = await parseXMLAsync(xmlData);
	  		const message = formatMessage(jsData);

	  		let opts = reply(message);
	  		console.log('replay',opts);
	  		let replyMessage = template(opts);
	  		console.log(replyMessage);
			res.send(replyMessage);
			res.end('');
	  	} else {
	  		res.end('error');
	  	}
	}

}
