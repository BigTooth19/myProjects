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
	}else if(message.Event === 'subscribe') {
		content = `欢迎您的关注\n
					回复 首页 能看到电影预告片\n
					回复 热门 能看到热门\n
					回复 文本 能查看指定电影信息\n
					回复 语音 能查看指定电影信息 \n
					也可以点击下面的菜单按钮来了解公众号`;
	} else if(message.Event === 'unsubscribe') {
		console.log('取消关注');
	} else if(message.Event === 'CLICK') {
		content = `您可以按照以下提示来操作\n
					回复 首页 能看到电影预告片\n
					回复 热门 能看到热门\n
					回复 文本 能查看指定电影信息\n
					回复 语音 能查看指定电影信息 \n
					也可以点击下面的菜单按钮来了解公众号`;
	}

	opts.content = content;
	return opts;
}