<template>
    <div>
        <v-row>
            <v-col cols="4" v-if="src">
                <v-img @click="upload" :src="src" :height="height"></v-img>
            </v-col>
            <v-col cols="4">
                <v-btn icon @click="upload">
                    <v-icon>mdi-upload</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <input ref="ipt" type="file" style="display: none" @change="commit">
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_resource_upload_image } from '../../interface/api'
export default {
    props : ['height'],
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
            const { data } = await api_resource_upload_image(file)
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