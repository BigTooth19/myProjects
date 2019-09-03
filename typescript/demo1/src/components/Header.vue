<template>
    <div class="am-header">
        <div class="am-header-cont clearfix">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">首页</el-menu-item>
                <el-menu-item index="2">文章</el-menu-item>
            </el-menu>
            <div class="am-search-box">
                <input type="text" value="" placeholder="搜索问题或关键字">
                <i class="el-icon-search"></i>   
            </div>
            <div v-if="!isLogin" class="header-user">
                <a @click="loginFn">登录</a>
                <a class="on" @click="registerFn">注册</a>
            </div> 
            <div v-else class="header-user">
                <el-dropdown @command="dropdownHandle">
                    <span class="el-dropdown-link">
                        <i class="el-icon-user-solid"></i>{{isLogin}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item command="write">写文章</el-dropdown-item>
                        <el-dropdown-item command="quit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <Login ref="login"></Login>
        <Register ref="register"></Register>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Getter, Action, Mutation } from 'vuex-class';
import service from '../utils/request';
import Login from './Login.vue';
import Register from './Register.vue';
@Component({
    components:{
        Login,
        Register
    }
})
export default class Header extends Vue {
    @State isLogin!: string;

    activeIndex:string = '1';
    handleSelect() {

    }
    loginFn() {
        let login: any = this.$refs.login;
        login.loginShowFn();
    }
    registerFn() {
        let register: any = this.$refs.register;
        register.registerShowFn();
    }
    dropdownHandle(command: string) {
        if(command === 'quit') {  // 退出
            interface Request {
                code: number;
                msg: string;
            }
            service({
                type: 'post',
                url: '/api/logout',
                success: (res: Request) => {
                    if(res.code === 0) {
                        this.$store.dispatch('setLogin');
                    }
                }
            });
        } else if(command === 'write') { // 写文章
            this.$router.push('/write');
        }
    }
    mounted() {
    } 
}
</script>
