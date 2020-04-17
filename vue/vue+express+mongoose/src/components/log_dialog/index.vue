<template>
    <el-dialog
      title="日志"
      :visible="visible"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      >
      <div>
        <el-input placeholder="请输入关键字" class="zh-width-280" v-model="search.keywords">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        class="zh-mt-16"
        height="200"
        fixed
        border
        v-loading="loading"
        :data="list"
        :stripe="true"
        :row-key="row=>row.id">
        <el-table-column
          type="index"
          label="序号"
          width="50"/>
        <el-table-column
          width="180"
          prop="create_time"
          label="时间"/>
        <el-table-column
          show-overflow-tooltip
          prop="operate_content"
          label="操作内容"/>
        <el-table-column
          width="100"
          prop="operate_user"
          label="操作人"/>
      </el-table>
      
      <el-pagination
        class="zh-mt-16"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        background
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"/>
    </el-dialog>
</template>

<script>
import request from '@/plugin/axios'
import Mock from 'mockjs'

export default {
  name: 'log_dialog',
  data() {
    return {
      loading: false,
      list: [],
      // 分页
      pagination: {
        currentPage: 1,
        total: 0
      },
      // 搜索
      search: {
        keywords: ''
      }
    };
  },
  props: {
      visible: { // 对话框显示
        type: Boolean,
        default: false
      },
      url: { // 地址
        type: String,
        default: '/api/log'
      },
      params: { // 参数
        type: Object,
        default() {
          return {}
        }
      },
      close: Function, // 关闭
  },
  watch: {
    visible(newV) { // 显示的时候请求日志数据
      if(newV && this.url) {
        this.getList();
        this.$nextTick(() => {
          // enter键搜索
          document.addEventListener('keyup', (e) => {
            if(e.keyCode===13 && document.activeElement.nodeName==='INPUT') {
              if(this.search.keywords) {
                this.getList();
              }
            }
          });
        });
      }
    }
  },
  methods: {
    // 获取列表
    getList() {
      // 参数处理
      let {keywords} = this.search;
      const { currentPage } = this.pagination;
      let params = {
        page: currentPage
      };
      if(keywords) {
        params['keywords'] = keywords;
      }
      if(Object.keys(this.params).length) {
        params = {...params, ...this.params};
      }

      let list = [];
      for(let i=0; i<15; i++) {
        list.push({
          id: Mock.mock('@guid'),
          operate_user: Mock.mock('@cname'),
          operate_content: Mock.mock('@cparagraph'),
          create_time: Mock.mock('@datetime')
        });
      }
      this.list = list;

      // 请求
      // this.loading = true;
      // request.get(this.url, {params}).then((res) => {
      //   if (res.status) {
      //     let resData = res.data;
      //     this.list = resData.list;
      //     // 分页
      //     this.pagination.total = resData.total;
      //   } else {
      //     this.$message({
      //       message: res.message,
      //       type: 'warning',
      //       showClose: true
      //     })
      //   }
      //   this.loading = false
      // });
    },
    // 分页-改变当前页
    handleCurrentChange(v) {
      this.pagination.currentPage = v
      this.getList()
    },
    // 取消对话框
    closeDialog() {
      this.$emit('close');
      // 重置数据
      this.pagination.currentPage = 1;
      this.search = {
        keywords: ''
      }
    },
    // 处理搜索
    handleSearch() {
      console.log(Math.random())
      this.getList();
    }
  }
}
</script>
