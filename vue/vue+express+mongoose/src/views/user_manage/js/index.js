import request from '@/plugin/axios'
import util from '@/libs/util'
import addDialog from '../components/add_dialog'
import editDialog from '../components/edit_dialog'

export default {
  name: 'user_manage',
  components: {
    'add-dialog': addDialog,
    'edit-dialog': editDialog
  },
  data () {
    return {
      loading: false,
      tableHgt: window.innerHeight - 188,
      // 列表
      list: [],
      // 搜索
      search: {
        keyword: ''
      },
      // 对话框
      dialogs: {
        add: {
          visible: false,
        },
        edit: {
          visible: false,
          data: {}
        },
        show: {
          visible: false
        }
      },
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 30,
        total: 0
      }
    }
  },
  methods: {
    // 格式化级别
    formatLevel(row, col, colVal) {
      switch(colVal) {
        case '1':
          return '管理员';
        default:
          return '普通用户';
      }
    },
    // 显示添加对话框
    showAddDialog() {
      this.dialogs.add.visible = true
    },
    // 关闭添加对话框
    closeAddDialog () {
      this.dialogs.add.visible = false
    },
    // 显示编辑对话框
    showEditDialog (row) {
      let copyRow = Object.assign({}, row);
      this.dialogs.edit = {
        visible: true,
        data: {
          uid: +copyRow.uid,
          tel: copyRow.tel,
          username: copyRow.username,
          mlevel: +copyRow.mlevel,
          unit_name: copyRow.unit_name,
        }
      }
    },
    // 关闭编辑对话框
    closeEditDialog () {
      this.dialogs.edit.visible = false
    },
    // 重置密码
    resetPassword(uid) {
      this.$confirm('重置后新密码将会发送到你的手机号上，确定要重置吗？', '重置密码', {
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 参数处理
        let params = {uid};
        // 请求
        request.post('user/manage/pwd', params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '重置成功',
              duration: 1000
            })
          } else {
            util.message({
              message: res.msg
            })
          }
        })
      }).catch(() => {
      })
    },
    // 获取列表
    getList () {
      // 参数处理
      let {
        keyword
      } = this.search;
      let params = {
        page: this.pagination.currentPage
      };
      if (keyword) {
        params['search'] = keyword;
      }
      // 请求
      this.loading = true
      request.get('user/manage/lists', {params}).then(res => {
        this.loading = false
        if (res.code === 0) {
          let {
            list,
            count
          } = res.data;
          this.list = list;
          this.pagination.total = count;
        } else {
          util.message({
            message: res.msg
          })
        }
      })
    },
    // 改变当前页
    changeCurrentPage(v) {
      this.pagination.currentPage = v;
      this.getList();
    },
    // 处理搜索
    handleSearch() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    // 删除
    handleDelete (uid) {
      this.$confirm('删除后不可恢复，确定要删除吗？', '删除', {
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 参数处理
        let params = {uid};
        // 请求
        request.post('user/manage/del', params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.getList()
              }
            })
          } else {
            util.message({
              message: res.msg
            })
          }
        })
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.getList()
  }
}
