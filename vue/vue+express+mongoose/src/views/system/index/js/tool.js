import moment from 'moment';

// 是否为空
const isEmpty = function(str, empty) {
	if (typeof str === 'undefined' || str === null || str.length < 1) {
		return empty || '--'
	} else {
		return str
	}
}
// 获取类型
const getType = function(v) {
	let type = Object.prototype.toString.call(v).toLowerCase(),
		regex = /^\[object\s+([a-z]+)\]$/;
	return type.match(regex)[1];
}
// 时间格式化
const timeFormat = function(date,format,num) {
	let dateFormat;
	if (date) {
		let dateStr = num ? date * num : date;
		dateFormat = moment(dateStr).utcOffset(8).format(format);
	} else {
		dateFormat = '--';
	}
	return dateFormat;
}

// 表头固定
const cellFixedFn = function(e,fixedCell,sHeight) {
	let curEle = $(e.currentTarget),
		_fixedCell = curEle.find(fixedCell),
		scrollTop = curEle[0].scrollTop;			
    _fixedCell.css({
        '-webkit-transform': 'translateY('+scrollTop+'px)',
        '-ms-transform': 'translateY('+scrollTop+'px)',
        'transform': 'translateY('+scrollTop+'px)'
    });
}

export {
	isEmpty,
	getType,
	timeFormat,
	cellFixedFn
}