<template>
    <div class="px2 py2">
        <v-row>
            <v-col :cols="12">
                <v-card-title>
                    Writeup编写
                </v-card-title>
                <v-card-text>
                    <ul>
                        <li>Writeup的价格由Writeup作者决定，平台不会做任何干预</li>
                        <li>用户购买的Writeup的费用的50%将转入作者账户</li>
                    </ul>
                </v-card-text>
            </v-col>
            <v-col :cols="12">
                <v-text-field
                    v-model.number="wp.price"
                    label="价格"
                ></v-text-field>
            </v-col>
            <v-col :cols="preview ? 6 : 12">
                <RichEditor v-model="wp.content" @change-preview="changePreview" />
                <v-progress-linear
                    :active="process"
                    indeterminate
                    color="cyan"
                ></v-progress-linear>
                <v-btn @click="commit" color="primary">提交</v-btn>
            </v-col>
            <v-col v-if="preview" :cols="6">
                <div class="note-editor-preview">
                    <v-card-title>预览</v-card-title>
                    <v-divider></v-divider>
                    <InnerHTML :html="wp.content" />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus';
import { 
    api_comp_service_writeup_get,
    api_comp_service_writeup_update,
    api_comp_service_writeup_create
} from '../../interface/service'

import RichEditor from '../../components/common/RichEditor';
import InnerHTML from '../../components/common/InnerHTML';

export default {
    components : { RichEditor,InnerHTML },
    data : () => ({
        sid : 0,
        wp : {
            id : 0,
            content : '',
            price : 0,
        },
        preview : false,
        process : false,
    }),
    methods : {
        commit() {
            if (this.wp.id == 0) {
                this.create()
            } else {
                this.update()
            }
        },
        async load() {
            this.process = true
            let { data } = await api_comp_service_writeup_get(this.wp.id);
            if(!data) {
                openErrorMessageBox('失败', '获取WP失败');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('失败', data['err']);
                } else {
                    this.wp.content = data['data']['writeup']['content']
                    this.wp.price = data['data']['writeup']['price']
                }
            }
            this.process = false
        },
        async update() {
            this.process = true
            let { data } = await api_comp_service_writeup_update(this.wp.id, this.wp.content, this.wp.price);
            if(!data) {
                openErrorMessageBox('失败', '提交WP失败');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('失败', data['err']);
                } else {
                    openInfoMessageBox('成功', '提交WP成功');
                }
            }
            this.process = false
        },
        async create() {
            this.process = true
            let { data } = await api_comp_service_writeup_create(this.sid, this.wp.content, this.wp.price);
            if(!data) {
                openErrorMessageBox('失败', '提交WP失败');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('失败', data['err']);
                } else {
                    openInfoMessageBox('成功', '提交WP成功');
                }
            }
            this.process = false
        },
        changePreview(v) {
            this.preview = v;
        }
    },
    mounted() {
        // get train_id
        this.sid = parseInt(this.$route.params.sid);
        this.wp.id = parseInt(this.$route.params.wid);
        if (!this.sid) {
            this.$router.back();
            return;
        }
        if (this.wp.id) {
            this.load()
        }
    }
}
</script>

<style>
.note-editor-preview {
    border: solid 1px rgba(0,0,0,0.16);
    padding: 8px;
    overflow : auto;
    height: 422px;
}
</style>