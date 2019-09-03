<template>
    <el-dialog
        title="登录"
        :visible.sync="layer"
        width="400px"
        class="am-login-layer"
    >
         <ul class="am-login-field">
            <li class="input-box">
                <span class="iconfont icon-user"></span>
                <input type="text" v-model="user" placeholder="请输入用户名">
            </li>
            <li class="input-box">
                <span class="iconfont icon-password"></span>
                <input type="password" v-model="password" placeholder="请输入密码">
            </li>
        </ul>
        <div class="am-login-btm" slot="footer">
            <input class="am-login-btn" type="button" value="登录" @click="loginFn">
        </div>
    </el-dialog>
</template>
<script lang="ts">
import '../assets/sass/login.scss';
import { Component, Vue } from 'vue-property-decorator';
import service from '../utils/request';
@Component
export default class Login extends Vue {
    private layer: boolean = false;
    private user: string = '';  // 用户名
    private userError: boolean = false;  // 判断用户名是否错
    private password: string = '';
    private passwordError: boolean = false;

    loginShowFn() {
        this.layer = true;
    }
    // 格式判断
    verifyFn() {
        if(this.user === '') {
            this.$message.error('用户名不能为空');
            this.userError = false;
            return false;
        } else if(this.password === '') {
            this.$message.error('密码不能为空');
            this.passwordError = false;
            return false;
        } else {
            this.userError = true;
            this.passwordError = true;
            return true;
        }
    }
    // 登录方法
    loginFn() {
        let verify: boolean = this.verifyFn();
        if(!verify) {
            return;
        }
        interface Request {
            code: number;
            msg: string;
        }
        service({
            type: 'post',
            url: '/api/login',
            data: {
                username: this.user,
                password: this.password
            },
            success: (res: Request) => {
                if(res.code === 0) {
                    this.layer = false;
                    this.$store.dispatch('setLogin');
                } else {
                    this.$message.error(res.msg);
                }
            }
        });
    }
}
</script>
