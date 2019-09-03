import Vue from 'vue';
import store from './store';
import Router from 'vue-router';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Home from '@/components/Home.vue';
import Write from '@/components/Write.vue';

Vue.use(Router);

const router = new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/register',
			name: 'register',
			component: Register
		},
		{
			path: '/write',
			name: 'write',
			component: Write
		}
	]
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
	store.dispatch('setLogin');
	next();
});

export default router;
