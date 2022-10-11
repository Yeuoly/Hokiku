<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h1 class="headline">编辑博客</h1>
                <v-icon size="30" color="red" v-if="saving_status == 'unsaved'" title="未保存">mdi-close</v-icon>
                <v-progress-circular
                    v-if="saving_status == 'saving'"
                    indeterminate
                    color="primary"
                    class="ml-5"
                    :size="30"
                    :width="3"
                ></v-progress-circular>
                <v-icon size="30" color="green" v-if="saving_status == 'saved'" title="已保存">mdi-check</v-icon>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="title" label="标题"></v-text-field>
                <v-row>
                    <v-col :cols="3" :sm="3" :md="3" :lg="2" :xl="1">
                        <v-switch label="自动保存" v-model="auto_save"></v-switch>
                    </v-col>
                    <v-col>
                        <v-switch label="显示错误" v-model="display_error"></v-switch>
                    </v-col>
                </v-row>
                <v-chip color="red" dark>切换编辑器前请保存编辑内容！！！避免内容丢失</v-chip>
                <v-radio-group row v-model="content_type" label="编辑器">
                    <v-radio label="富文本" :value="1"></v-radio>
                    <v-radio label="Markdown" :value="2"></v-radio>
                </v-radio-group>
                <RichEditor v-model="content" v-if="content_type === 1"></RichEditor>
                <MarkdownEditor v-model="content" v-else-if="content_type === 2"></MarkdownEditor>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="save">保存</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import RichEditor from '../../components/common/RichEditor.vue'
import MarkdownEditor from '../../components/common/MarkdownEditor.vue'
import { api_blog_detail, api_create_blog, api_update_blog } from '../../interface/api'
import { openErrorSnackbar } from '../../concat/bus'

export default {
    components : { RichEditor, MarkdownEditor },
    data : () => ({
        title : '',
        content : '',
        auto_save : true,
        content_type : 1,
        saving_status : 'unsaved',
        display_error : false,
        id : 0,
        timer : null,
    }),
    methods : {
        async save(){
            if (this.saving_status == 'saving') {
                return
            }
            if (this.title == '') {
                return
            } else if (this.content == '') {
                return
            }

            this.saving_status = 'saving'
            const success_cb = () => {
                this.saving_status = 'saved'
            }
            const error_cb = (err) => {
                this.saving_status = 'unsaved'
                if (this.display_error) {
                    openErrorSnackbar(err)
                }
            }
            if (this.id == 0) {
                this.create(success_cb, error_cb)
            } else {
                this.update(success_cb, error_cb)
            }
        },
        async create (success_cb, error_cb) {
            const { data } = await api_create_blog(this.title, this.content, this.content_type)
            if (data && data['res'] == 0) {
                this.id = data['data']['id']
                success_cb && success_cb()
            } else {
                error_cb && error_cb(data ? data['err'] : '未知错误')
            }
        },
        async update (success_cb, error_cb) {
            const { data } = await api_update_blog(this.id, this.title, this.content, this.content_type)
            if (data && data['res'] == 0) {
                success_cb && success_cb()
            } else {
                error_cb && error_cb(data ? data['err'] : '未知错误')
            }
        },
        async load() {
            this.saving_status = 'saving'
            const { data } = await api_blog_detail(this.id)
            if (data && data['res'] == 0) {
                this.title = data['data']['blog']['title']
                this.content = data['data']['blog']['r_rich_content']['content']
                this.content_type = data['data']['blog']['r_rich_content']['type']
                setTimeout(() => {
                    this.saving_status = 'saved'
                })
            } else {
                this.saving_status = 'unsaved'
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        }
    },
    watch : {
        content() {
            this.saving_status = 'unsaved'
        },
        title() {
            this.saving_status = 'unsaved'
        },
        content_type() {
            this.saving_status = 'unsaved'
        }
    },
    mounted(){
        const id = parseInt(this.$route.params.id)
        if (id != 0 && !isNaN(id)) {
            this.id = id
            this.load()
        } else if (isNaN(id)) {
            this.$router.push('/blog')
        }
        
        this.timer = setInterval(() => {
            if (this.auto_save && this.saving_status == 'unsaved') {
                this.save()
            }
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<style>

</style>