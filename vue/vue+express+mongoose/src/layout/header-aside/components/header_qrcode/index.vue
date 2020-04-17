<template>
  <el-tooltip
    effect="dark"
    placement="bottom">
    <div slot="content"><img src="https://kmg.goms.com.cn/static/images/img-qrcode01.png" style="display: block;" width="180" alt=""></div>
    <el-button class="btn-text can-hover" type="text" style="margin-left: 0;">
      <d2-icon name="qrcode" style="font-size: 18px;vertical-align: -1px;"/>
    </el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: 'header_qrcode'
}
</script>

<style lang="scss">
  
</style>