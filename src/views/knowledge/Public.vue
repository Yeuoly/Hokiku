<template>
    <v-row class="px5 py5">
        <h1>比赛模块还在开发中哟，可以看看练习模块呀～</h1>
        <v-pagination
            v-model="page"
            :length="6"
        ></v-pagination>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_course_public_list } from '../../interface/api'
export default {
    data : () => ({
        page : 1,
    }),
    watch : {
        page : {
            handler(){
                this.load()  
            },
            immediate : true
        }
    },
    methods : {
        async load(){
            const page = this.page
            const { data } = await api_course_public_list(page, 10)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    if(data['data'] != null){
                        this.data = data['data']
                    }
                }
            }
        }
    }
}
</script>

<style>

</style>