<template>
  <el-dialog
    :close-on-click-modal="false"
    title="新建账号"
    :visible="visible"
    :before-close="closeDialog"
    width="400px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model.trim="form.username" />
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model.trim="form.tel" />
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model.trim="form.unit_name" />
      </el-form-item>
      <el-form-item label="账户类型">
        <el-radio-group v-model="form.mlevel">
          <el-radio :label="0">普通用户</el-radio>
          <el-radio :label="1">管理员</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "@/plugin/axios";
import util from '@/libs/util';

export default {
  props: {
    visible: Boolean,
    refreshList: Function
  },
  data() {
    return {
      loading: false,
      form: {
        username: '',
        tel: '',
        unit_name: '',
        mlevel: 0
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: '请输入手机号',
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 关闭对话框
    closeDialog() {
      this.$refs.form.clearValidate();
      this.form = {
        nusername: '',
        tel: '',
        unit_name: '',
        mlevel: 0
      };
      this.$emit("close");
    },
    // 提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 参数处理
          let params = Object.assign({}, this.form);
          console.log('params:',params);
          // 请求
          this.loading = true;
          request.post('user/manage/add', params).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: '新增成功',
                duration: 1000,
                onClose: () => {
                  this.closeDialog();
                  // 刷新列表
                  this.refreshList();
                }
              });
            } else {
              util.message({
                message: res.msg
              })
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>
