import Vue from 'vue';
import Vuex from 'vuex';
import service from './utils/request';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isLogin: '',
        features: ['前端', '后端', '小程序'],
        tags: ['javascript', 'css', 'html5', 'node.js', 'vue', 'react', 'vuex']
    },
    mutations: {
        SET_LOGIN: (state: any, opts) => {
            state.isLogin = opts.login;
        }
    },
    actions: {
        async setLogin({commit}) {
            let login: string = '';
            await service({
                type: 'get',
                url: '/user/',
                success: (res: string) => {
                    commit('SET_LOGIN', {login: res});
                }
            });
        }
    }
});

export default store;
