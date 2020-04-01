import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App.vue';
import './element-variables.scss';
import { Pagination, Dialog, MessageBox, Message, Loading, Menu, MenuItem, Dropdown, DropdownMenu, DropdownItem, Select, Option, Button } from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;

import './assets/sass/common.scss';

new Vue({
	router,
	render: (h) => h(App),
	store
}).$mount('#app');
