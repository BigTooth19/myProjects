
// 表格
import axios from 'axios';
import Vue from 'vue';
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
Vue.use(VXETable);

import { mapState } from "vuex";
import moment from 'moment';
import request from '@/plugin/axios';
import {isEmpty, timeFormat, cellFixedFn} from './tool';
let CancelToken = axios.CancelToken;
let getListTimer = null, getListCancel = null, vm;
export default {
	name: 'flight',
	components: {
	},
	data() {
		return {
			filename: __filename,
			loading: false,
			searchFnum: {
				value: '',
				num: 0,
				lists: []
			},
			curDate: moment().format('DD'),
			dateSelect: {
				value: '0',
				date: moment().format('YYYY-MM-DD'),
				dateRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
				opts: [
					{ value: '0', label: '自然日' },
					{ value: '1', label: '自定义' }
				]
			},
			statusSelect: {
				all: true,
				selected: [],
				opts: ['计划', '起飞', '到达', '延误', '取消', '备降', '返航', '滑回']
			},
			dataOpts: [],
			dataKeys: {},
			filterDatas: [],
			filterDatasTemp: [],
			filterOpts: {
				sortName: 'scheduled_deptime',
				sortType: 'asc',
				searchVal: '',
				searchName: ''
			},
			filterParams: {},
			statusKeys: {
				'取消': {text: '取消', color: 'am-color-red'},
				'延误': {text: '延误', color: 'am-color-yellow'},
				'备降': {text: '备降', color: 'am-color-red'},
				'返航': {text: '返航', color: 'am-color-red'},
				'失事': {text: '失事', color: 'am-color-red'},
				'失联': {text: '失联', color: 'am-color-red'},
				'可能延误': {text: '延误', color: 'am-color-yellow'},
				'可能取消': {text: '取消', color: 'am-color-red'},
				'正在备降': {text: '正在备降', color: 'am-color-red'},
				'正在返航': {text: '正在返航', color: 'am-color-red'},
				'延误': {text: '延误', color: 'am-color-yellow'},
				'备降起飞': {text: '起飞', tag: '备降'},
				'备降到达': {text: '到达', tag: '备降'},
				'备降取消': {text: '取消', color: 'am-color-red', tag: '备降'},
				'返航起飞': {text: '起飞', tag: '返航'},
				'返航到达': {text: '到达', tag: '返航'},
				'返航取消': {text: '取消', color: 'am-color-red', tag: '返航'},
				'转场': {text: '转场', color: 'am-color-red'},
				'滑回': {text: '滑回', color: 'am-color-red'}
			},
			orderFlight: {
				layer: false,
				data: []
			},
			areaTypes: {
				'0': '国内',
				'1': '国际',
				'2': '地区',
				'3': '国际',
				'4': '国际'
			}
		}
	},
	watch: {
		filterDatas: function(val) {
			if(document.visibilityState === 'visible') {
				this.$refs.xTable.loadData(val);
			}
		}
	},
	methods: {
		moment,
		isEmpty,
		timeFormat,
		// 列表时间不是当天，显示(天)
		getTimeDate(time) {
			let date = '',
				timeDate = this.timeFormat(time, 'DD', 1000);
			if(time && this.curDate != timeDate) {
				date = `(${timeDate})`;
			}
			return date;
		},
		// 时间格式化
		formatCellFn({cellValue}) {
			let str = `\t\t${timeFormat(cellValue, 'HHmm', 1000)} ${this.getTimeDate(cellValue)}`;
			return str;
		},
		// 获取列表
		getListFn(opts) {
			if(opts.init) {
				this.loading = true;
			}
			let params = {
				model_time: this.dateSelect.value,
				token: opts.token
			};
			if(opts.start_datetime) {
				params.start_datetime = opts.start_datetime;
			}
			if(opts.end_datetime) {
				params.end_datetime = opts.end_datetime;
			}
			request.get('/flight/main/lists/', {
				params,
				cancelToken: new CancelToken(function executor(c) {
			    	getListCancel = c;
			 	})
			}).then((res) => {
				this.loading = false;
				if(res.data && res.data.param) {
					this.dataUpdateFn(res.data.data);
					// 数据更新
					if(opts.init) {
						this.getListFn({...params, token: res.data.param.token});
					} else {
						getListTimer = setTimeout(function() {
							vm.getListFn({...params, token: res.data.param.token});
						}, 45000);
					}
				} else {
					this.$message.info(res.msg);
					// 数据初始化
					this.dataOpts = [];
					this.dataKeys = {};
					this.filterDatas = [];
					this.filterDatasTemp = [];
					this.filterOpts = {
						sortName: 'scheduled_deptime',
						sortType: 'asc',
						searchVal: '',
						searchName: ''
					};
				}
				
			}).catch(() => {
				this.loading = false;
			});
		},
		// 数据更新
		dataUpdateFn(data) {
			let isUpdate = false;
			if(data.init.length > 0) {
				this.dataKeys = {};
				data.init.forEach((item, index) => {
					this.dataKeys[item.id] = index;
				});
				this.dataOpts = data.init;
				isUpdate = true;
			}
			if(data.add.length > 0) {
				let len = this.dataOpts.len;
				data.add.forEach((item, index) => {
					this.dataOpts[len + index] = item;
					this.dataKeys[item.id] = len + index;
				});
				isUpdate = true;
			}
			if(data.update.length > 0) {
				data.update.forEach((item) => {
					let key = this.dataKeys[item.id];
					if(key) {
						this.dataOpts[key] = {
							...this.dataOpts[key],
							...item
						}
					}
				});
				isUpdate = true;
			}
			if(data.del.length > 0) {
				data.del.forEach((item) => {
					let key = this.dataKeys[item.id];
					if(key) {
						this.dataOpts.splice(key, 1);
					}
				});
				isUpdate = true;
			}
			if(isUpdate) {
				// 排序
				let {sortName, sortType} = this.filterOpts;
				this.dataOpts.sort((a, b) => {
					a[sortName] = a[sortName] ? parseInt(a[sortName]) : 0;
					b[sortName] = b[sortName] ? parseInt(b[sortName]) : 0;
					if(sortType === 'asc') {
						return a[sortName] - b[sortName];
					} else if(sortType === 'desc') {
						return b[sortName] - a[sortName];
					}
				});
				// 更新key
				this.dataKeys = {};
				this.dataOpts.forEach((item, index) => {
					this.dataKeys[item.id] = index;
				});
				// 根据筛选更新数据
				let filterDatas = [];
				filterDatas = this.filterDatasFn(this.dataOpts, 'flightStatus');
				filterDatas = this.filterDatasFn(filterDatas, 'searchList');
				this.filterDatas = JSON.parse(JSON.stringify(filterDatas));
			}
		},
		// 列表数据筛选
		filterDatasFn(datas, type) {
			let filterDatas = JSON.parse(JSON.stringify(datas));
			if(type === 'flightStatus') {
				let {all, selected} = this.statusSelect;
				if(all === false && selected.length > 0) {
					filterDatas = datas.filter((item, index) => {
						this.dataKeys[item.id] = index;
						let isReturn = false;
						selected.forEach((selectText) => {
							if(item.flight_status.includes(selectText)) {
								isReturn = true;
							}
						});
						if(isReturn) {
							return item;
						}
					});
				}
				this.filterDatasTemp = JSON.parse(JSON.stringify(filterDatas));
			} else if(type === 'searchList') {
				let {searchVal, searchName} = this.filterOpts;
				if(searchVal !== '') {
					filterDatas = filterDatas.filter((item, index) => {
						let isReturn = false;
						searchVal.split(' ').forEach((searchStr) => {
							if(item[searchName] && item[searchName].includes(searchStr)) {
								isReturn = true;
							}
						});
						return isReturn;
					});
				}
			}
			return filterDatas;
		},
		// 日期选择
		dateChangeFn(type) {
			let {value, date, dateRange} = this.dateSelect,
				start_datetime = '',
				end_datetime = '';
			if(type === 'select') {
				start_datetime = date + ' 00:00:00';
				end_datetime = date + ' 23:59:59';
				if(start_datetime === dateRange[0] && end_datetime === dateRange[1]) {
					return;
				}
				this.dateSelect = {
					...this.dateSelect,
					date: moment().format('YYYY-MM-DD'),
					dateRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
				};
			} else if(type === 'dateRange') {
				start_datetime = moment(dateRange[0]).unix();
				end_datetime = moment(dateRange[1]).unix();
				if(end_datetime - start_datetime > 259200) {
					this.$message.warning('时间跨度不能大于3天');
					return;
				}
			}
			// 日期选择
			if(value == 1) {
				this.filterParams = {
					start_datetime: dateRange[0],
					end_datetime: dateRange[1],
				}
			} else {
				this.filterParams = {
					start_datetime: date + ' 00:00:00',
					end_datetime: date + ' 23:59:59',
				}
			}
			// 刷新列表
			clearTimeout(getListTimer);
			getListCancel();
			this.getListFn({init: 1, token: '', ...this.filterParams});
		},
		// 导出列表
		exportListFn() {
			this.$refs.xTable.exportData({
				filename: '航班列表',
				type: 'csv',
				message: false
			});
		},
		// 状态筛选
		statusCheckboxFn(selected) {
			if(typeof selected === 'object' && selected.length > 0){
				if(selected.includes('全部')) {
					selected.splice(selected.indexOf('全部'), 1);
				}
				this.statusSelect.all = false;
				this.statusSelect.selected = selected;
			} else {
				this.statusSelect.all = selected;
				this.statusSelect.selected = [];
			}
		},
		statusChangeFn(visible) {
			if(visible === false) {
				this.filterDatas = this.filterDatasFn(this.dataOpts, 'flightStatus');
			}
		},
		// 排序
		sortFn(opts) {
			let curEle = $(opts.e.currentTarget),
				sortName = opts.name,
				sortType = '';
			curEle.parents('th').siblings().find('.sort-icon').removeClass('asc desc');
			if(curEle.hasClass('asc')) {
				curEle.removeClass('asc').addClass('desc');
				sortType = 'desc';
			} else {
				curEle.removeClass('desc').addClass('asc');
				sortType = 'asc';
			}
			this.filterDatas.sort((a, b) => {
				a[sortName] = a[sortName] ? parseInt(a[sortName]) : 0;
				b[sortName] = b[sortName] ? parseInt(b[sortName]) : 0;
				if(sortType === 'asc') {
					return a[sortName] - b[sortName];
				} else if(sortType === 'desc') {
					return b[sortName] - a[sortName];
				}
			});
			this.filterOpts = {
				...this.filterOpts,
				sortName,
				sortType
			}
		},
		// 全局搜索
		rowClassName({row, rowIndex}) {
			if(this.searchFnum.lists.includes(rowIndex)) {
				return 'row-select';
			}
        },
		searchFnumFn(type) {
			let searchVal = this.searchFnum.value.toUpperCase();
			if(type === 'input' || type === 'clear') {
				let num = 0, lists = [];
				this.searchFnum = {
					value: searchVal,
					num,
					lists
				};
				this.$refs.xTable.scrollTo('',0);
			} else if(type === 'enter') {
				let {num, lists} = this.searchFnum;
				if(num === 0 && searchVal.length > 0) {
					this.filterDatas.forEach((item,index) => {
						if(item.main_flight.includes(searchVal) || item.fnum.includes(searchVal)) {
							lists.push(index);
						}
					});
				}
				if(lists.length > 0) {
					if(num === 0 || num === lists.length) {
						num = 1;
					} else if(num > 0 && num < lists.length) {
						num++;
					}
				}
				this.searchFnum = {
					value: searchVal,
					num,
					lists
				}
				this.$refs.xTable.scrollTo('',lists[num-1]*33);
			}
		},
		// 列表搜索
		searchPopoverShowFn(e, input) {
			let curEle = $(e.currentTarget),
				id = curEle.attr('aria-describedby');
			setTimeout(function() {
				$('#'+id).find('.el-input__inner').focus();
			},500);
		},
		searchPopoverHideFn() {
			this.filterOpts = {
				...this.filterOpts,
				searchVal: '',
				searchName: ''
			}
			this.filterDatas = JSON.parse(JSON.stringify(this.filterDatasTemp));
		},
		searchListFn(opts) {
			let searchVal = opts.val.toUpperCase();
			this.filterOpts = {
				...this.filterOpts,
				searchVal,
				searchName: opts.name
			};
			this.filterDatas = this.filterDatasFn(this.filterDatasTemp, 'searchList');
		},
		// 双击行展示前后序航班
		rowDblclickFn(opts) {
			this.loading = true;
			let params = {
				aircraft_number: opts.row.aircraft_number,
				scheduled_deptime: opts.row.scheduled_deptime
			};
			request.post('/flight/main/aircraft/', params).then((res) => {
				this.loading = false;
				this.orderFlight = {
					layer: true,
					data: res.data
				}
			}).catch(() => {
				this.loading = false;
			});
		},
		// 设置高度
		setHgtFn() {
			if($('.am-flight-main')) {
				let wndHgt = $(window).height(),
					offsetT = $('.am-flight-main').offset().top;
				$('.am-flight-main').height(wndHgt - offsetT - 15);
				if(this.$refs.xTable) {
					this.$refs.xTable.clearScroll();
				}
			}
		}
	},
	created() {
		vm = this;
		// 获取列表
		this.getListFn({init: 1, token: ''});
	},
	mounted() {
		// 设置高度
		this.setHgtFn();
		$(window).resize(() => {
			this.setHgtFn();
		});
	},
	beforeDestroy() {
		// 清空列表请求
		clearTimeout(getListTimer);
		getListCancel();
	}
}