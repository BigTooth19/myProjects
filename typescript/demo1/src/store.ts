import Vue from 'vue';
import Vuex from 'vuex';
import service from './utils/request';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isLogin: ''
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
                url: '/api/',
                success: (res: string) => {
                    commit('SET_LOGIN', {login: res});
                }
            });
        }
    }
});

export default store;
