/*
  	获取assce_token 微信接口全局唯一凭据
	特点：唯一的，有效期为2小时
	提前5分钟刷新
	https请求方式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
*/
const rp = require('request-promise-native'); // 发送请求,返回值是一个promise对象

const {appID, appsecret} = require('../config');
const menu = require('./menu');
const {accessToken, ticket, menuApi } = require('../utils/api');
const {writeFileAsync, readFileAsync} = require('../utils/tool');

class Wechat {
	constructor() {

	}

	/*
	 * 获取access_token
	*/ 
	getAccessToken() {
		const url = `${accessToken}&appid=${appID}&secret=${appsecret}`;
		return new Promise((resolve, reject) => {
			rp({method: 'GET', url, json: true})
			.then(res => {
				// res 
				// 设置acess_token的过期时间 7200-300
				res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
				resolve(res);
			}).catch(err => {
				console.log(err);
				reject('getAccessToken出现错误:'+err);
			});
		});
		
	}

	/*
	* 保存access_token
	*/
	saveAccessToken(accessToken) {
		accessToken = JSON.stringify(accessToken);
		return writeFileAsync(accessToken, 'accessToken.txt');
	}

	/*
	* 读取access_token
	*/
	readAccessToken(accessToken) {
		return readFileAsync('accessToken.txt');
	}

	/*
	* 检测access_token是否有效
	*/
	isValidAccessToken(data) {
		if(!data && !data.access_token && !data.expires_in) {
			// 代表access_token无效
			return false;
		}
		// 检测access_token是否在有效期内
		return data.expires_in > Date.now();
	}

	/*
	 *用来获取没有过期的accessToken
	*/
	fetchAccessToken(data) {
		if(this.access_token && this.expires_in && this.isValidAccessToken(this)) {
			return Promise.resolve({
				access_token: this.access_token,
				expires_in: this.expires_in
			});
		}
		return this.readAccessToken()
			.then(async res => {
				if(await this.isValidAccessToken(res)) {
					return Promise.resolve(res);
				} else {
					const res = await this.getAccessToken();
					await this.saveAccessToken(res);
					return Promise.resolve(res);
				}
			}).catch(async err => {
				const res = await this.getAccessToken();
				await this.saveAccessToken(res);
				return Promise.resolve(res);
			}).then(res => {
				// 将access_token挂载到this上
				this.access_token = res.access_token;
				this.expires_in = res.expires_in;
				// 返回res包装了一层promise对象（此对象为成功的状态）
				return Promise.resolve(res);
			})
	}

	/* 用来获取jsap_ticket */
	/*
	 * 获取jsap_ticke
	*/ 
	getTicket() {
		
		return new Promise(async (resolve, reject) => {
			const data = await this.fetchAccessToken();
			const url = `${ticket}&access_token=${data.access_token}`;
			rp({method: 'GET', url, json: true})
			.then(res => {
				resolve({
					ticket: res.ticket,
					expires_in: Date.now() + (res.expires_in - 300) * 1000
				});
			}).catch(err => {
				console.log(err);
				reject('getTicket出现错误:'+err);
			});
		});
		
	}

	/*
	* 保存jsap_ticke
	*/
	saveTicket(ticket) {
		ticket = JSON.stringify(ticket);
		return writeFileAsync(ticket, 'ticket.txt');
	}

	/*
	* 读取jsap_ticke
	*/
	readTicket(ticket) {
		return readFileAsync('ticket.txt');
	}

	/*
	* 检测jsap_ticke是否有效
	*/
	isValidTicket(data) {
		if(!data && !data.ticket && !data.expires_in) {
			// 代表jsap_ticket无效
			return false;
		}
		// 检测jsap_ticket是否在有效期内
		return data.expires_in > Date.now();
	}

	/*
	 *用来获取没有过期的jsap_ticke
	*/
	fetchTicket(data) {
		if(this.ticket && this.ticket_expires_in && this.isValidTicket({ticket: this.ticket, expires_in: this.ticket_expires_in})) {
			return Promise.resolve({
				ticket: this.ticket,
				expires_in: this.ticket_expires_in
			});
		}
		return this.readTicket()
			.then(async res => {
				if(await this.isValidTicket(res)) {
					return Promise.resolve(res);
				} else {
					const res = await this.getTicket();
					await this.saveTicket(res);
					return Promise.resolve(res);
				}
			}).catch(async err => {
				const res = await this.getTicket();
				await this.saveTicket(res);
				return Promise.resolve(res);
			}).then(res => {
				// 将access_token挂载到this上
				this.ticket = res.ticket;
				this.ticket_expires_in = res.expires_in;
				// 返回res包装了一层promise对象（此对象为成功的状态）
				return Promise.resolve(res);
			});
	}

	// 创建菜单
	createMenu(menu) {
		return new Promise(async (resolve, reject) => {
			try {
				// 定义请求的地址
				const data = await this.fetchAccessToken();
				const url = `${menuApi.create}?access_token=${data.access_token}`;
				const result = await rp({method: 'POST', url, json: true, body: menu});
				resolve(result);
			} catch(e) {
				reject('createMenu');
			}
			
		});
	}

	// 删除菜单
	deleteMenu() {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.fetchAccessToken();
				const url = `${menuApi.delete}?access_token=${data.access_token}`;
				const result = await rp({method: 'GET', url, json: true});
				resolve(result);
				
			} catch(e) {
				reject('deleteMenu:');
			}
		});
	}
}

(async ()=> {
	const w = new Wechat();
	// let result = await w.deleteMenu();
	// result = await w.createMenu(menu);
	const data = await w.fetchTicket();
	console.log(data);

})();