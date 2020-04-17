import util from '@/libs/util.js'

export default {
  methods: {
    // 处理菜单选择
    handleMenuSelect (index, indexPath) {
      if(indexPath.slice(-1)[0] !== this.$router.currentRoute.path) {
        if (/^d2-menu-empty-\d+$/.test(index) || index === undefined) {
          this.$message.warning(this.$t('navigator.tempMenu'))
        } else if (/^https:\/\/|http:\/\//.test(index)) {
          util.open(index)
        } else {
          this.$router.push({
            path: index
          })
        }
      }
    }
  }
}
