<template>
    <v-container>
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    创建课程
                </v-toolbar-title>
            </v-toolbar>
            <div class="px5 py2">
                <v-text-field
                    label="标题"
                    v-model="new_model.title"
                ></v-text-field>
                <v-text-field
                    label="简介"
                    v-model="new_model.desc"
                ></v-text-field>
                <span class="text-grey">上传封面</span>
                <UploadImage v-model="new_model.cover_rid" :height="300" />
                <v-switch
                    label="是否公开"
                    v-model="new_model.public"
                ></v-switch>
                <v-btn color="primary" @click="commit">提交</v-btn>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_course_create } from '../../interface/api'
import UploadImage from '../../components/common/UploadImage.vue'

export default {
    components : {
        UploadImage
    },
    data : () => ({
        new_model : {
            type : 0,
            title : '',
            desc : '',
            cover_rid : 0,
            public : false
        },
    }),
    methods : {
        async commit(){
            const { data } = await api_course_create(
                this.new_model.type, 
                this.new_model.title,
                this.new_model.desc,
                this.new_model.cover_rid,
                this.new_model.public ? 1 : 0
            )
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '创建完成')
                }
            }
        },
    },
    mounted() {
        
    }
}
</script>

<style>

</style>