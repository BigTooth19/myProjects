<template>
    <div class="am-write-box">
        <div class="am-write-header clearfix">
            <h2>写文章</h2>
            <input class="am-btn-issue" type="button" value="发布文章"/>
        </div>
        <div class="am-article-tit">
            <el-select
            class="am-write-select clearfix"
            popper-class="am-write-option"
            v-model="writeType" 
            placeholder="请选择"
            >
                <el-option
                v-for="(item,index) in writeTypes"
                :key="`writeTypes_${index}`"
                :label="item"
                :value="item"
                >
                </el-option>
            </el-select>
            <div class="input-box">
                <input type="text" placeholder="请输入标题">
            </div>
        </div>
        <div class="am-article-tag">
            <el-select
            class="am-write-select clearfix"
            popper-class="am-write-option"
            v-model="writeType" 
            placeholder="请选择"
            >
                <el-option
                v-for="(item,index) in articleTypes"
                :key="`articleTypes_${index}`"
                :label="item"
                :value="item"
                >
                </el-option>
            </el-select>
            <div class="tag-input">
                <input type="text" placeholder="">
                <el-tag
                :key="`selectTags_${index}`"
                v-for="(item,index) in selectTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{item}}
                </el-tag>
                <div class="dropdown-tag">
                    <span
                    :key="`articleTags_${index}`"
                    v-for="(item,index) in articleTags"
                    >{{item}}</span>
                </div>
            </div>
        </div>
        <div class="am-article-text">
            
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
    writeType: string = '原创';
    writeTypes: string[] = ['原创', '转裁', '翻译'];
    articleTypes: string[] = ['前端', '后端', '小程序'];
    articleTags: string[] = ['vue','react','typescript','vuex','mysql','redux','axios','express'];
    selectTags: string[] = [];
    
}
</script>
