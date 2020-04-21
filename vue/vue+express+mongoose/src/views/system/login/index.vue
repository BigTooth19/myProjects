<template>
	<div class="page-login">
		<div class="zh-login-main">
			<h2>账号登录</h2>
			<div class="zh-form-item">
				<d2-icon name="vcard"></d2-icon>
				<input type="text" v-model="form.tel" placeholder="请输入账号">
			</div>
			<div class="zh-form-item">
				<d2-icon name="lock"></d2-icon>
				<input type="password" v-model="form.pwd" @keyup.enter="submit" placeholder="请输入密码">
			</div>
			<div class="zh-forget-password">
				<!-- <el-checkbox>10天内免登录</el-checkbox> -->
				<a href="javascript:;" class="zh-forget-link" @click="forgetPassword">忘记密码</a>
			</div>
			<el-button class="zh-btn-login" type="primary" size="large" @click="submit">登录</el-button>
		</div>
	</div>
</template>
<script>
import index from './js/index';
export default index
</script>

<style lang="scss">
	@import "./scss";
</style>
