import axios from 'axios';
const qs = require('qs');
// 创建axios实例
const service = (opts: any) => {
	const CancelToken = axios.CancelToken;
	const axiosObj = axios.create({
		timeout: 5000, // 请求超时时间
		transformRequest: [(data: any) => {
			const ret = qs.stringify(data);
			return ret;
		}],
		withCredentials: true
	});

	const api = process.env.NODE_ENV === 'development' ? '/api' : '';
	interface ReqParams {
		method: string,
		url: string,
		params?: typeof opts.data,
		data?: typeof opts.data,
		cancelToken?: typeof opts.cancel
	}
	const requestParams: ReqParams = {
		method: opts.type,
		url: api + opts.url
	};

	// get传参是params post传参是data
	if(opts.type === 'get') {
		requestParams.params = opts.data;
	} else if(opts.type === 'post') {
		requestParams.data = opts.data;
	}
	
	// 取消请求
	if(opts.cancel && typeof opts.cancel === 'function') {
		requestParams.cancelToken = new CancelToken(opts.cancel);
	}

	axiosObj(JSON.parse(JSON.stringify(requestParams))).then((res: any) => {
		// 请求成功
		opts.success(res.data);
		// 请求完成
		if(opts.complete && typeof opts.complete === 'function') {
			opts.complete();
		}
	}).catch((res: any) => {
		// 请求完成
		if(opts.complete && typeof opts.complete === 'function') {
			opts.complete();
		}
	});
	
	// request拦截器
	axiosObj.interceptors.request.use((config: any) => {
		return config;
	}, (error: any) => {
		// Do something with request error
		console.log(error); // for debug
		Promise.reject(error);
	});
	
	// respone拦截器
	axiosObj.interceptors.response.use(
		(response: any) => {
			if (response.status !== 200) {
				return console.error(response);
			} else {
				return response.data;
			}
		},
		(error: any) => {
			console.log('err' + error);
			return Promise.reject(error);
		}
	);	
};

export default service;
