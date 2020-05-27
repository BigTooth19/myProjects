/*
	用来加工处理最后回复用户消息的模板(xml数据)
*/
module.exports = opts => {
	let replyMessage = `<xml>
			  <ToUserName><![CDATA[${opts.toUserName}]]></ToUserName>
			  <FromUserName><![CDATA[${opts.fromUserName}]]></FromUserName>
			  <CreateTime>${opts.createTime}</CreateTime>
			  <MsgType><![CDATA[${opts.msgType}]]></MsgType>
			  <Url><![CDATA[${opts.url}]]></Url>`;

	switch(opts.msgType) {
		case 'text':
			replyMessage += `<Content><![CDATA[${opts.content}]]></Content>`;
			break;
		case 'image':
			replyMessage += `<Image>
							    <MediaId><![CDATA[${opts.mediaId}]]></MediaId>
							</Image>`;
			break;
		case 'voice':
			replyMessage += `<Voice>
							    <MediaId><![CDATA[${opts.mediaId}]]></MediaId>
							</Voice>`;
			break;
		case 'video':
			replyMessage += `<Video>
    							<MediaId><![CDATA[${opts.mediaId}]]></MediaId>
							    <Title><![CDATA[${opts.title}]]></Title>
							    <Description><![CDATA[${opts.description}]]></Description>
						  	</Video>`;
			break;
		case 'music':
			replyMessage += `<Music>
							    <Title><![CDATA[${opts.title}]]></Title>
							    <Description><![CDATA[${opts.description}]]></Description>
							    <MusicUrl><![CDATA[${opts.musicUrl}]]></MusicUrl>
							    <HQMusicUrl><![CDATA[${opts.hqMusicUrl}]]></HQMusicUrl>
							    <ThumbMediaId><![CDATA[${opts.mediaId}]]></ThumbMediaId>
							</Music>`;
			break;
		case 'news':
			replyMessage += `<ArticleCount>${opts.content.length}</ArticleCount>
								<Articles>`;
			opts.content.forEach(item => {
				replyMessage += `<item>
									<Title><![CDATA[${item.title}]]></Title>
									<Description><![CDATA[${item.description1}]]></Description>
									<PicUrl><![CDATA[${item.picurl}]]></PicUrl>
									<Url><![CDATA[${item.url}]]></Url>
								</item>`;
			});
								
			replyMessage += `</Articles>`;
			break;
	}

	replyMessage += '</xml>';
	return replyMessage;
}