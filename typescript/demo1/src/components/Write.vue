<template>
    <div class="am-write-box">
        <div class="am-write-header clearfix">
            <h2>{{title}}</h2>
            <input class="am-btn-issue" type="button" :value="btnText"/>
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
            <el-select
            class="am-write-select clearfix"
            popper-class="am-write-option"
            placeholder="请选择"
            v-model="featureVal"
            >
                <el-option
                v-for="item in featureList"
                :key="`featureList_${item.id}`"
                :label="item.name"
                :value="item.id"
                >
                </el-option>
            </el-select>
            <div class="tag-input">
                <input
                type="text"
                placeholder="标签，如：php(用逗号，分号，分隔)"
                v-model.trim="form.tags"
                @click.stop="showTagList"
                >
                <el-tag
                :key="`selectTags_${item.id}`"
                v-for="item in selectedTagList"
                closable
                :disable-transitions="false"
                @close="removeTag(item.id)">
                {{item.name}}
                </el-tag>
                <div class="dropdown-tag" v-show="tagList.show" :style="{left: tagList.left+'px'}">
                    <span
                    :key="`articleTags_${item.id}`"
                    v-for="item in tagList.list"
                    >{{item.name}}</span>
                </div>
            </div>
        </div>
        <div class="am-article-editor" :style="{top: style.editorTop+'px'}">
            <div class="am-toobar">
                <ul>
                    <li @click="showUploadImgDialog"><span class="zh-icon zh-icon-img"></span></li>
                </ul>
            </div>
            <div class="am-edit">
                <textarea ref="textarea" v-model.trim="form.content" @keydown="handleTabIndent"></textarea>
            </div>
            <div class="am-edit-preview" v-html="cEditPreview"></div>
        </div>

        <!-- 插入图片弹层 -->
        <el-dialog
		class="am-sr-dialog"
		title="插入图片"
		:visible.sync="dialogs.uploadImg.visible"
		width="450px"
		:modal=true
		:center=true
		:close-on-click-modal=false
		@close="hideUploadImgDialog"
		>
			<ul class="zh-tab">
                <li 
                    v-for="(v,k) in dialogs.uploadImg.tab.list" 
                    :key="k"
                    :class="{active: dialogs.uploadImg.tab.active===k}"
                    @click="changeUploadImgTab(k)"
                >
                    {{ v }}
                </li>
            </ul>
            <div class="zh-tabody" v-show="dialogs.uploadImg.tab.active==='local'">
                <div style="padding: 30px 0 15px;">
                    <label class="zh-btn-upload" for="upload_img">
                        <input id="upload_img"
                            type="file" accept="image/*"
                            @change="changeLocalImg"
                        >上传图片
                    </label>
                </div>
            </div>
            <div class="zh-tabody" v-show="dialogs.uploadImg.tab.active==='remote'">
                <div style="padding: 30px 0 15px;">
                    <input type="text" class="zh-input" placeholder="请输入网络图片地址" v-model.trim="dialogs.uploadImg.form.remote">
                    <button type="button" class="zh-btn-radius zh-btn-blue" @click="submitRemoteImg">确定</button>
                </div>
            </div>
		</el-dialog>

    </div>
</template>
<script lang="ts">
import '../assets/sass/page.scss';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import service from '../utils/request';
import Header from './Header.vue';
import { Dialog } from 'element-ui';
declare let showdown: any;
declare let Prism: any;
let timeoutFlag: number;
// let routeQuery = $.search2json();
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
    // query: string = routeQuery;
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
        left: number;
    } = {
        show: false,
        list: [],
        left: 0
    };
    // 专栏列表
    featureList: Array<{
        id: string;
        name: string;
    }> = [
        {id: '1', name: '个人文章'},
        {id: '2', name: '前端开发'}
    ];
    featureVal: string = '个人文章';
    // 频道列表
    channelList: string[] = [];
    // 对话框
    dialogs: {
        [index: string]: {
            visible: boolean;
            tab?: {
                active: string;
                list: {
                    [index: string]: string;
                };
            };
            form: {
                [index: string]: string | number;
            }
        };
    } = {
        // 上传图片
        uploadImg: {
            visible: false,
            tab: {
                active: 'local',
                list: {
                    local: '本地上传',
                    remote: '远程网络图片'
                }
            },
            form: {
                local: '',
                remote: ''
            }
        },
        // 创建标签
        createTag: {
            visible: false,
            form: {
                name: '',
                channel: 0,
                remark: ''
            }
        }
    };

    // 编辑预览
    get cEditPreview() {
        let html = new showdown.Converter({simpleLineBreaks: true}).makeHtml(this.form.content);
        return this.parseCode(html);
    }
    // 是否显示原文链接
    get cShowOriginLink() {
        let flag = this.form.type == 2;
        if(flag) {
            this.style.editorTop = 239;
        } else {
            this.style.editorTop = 190;
        }
        return flag;
    }
    // 内容
    @Watch('form.content')
    onContChange() {
        this.$nextTick(() => {
            Prism.highlightAllUnder(document.querySelector('.zh-edit-preview'));
        });
    }
    // 标签
    @Watch('form.tags')
    onTagChange(newV: string) {
        if(newV) {
            if(timeoutFlag) {
                clearTimeout(timeoutFlag);
            }
            timeoutFlag = setTimeout(() => {
                let tags = this.form.tags;
                let filterArr = this.tagList.list.filter((v: any) => {
                    return v.name === tags;
                });
                if(!filterArr.length) {
                    this.showCreateTagDialog();
                }
            }, 1000);
        }
    }

    // 显示创建标签对话框
    showCreateTagDialog() {
        this.tagList.show = false;
        this.dialogs.createTag.form.name = this.form.tags;
        this.dialogs.createTag.visible = true;
    }
    // 隐藏创建标签对话框
    hideCreateTagDialog() {
        this.dialogs.createTag.form = {
            name: '',
            channel: 0,
            remark: ''
        };
        this.dialogs.createTag.visible = false;
        this.form.tags = '';
    }
    // 显示上传图片对话框
    showUploadImgDialog() {
        this.dialogs.uploadImg.visible = true;
    }
    // 隐藏上传图片对话框
    hideUploadImgDialog() {
        this.dialogs.uploadImg.visible = false;
    }
    // 改变上传图片tab
    changeUploadImgTab(k: string) {
        (this.dialogs.uploadImg.tab as any).active = k;
    }
    // 生成markdown图片
    generateMDImg(filename: string, originalname?: string) {
        let filenamePlaceholder = filename;
        if(originalname) {
            filenamePlaceholder = originalname;
        }
        let img: string = '!['+filenamePlaceholder+']('+filename+')',
            $textarea: any = this.$refs.textarea;
        $.insertAtCaret($textarea, img);
        this.form.content = $textarea.value;
        this.dialogs.uploadImg.visible = false;
    }
    // 改变本地图片
    changeLocalImg(e: Event) {
        let formData = new FormData();
        formData.append('file', (e.target as any).files[0]);
        service({
            type: 'post',
            url: '/user/upload/image',
            data: formData,
            success: (res: any) => {
                if(res.status) {
                    this.generateMDImg(res.data.filename, res.data.originalname);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        duration: 1000
                    });
                }
            }
        });
    }
    // 提交远程图片
    submitRemoteImg() {
        let removeImg: any = this.dialogs.uploadImg.form.remote;
        if(removeImg) {
            this.generateMDImg(removeImg);
        } else {
            this.$message({
                message: '请添加远程网络图片地址！',
                type: 'error',
                duration: 1000
            });
        }
    }
    // 选择标签
    selectTag(v: any) {
        let copySelectedTagList = this.selectedTagList.concat();
        if(copySelectedTagList.length < 5) {
            let isExist = copySelectedTagList.some((v2: any) => {
                return v2.id === v.id;
            });
            if(!isExist) {
                this.selectedTagList.push(v);
            }
        }
        this.form.tags = '';
    }
    // 删除标签
    removeTag(id: string) {
        let copySelectedTagList = this.selectedTagList.concat();
        this.selectedTagList = copySelectedTagList.filter((v: any) => {
            return v.id== id;
        });
    }
    // 显示标签列表
    showTagList(e: any) {
        this.tagList.left = e.target.offsetLeft;
        this.tagList.show = true;
    }
    // 解析代码
    parseCode(str: string) {
        let matchCodeArr = str.match(/\<code\s*(class\=\"(.*)\")?\>/g); // 匹配code标签
        if (matchCodeArr) {
            // 匹配{1-2}
            let matchRangeArr: string[] = [];
            matchCodeArr.forEach((v: string) => {
                let matchRange = v.match(/(\{\d+(\-\d+)?\})/g);
                if (matchRange) {
                    matchRangeArr.push(matchRange[0].replace(/\{|\}/g, ''));
                } else {
                    matchRangeArr.push('');
                }
            });
            // 匹配pre开始标签
            let matchPreArr = str.split(/\<pre/),
                replaceStr = '',
                matchPreIndex = 0;
            // 替换pre开始标签
            matchPreArr.forEach((v: string, i: number) => {
            if (/^\>\<code/.test(v)) { // 判断是否><code开头人
                if (matchRangeArr[matchPreIndex]) {
                replaceStr += '<pre data-line="' + matchRangeArr[matchPreIndex] + '" class="line-numbers language-js"' + v;
                } else {
                replaceStr += '<pre class="line-numbers language-js"' + v;
                }
                matchPreIndex++;
            } else {
                replaceStr += v;
            }
            });
            return replaceStr;
        }
        return str;
    }
    // 处理tab缩进
    handleTabIndent(e: any) {
        switch (e.keyCode) {
            // tab键
            case 9:
            e.preventDefault();
            let indent = ' '.repeat(this.config.tabIndent),
                start = e.target.selectionStart,
                end = e.target.selectionEnd,
                selected = (window as any).getSelection().toString();
            selected = indent + selected.replace(/\n/g, '\n' + indent);
            e.target.value = e.target.value.substring(0, start) + selected + e.target.value.substring(end);
            e.target.setSelectionRange(start + indent.length, start + selected.length);
            break;
            // z键
            case 90:
            if (e.ctrlKey) { // 撤销
                if (e.shiftKey) { // 重做
                    console.log(1);
                } else {
                    console.log(2);
                }
            }
            break;
        }
    }
    // 发布
    publish() {
        // 参数处理
        let params: any = $.extend({}, this.form),
            selectedTagList: any = this.selectedTagList,
            tagArr: string[] = [],
            channelArr: string[] = [];
        if(selectedTagList.length) {
            selectedTagList.forEach((v: any) => {
            tagArr.push(v.id);
            if(channelArr.indexOf(v.channel) === -1) {
                channelArr.push(v.channel);
            }
            });
            params.tags = tagArr.join(',');
            params.channels = channelArr.join(',');
        }
        if(params.type !== 2) {
            params.origin_link = '';
        }
        // 验证
        let errMsg = '';
        if(!params.title) {
            errMsg += '标题没有填写！<br>';
        }
        if(!params.content) {
            errMsg += '内容没有填写！<br>';
        }
        if(!params.tags) {
            errMsg += '缺少标签！<br>';
        }
        if(errMsg) {
            this.$message({
                message: errMsg,
                type: 'error',
                duration: 1000
            });
            return;
        }
        let url: string = '/user/article/add';
        if(this.query.id) {
            url = '/user/article/edit';
        }
        // 请求
        service({
            type: 'post',
            url,
            data: params,
            success: (res: any) => {
                if(res.status) {
                    // 删除缓存数据
                    if(localStorage.getItem('formData')) {
                        localStorage.removeItem('formData');
                        localStorage.removeItem('formTag');
                    }
                    this.$message({
                        message: res.message,
                        type: 'success',
                        duration: 1000
                    });
                    location.href = '/';
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        duration: 1000
                    });
                }
            }
        });
    }
    // 获取文章详情
    getArticleDetail() {
        let id = this.query.id;
        if(id) {
            service({
                type: 'post',
                url: '/user/article/detail',
                data: {id: +id},
                success: (res: any) => {
                    if(res.status) {
                        let data = res.data;
                        if(localStorage.getItem('formData')) {
                            this.form = JSON.parse((localStorage as any).getItem('formData'));
                            this.selectedTagList = JSON.parse((localStorage as any).getItem('formTag'));
                        } else {
                            this.form = {
                                id: data.id,
                                type: data.type,
                                title: data.title,
                                content: data.content,
                                origin_link: data.origin_link,
                                tags: '',
                                feature: data.feature
                            };
                            // 选择的标签
                            let tags = data.tags;
                            if(tags) {
                                let tagsArr = tags.split(',');
                                this.selectedTagList = this.tagList.list.filter((v: any) => {
                                    if(tagsArr.indexOf(''+v.id)!==-1) {
                                        return v;
                                    }
                                });
                            }
                        }
                    } else {
                        this.$message({
                            message: res.message,
                            type: 'error',
                            duration: 1000
                        });
                    }
                }
            });
        }
    }
    // 缓存数据
    cacheData() {
        setInterval(() => {
            localStorage.setItem('formData', JSON.stringify(this.form));
            localStorage.setItem('formTag', JSON.stringify(this.selectedTagList));
        }, 5 * 1000);
    }
    create() {
        // console.log(this.typeList);
    }
}
</script>
