<template>
  <i v-if="iconfont" class="iconfont" :class="`icon-${iconfont}`" aria-hidden="true"></i>
  <i v-else class="fa" :class="`fa-${name}`" aria-hidden="true"></i>
  <!-- 
    <d2-icon iconfont="search"></d2-icon> // iconfont图标
    <d2-icon name="search"></d2-icon> // font-awesome图标
    <span class="el-icon-search"></span> // element图标(https://element.eleme.cn/#/zh-CN/component/icon)
   -->
</template>

<script>
import './font-awesome-4.7.0/css/font-awesome.min.css'
export default {
  name: 'd2-icon',
  props: {
    name: {
      type: String,
      required: false,
      default: 'font-awesome'
    },
    iconfont: {
      type: String,
      default: ''
    }
  }
}
</script>
