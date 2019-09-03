<template>
    <div>
        <Header></Header>
        <div class="am-container clearfix">
            <div class="am-side-left">
                <ul>
                    <li class="active">为你推荐</li>
                    <li>最新内容</li>
                </ul>
                <h4>技术频道</h4>
                <ul>
                    <li>前端</li>
                    <li>后端</li>
                    <li>小程序</li>
                </ul>
            </div>
            <div class="am-main">
                <h3 class="am-title">为你推荐</h3>
                <div class="am-list">
                    <h5><a href="#">为什么我喜欢JavaScript的Optional Chaining</a></h5>
                    <p>JavaScript 的特性极大地改变了你的编码方式。从 ES2015 开始，对我代码影响最多的功能是解构、箭头函数、类和模块系统</p>
                    <div class="btm">
                        <div class="favor"><span class="icon-zan">赞</span><span>x 2</span></div>
                        <span class="user">张三</span>
                        <span class="time">3小时前</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import '../assets/sass/page.scss';
import { Component, Vue } from 'vue-property-decorator';
import Header from './Header.vue';

@Component({
    components: {
        Header
    }
})
export default class Home extends Vue {
    
}
</script>
