<template>
    <div class="am-write-box">
        <div class="am-write-header clearfix">
            <h2>{{title}}</h2>
            <input class="am-btn-issue" type="button" :value="btnText" @click="saveArticleFn"/>
        </div>
        <div class="am-article-tit">
            <el-select
            class="am-write-select clearfix"
            popper-class="am-write-option"
            placeholder="请选择"
            v-model="typeVal"
            >
                <el-option
                v-for="(item) in typeList"
                :key="`typeList_${item.value}`"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
            <div class="input-box">
                <input type="text" v-model.trim="form.title" placeholder="请输入标题">
            </div>
        </div>
        <div class="am-article-tag">
            <div class="tag-input">
                <input
                type="text"
                placeholder="标签，如：php(用逗号，分号，分隔)"
                v-model.trim="form.tags"
                @click.stop="showTagList"
                >
                <el-tag
                :key="`selectTags_${item}`"
                v-for="item in selectedTagList"
                closable
                :disable-transitions="false"
                @close="removeTag(item)">
                {{item.name}}
                </el-tag>
                <div class="dropdown-tag" :class="{on: tagList.show}">
                    <span
                    :key="`articleTags_${item}`"
                    v-for="item in tagList.list"
                    >{{item}}</span>
                </div>
            </div>
        </div>
        <div class="am-article-editor" :style="{top: style.editorTop+'px'}">
            <mavon-editor 
            v-model = 'editorContent'
            :ishljs="true"
            ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"
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
    form: {
        [index: string]: number | string;
    } = {
        type: 1,
        title: '',
        content: '',
        origin_link: '',
        tags: '',
        channels: '',
        feature: 0
    };
    // 类型列表
    typeList: Array<{
        value: string;
        label: string;
    }> = [
        {value: '1', label: '原创'},
        {value: '2', label: '转载'},
        {value: '3', label: '翻译'}
    ];
    typeVal: string = '原创';
    // 样式
    style: {
        [index: string]: number;
    } = {
        editorTop: 239
    };
    // 标签
    selectedTagList: string[] = [];
    tagList: {
        show: boolean;
        list: string[];
    } = {
        show: false,
        list: ['vue', 'react', 'webpack', 'mongoose']
    };
    editorContent: string = '';
    img_file:Array<any> = [];
   
    create() {
    }
    // 展示标签
    showTagList() {
        this.tagList.show = true;
    }
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('image', $file);
        this.img_file[pos] = $file;
        service({
            url: '/api/edit/uploadimg',
            method: 'post',
            data: formdata,
            headers: { 'Content-Type': 'multipart/form-data' },
            success: (url: string) => {
                this.$refs.md.$img2Url(pos, url);
            }
        })
    }
    $imgDel(pos) {
        delete this.img_file[pos];
    }
    // 保存文章
    saveArticleFn() {
        let params: Object = {};
        console.log(this.typeVal, this.form.title);
    }
}
</script>
