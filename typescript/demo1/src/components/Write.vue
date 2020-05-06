<template>
    <div class="am-write-box" @click="bodyClickFn">
        <div class="am-write-header clearfix">
            <h2>{{title}}</h2>
            <input class="am-btn-issue" type="button" :value="btnText" @click="saveArticleFn"/>
        </div>
        <div class="am-article-tit">
            <div class="input-box">
                <input type="text" v-model.trim="articleTit" placeholder="请输入标题">
            </div>
        </div>
        <div class="am-article-tag">
            <div class="tag-input" @click.stop="showTagFn">
                <el-tag
                :key="tag"
                v-for="tag in tagList.selected"
                closable
                :disable-transitions="false"
                @close="tagCloseFn(tag)">
                {{tag}}
                </el-tag>
                <span class="add-tag">+添加标签</span>
                <div class="dropdown-tag" :class="{on: tagList.show}">
                    <span
                    :key="`articleTags_${item}`"
                    v-for="item in tagList.list"
                    @click="selectTagFn(item)"
                    >{{item}}</span>
                </div>
            </div>
        </div>
        <div class="am-article-editor">
            <mavon-editor 
                :ishljs="true"
                ref="md"
                v-model='editorContent'
                @imgAdd="$imgAdd"
                @imgDel="$imgDel"
            />
        </div>
    </div>
</template>
<script lang="ts">
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '../assets/sass/page.scss';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import service from '../utils/request';
import Header from './Header.vue';
import { Dialog } from 'element-ui';
Vue.use(mavonEditor);
let timeoutFlag: number;
let title: string = '创建文章';
let btnText: string = '发布文章';
// if(routeQuery.id) {
//     title = '编辑文章';
//     btnText = '保存修改';
// }
// 清除缓存
// if(location.hash==='#clearCache') {
// if(localStorage.getItem('formData')) {
//     localStorage.removeItem('formData');
//     localStorage.removeItem('formTag');
// }
// location.hash = '';
// }

@Component({
    components: {
        Header
    }
})
export default class Home extends Vue {
    title: string = title;
    btnText: string = btnText;
    query: {
        [index: string]: string
    } = {
        id: '1'
    };
    // 配置
    config: {
        [index: string]: number
    } =  {
        tabIndent: 2
    };
    // 表单
    articleTit: string = '';
    // 标签
    tagList: {
        show: boolean;
        list: string[];
        selected: string[];
    } = {
        show: false,
        list: ['vue','vue-router', 'vuex', 'react', 'redux', 'webpack', 'mongoose', 'php', 'mysql', 'http'],
        selected: []
    };
    // markdown编辑器
    editorContent: string = '';
    img_file: Array<any> = [];
   
    create() {
    }
    bodyClickFn() {
        this.tagList.show = false;
    }
    // 展示标签
    showTagFn() {
        this.tagList.show = true;
    }
    selectTagFn(tag) {
        if(!this.tagList.selected.includes(tag)) {
            this.tagList.selected.push(tag);
        }
    }
    tagCloseFn(tag) {
        this.tagList.selected.splice(this.tagList.selected.indexOf(tag), 1);
    }
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('image', $file);
        this.img_file[pos] = $file;
        // console.log('imgAdd',$file);
        // service({
        //     url: '/api/edit/uploadimg',
        //     method: 'post',
        //     data: formdata,
        //     headers: { 'Content-Type': 'multipart/form-data' },
        //     success: (url: string) => {
        //         (this.$refs.md as any).$img2Url(pos, url);
        //     }
        // })
    }
    $imgDel(pos) {
        delete this.img_file[pos];
    }
    // 保存文章
    saveArticleFn() {
        let params: Object = {
            title: this.articleTit,
            tags: this.tagList.selected,
            content: this.editorContent
        };
        service({
            type: 'post',
            url: '/article/add',
            data: params,
            success: (res: object) => {
                console.log('res:',res);
            }
        });
    }
}
</script>
