/*
	
*/
module.exports = (message) => {
	let opts = {
		toUserName: message.FromUserName,
		fromUserName: message.ToUserName,
		createTime: Date.now(),
		msgType: 'text'
	}

	let content = '您在说什么，我听不懂';
	// 判断用户发送的消息是否是文本消息
	if(message.MsgType === 'text') {
		// 判断用户发送的消息内空具体是什么
		if(message.Content === '1') {
			content = '大吉大利';
		} else if(message.Content === '2') {
			content = '落地成河';
		} else if(message.Content.match('爱')) {
			content = '我爱你~';
		}
	} else if(message.MsgType === 'image') {
		opts.msgType = 'image';
		opts.mediaId = message.MediaId;
	} else if(message.MsgType === 'voice') {
		opts.msgType = 'voice';
		opts.mediaId = message.MediaId;
	} else if(message.MsgType === 'video') {
		opts = {
			...opts,
			msgType: 'video',
			mediaId: message.MediaId,
			title: '娃娃',
			description: '娃娃'
		}
	} else if(message.MsgType === 'location') {
		content = `维度:${message.Location_X} 经度:${message.Location_Y} 缩放:${message.Scale} 地理位置信息:${message.Label}`;
	} else if(message.Event === 'subscribe') {
		content += '欢迎您的关注';
		if(message.EventKey) {
			content += '用户扫描带参数的二维码关注';
		}
	} else if(message.Event === 'unsubscribe') {
		console.log('取消关注');
	} else if(message.Event === 'SCAN') {
		content += '用户已经关注过';
	} else if(message.Event === 'LOCATION') {
		content = `维度:${message.Latitude} 经度:${message.Longitude} 缩放:${message.Precision} 地理位置信息:${message.Label}`;
	} else if(message.Event === 'CLICK') {
		content = '您点击了按钮:${message.EventKey}';
	}

	opts.content = content;
	return opts;
}