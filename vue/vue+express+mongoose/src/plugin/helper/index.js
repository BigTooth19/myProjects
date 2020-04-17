import dayjs from 'dayjs'
import i18n from '@/i18n'
import MD5 from 'md5.js'
import util from '@/libs/util'

export default {

  setJumpUrlParams (data) {
    let params = {
      rqs: 'pc',
      timestamp: dayjs().unix(),
      lang: i18n._vm.locale,
    }
    if (typeof data === 'obj' +
      'ect') {
      params = Object.assign(data, params)
    }
    var paramKeys = Object.keys(params)
    paramKeys.sort()
    var sign = []
    paramKeys.forEach(function (k) {
      sign.push(k + '=' + params[k])
    })
    params['key'] = new MD5().update(sign.join('&')).digest('hex').toLowerCase()
    params['token'] = util.cookies.get('token')
    return this.formatObjToParamStr(params)
  },
  filter (str) { // 特殊字符转义
    str += '' // 隐式转换
    str = str.replace(/%/g, '%25')
    str = str.replace(/\+/g, '%2B')
    str = str.replace(/ /g, '%20')
    str = str.replace(/\//g, '%2F')
    str = str.replace(/\?/g, '%3F')
    str = str.replace(/&/g, '%26')
    str = str.replace(/\=/g, '%3D')
    str = str.replace(/#/g, '%23')
    return str
  },
  formatObjToParamStr (paramObj) {
    const sdata = []
    for (let attr in paramObj) {
      sdata.push(`${attr}=${this.filter(paramObj[attr])}`)
    }
    return sdata.join('&')
  }

}

