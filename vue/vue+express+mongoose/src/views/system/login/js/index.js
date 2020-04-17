import {
	mapActions
} from 'vuex';
import { isEmpty } from 'lodash';
import util from '@/libs/util'

export default {
    name: "login",
    data() {
        return {
            form: {
                tel: '',
                pwd: ''
            }
        }
    },
    methods: {
        ...mapActions('d2admin/account', [
			'login'
		]),
        // 忘记密码
        forgetPassword() {
            this.$alert('请联系系统管理员', '忘记密码', {
                customClass: 'zh-alert-forget',
                confirmButtonText: '好的'
            });
        },
        // 提交
        submit() {
            let {
                tel,
                pwd
            } = this.form;
            // 验证
            if(isEmpty(tel)) {
                this.$message({
                    type: 'error',
                    message: '请输入账号',
                    duration: 1500,
                    showClose: true
                });
                return;
            } else {
                if(tel.length !== 11 || !/\d{11}/.test(tel)) {
                    this.$message({
                        type: 'error',
                        message: '手机号格式不对',
                        duration: 1500,
                        showClose: true
                    });
                    return;
                }
            }
            if(isEmpty(pwd)) {
                this.$message({
                    type: 'error',
                    message: '请输入密码',
                    duration: 1500,
                    showClose: true
                });
                return;
            }
            this.login({
                account: tel,
                password: pwd
            })
            .then(() => {
                this.$router.replace(this.$route.query.redirect || '/');
            }, message => {
                util.message({
                    message,
                    duration: 1500,
                });
            })
        }
    }
}

