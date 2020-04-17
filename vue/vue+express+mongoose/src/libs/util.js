import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import store from '@/store/index'
import router from '@/router'
import layoutHeaderAside from '@/layout/header-aside'
import { defaultsDeep } from 'lodash'
import {
  Message
} from 'element-ui'

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const util = {
  cookies,
  db,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

// 创建uuid
util.createUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16);
  });
}

// 消息提示
util.message = function(opts = {}) {
  let defaults = {
    type: 'error',
    duration: 3 * 1000,
    message: '',
    onClose() {
      // ...
    }
  }
  opts = defaultsDeep({}, opts, defaults);
  if(!document.querySelector('.el-message')) {
    Message({
      message: opts.message,
      type: opts.type,
      duration: opts.duration,
      showClose: true,
      onClose() {
        opts.onClose();
      }
    });
  }
}

// 生成菜单
util.generateMenu = function() {
  let menuArr = [
    { path: '/index', title: 'flightDynamic', icon: 'plane' }, // 航班动态
  ];
  // 设置顶栏菜单
  store.commit('d2admin/menu/headerSet', menuArr)
  // 初始化菜单搜索功能
  store.commit('d2admin/search/init', menuArr)
}

// 追加路由
util.appendRouter = function() {
  let userManageRoutes = [];
  if(store.state.d2admin.user.userinfo.mlevel == 1) { // 管理员
    userManageRoutes = [
      // 用户管理
      {
        path: 'user_manage',
        name: 'user_manage',
        meta: {
          auth: true
        },
        component: _import('user_manage')
      }
    ];
  }
  router.addRoutes([
    {
      path: '/',
      redirect: { name: 'index' },
      component: layoutHeaderAside,
      children: [
        // 航班动态
        {
          path: 'index',
          name: 'index',
          meta: {
            auth: true
          },
          component: _import('system/index')
        },
        // 用户管理
        ...userManageRoutes,
        // 系统 前端日志
        {
          path: 'log',
          name: 'log',
          meta: {
            title: '前端日志',
            auth: true
          },
          component: _import('system/log')
        },
        // 刷新页面 必须保留
        {
          path: 'refresh',
          name: 'refresh',
          hidden: true,
          component: _import('system/function/refresh')
        },
        // 页面重定向 必须保留
        {
          path: 'redirect/:route*',
          name: 'redirect',
          hidden: true,
          component: _import('system/function/redirect')
        }
      ]
    }
  ]);
}

export default util
