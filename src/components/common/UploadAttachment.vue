<template>
    <div>
        <v-row>
            <v-col v-if="src && id">
                <v-icon @click="upload">mdi-clipboard-file-outline</v-icon>
            </v-col>
            <v-col  v-else>
                <v-btn icon @click="upload">
                    <v-icon :style="{fontSize:size + 'px'}">mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <input ref="ipt" type="file" style="display: none" @change="commit">
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import {
    api_resource_upload_any_private
} from '../../interface/resource'
export default {
    name : 'UploadAttachment',
    props : {
        size : {
            type : Number,
            default : 24
        },
        id : {
            type : Number,
            default : 0
        },
    },
    data : () => ({
        src : ''
    }),
    model : {
        event : 'change',
        prop : 'id'
    },
    methods : {
        upload(){
            const ipt = this.$refs.ipt
            ipt.click()
        },
        async commit(){
            const file = this.$refs.ipt.files[0]
            const { data } = await api_resource_upload_any_private(file)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.src = data['data']['extra']
                    this.$emit('change', data['data']['id'])
                }
            }
        }
    }
}
</script>

<style>

</style>