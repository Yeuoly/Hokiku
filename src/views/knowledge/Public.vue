<template>
    <v-row class="px5 py5">
        <v-col sm="12" md="6" lg="4" xl="3"
            v-for="(i, k) in list"
            :key="k"
        >
            <v-card class="clickable" @click="toCourse(i.id)">
                <v-card-title>{{ i.title }}</v-card-title>
                <v-img :src="i.r_cover.url"></v-img>
                <v-card-text class="text-12 text-grey" style="height: 70px">
                    {{ i.desc }}
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" class="text-center">
            <v-pagination
                v-model="page"
                :length="pages"
                :total-visible="6"
            ></v-pagination>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_course_public_list } from '../../interface/api'
export default {
    data : () => ({
        page : 1,
        length : 0,
        list : []
    }),
    computed : {
        pages(){
            return Math.ceil(this.length / 6)
        }
    },
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
                        this.list = data['data']['list']
                        this.length = data['data']['length']
                    }
                }
            }
        },
        toCourse(cid){
            this.$router.push(`/knowledge/course/${cid}`)
        }
    }
}
</script>

<style>

</style>