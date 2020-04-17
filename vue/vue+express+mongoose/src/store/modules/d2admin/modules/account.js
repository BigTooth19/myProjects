import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import request from '@/plugin/axios'
import { AccountLogin } from '@api/sys.login'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload account {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({ dispatch }, {account = '',password = ''} = {}) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        AccountLogin({
          tel: account,
          pwd: password
        })
        .then(async res => {
          if(res.code === 0) {
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            util.cookies.set('token', util.createUuid())
            // 设置 vuex 用户信息
            let userInfoRes = await request.get('user/info/detail');
            if(userInfoRes.code === 0) {
              await dispatch('d2admin/user/set', Object.assign({tel: account}, userInfoRes.data), { root: true })
            }
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load')
            // 结束
            resolve()
          } else {
            reject(res.msg);
          }
        })
        .catch(err => {
          console.log('err: ', err)
          reject(err)
        })
      })
    },
    /**
     * @description 退出用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 退出
       */
      async function logout () {
        let logoutRes = await request.post('user/authorize/logout');
        console.log(logoutRes)
        // 删除cookie
        util.cookies.remove('token')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        MessageBox.confirm('确定要退出当前用户吗', '退出用户', {
          type: 'warning'
        })
          .then(() => {
            logout()
          })
          .catch(() => {
            // Message({
            //   message: '取消退出操作'
            // })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
