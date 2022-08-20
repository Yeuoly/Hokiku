<template>
    <div class="px2 py2">
        <v-row>
            <v-col :cols="preview ? 6 : 12">
                <RichEditor v-model="note.content" @change-preview="changePreview" />
                <v-progress-linear
                    :active="process"
                    indeterminate
                    color="cyan"
                ></v-progress-linear>
                <v-switch
                    v-model="note.is_wp"
                    label="公开为wp"
                    class="mt2"
                ></v-switch>
                <v-btn @click="commit" color="primary">提交</v-btn>
            </v-col>
            <v-col v-if="preview" :cols="6">
                <div class="note-editor-preview">
                    <v-card-title>预览</v-card-title>
                    <v-divider></v-divider>
                    <InnerHTML :html="note.content" />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus';
import { 
    api_competition_train_note_get ,
    api_competition_train_note_update
} from '../../interface/api'

import RichEditor from '../../components/common/RichEditor';
import InnerHTML from '../../components/common/InnerHTML';

export default {
    components : { RichEditor,InnerHTML },
    data : () => ({
        train_id : 0,
        note : {
            id : 0,
            content : '',
            content_type : 1,
            is_wp : false,
        },
        preview : false,
        process : false,
    }),
    methods : {
        async load() {
            this.process = true
            let { data } = await api_competition_train_note_get(this.train_id);
            if(!data) {
                openErrorMessageBox('失败', '获取笔记失败');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('失败', data['err']);
                } else {
                    this.note.content = data['data']['r_rich_content']['content'];
                    this.note.is_wp = (data['data']['flag'] & 4) == 4;
                }
            }
            this.process = false
        },
        async commit() {
            this.process = true
            let { data } = await api_competition_train_note_update(this.train_id, this.note.content, this.note.content_type, this.note.is_wp);
            if(!data) {
                openErrorMessageBox('失败', '提交笔记失败');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('失败', data['err']);
                } else {
                    openInfoMessageBox('成功', '提交笔记成功');
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
        const train_id = parseInt(this.$route.params.train_id);
        if (!train_id) {
            openErrorMessageBox('错误', '获取训练id失败');
            return;
        }
        this.train_id = train_id;
        this.load()
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