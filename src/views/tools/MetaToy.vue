<template>
  <div>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-alert
                    outlined
                    type="success"
                    text
                >
                    Metatoy编/解码
                </v-alert>
                <v-divider></v-divider>
                <v-card-text>
                    <v-icon color="green">
                        mdi-information
                    </v-icon>
                    一些须知：
                    <ul>
                        <li>Metatoy为一个数据协议，详细定义暂不公开</li>
                        <li>纯前端实现，随便造</li>
                    </ul>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <v-btn color="primary" @click="open">打开JSON文本编辑器</v-btn>
                </v-card-text>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog v-model="dialog.show">
        <v-card>
            <v-card-title>
                Metatoy文本
            </v-card-title>
            <v-card-text>
                <CodeEditor v-model="json_text" :language="'javascript'"></CodeEditor>
            </v-card-text>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CodeEditor from '../../components/common/CodeEditor.vue'

export default {
    components : {
        CodeEditor
    },
    data : () => ({
        dialog :{
            show : false,
        },
        edit_lock : false,
        json_text : '',
        json_obj : {},
    }),
    watch : {
        json_text() {
            try {
                this.json_obj = JSON.parse(this.json_text)
            } catch (e) {
                this.json_obj = {}
            }
        }
    },
    methods : {
        open(){
            this.dialog.show = true
        },
    }
}
</script>

<style>

</style>