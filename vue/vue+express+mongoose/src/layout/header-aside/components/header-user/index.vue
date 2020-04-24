<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{userinfo.tel ? `${userinfo.tel}` : '未登录'}}</span>
    <d2-icon name="user-circle-o zh-text-white"></d2-icon>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="toUserManage">
        <d2-icon name="user" class="d2-mr-5"/>
        用户管理
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        退出登录
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'userinfo'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    toUserManage () {
      if(this.$router.currentRoute.name !== 'user_manage') {
        this.$router.push({
          path: '/user_manage'
        })
      }
    }
  }
}
</script>
