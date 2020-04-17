<template>
  <div
    class="d2-layout-header-aside-group"
    :style="styleLayoutMainGroup">
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        class="d2-theme-header"
        :style="{
          opacity: this.searchActive ? 0.5 : 1
        }"
        flex-box="0"
        flex>
        <div class="logo-group" :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}" flex-box="0">
          <img :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/img-logo.png`">
          <strong>华夏航空航班查询系统</strong>
        </div>
        <d2-menu-header flex-box="1"/>
        <!-- 顶栏右侧 -->
        <div class="d2-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <!-- <d2-header-search @click="handleSearchClick"/> -->
          <d2-header-fullscreen/>
          <!-- <d2-header-theme/> -->
          <!-- <d2-header-locales/> -->
          <!-- <header-qrcode></header-qrcode> -->
          <d2-header-user/>
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <!-- <transition name="fade-scale">
            <div v-if="searchActive" class="d2-theme-container-main-layer" flex>
              <d2-panel-search
                ref="panelSearch"
                @close="searchPanelClose"/>
            </div>
          </transition> -->
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="d2-theme-container-main-layer" flex="dir:top">
              <!-- 页面 -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view/>
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import d2MenuHeader from './components/menu-header'
import d2HeaderFullscreen from './components/header-fullscreen'
// import d2HeaderLocales from './components/header-locales'
// import d2HeaderSearch from './components/header-search'
// import d2HeaderTheme from './components/header-theme'
import d2HeaderUser from './components/header-user'
// import headerQrcode from './components/header_qrcode'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
export default {
  name: 'd2-layout-header-aside',
  mixins: [
    mixinSearch
  ],
  components: {
    d2MenuHeader,
    d2HeaderFullscreen,
    // d2HeaderLocales,
    // d2HeaderSearch,
    // d2HeaderTheme,
    d2HeaderUser,
    // headerQrcode
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '240px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '56px'
    }
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse
    }),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup () {
      return {
        ...this.themeActiveSetting.backgroundImage ? {
          backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
        } : {}
      }
    }
  }
}
</script>

<style lang="scss">
// 注册主题
@import '~@/assets/style/theme/register.scss';
</style>
