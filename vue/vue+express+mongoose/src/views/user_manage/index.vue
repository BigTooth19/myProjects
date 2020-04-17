<template>
  <d2-container>
    <div class="zh-main-title">
      <div class="zh-left">
        <strong>用户管理</strong>
        <el-button class="zh-ml-16" type="primary" @click="showAddDialog">新建账号</el-button>
      </div>
      <div class="zh-right">
        <el-input class="zh-width-200 zh-fl" prefix-icon="el-icon-search" clearable v-model="search.keyword" @keyup.native.enter="handleSearch()" placeholder="输入手机号或姓名"></el-input>
        <el-button class="zh-fl zh-ml-8" type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <el-table
      class="zh-mt-16"
      fixed
      ref="table"
      v-loading="loading"
      :max-height="tableHgt"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :default-sort = "{prop: 'mlevel', order: 'descending'}"
      :row-key="row=>row.uid"
      :data="list"
    >
      <el-table-column type="index" width="100" label="序号" />
      <el-table-column
        label="手机号"
        prop="tel"
      />
      <el-table-column
        label="姓名"
        prop="username"
      />
      <el-table-column
        label="单位"
        prop="unit_name"
        sortable
      />
      <el-table-column
        label="账户类型"
        prop="mlevel"
        sortable
        :formatter="formatLevel"
      />
      <el-table-column width="160" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="resetPassword(scope.row.uid)">重置密码</el-button>
          <el-button type="text" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button class="zh-ml-8" type="text" @click="handleDelete(scope.row.uid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="zh-mt-16"
      background
      @current-change="changeCurrentPage"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>

    <!-- 新增对话框 -->
    <add-dialog
      :visible="dialogs.add.visible"
      :refreshList="getList"
      @close="closeAddDialog"
    />

    <!-- 编辑对话框 -->
    <edit-dialog
      :visible="dialogs.edit.visible"
      :data="dialogs.edit.data"
      :refreshList="getList"
      @close="closeEditDialog"
    />
  </d2-container>
</template>

<script>
import index from "./js/index";

export default index;
</script>
<style/>
