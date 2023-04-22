<template>
    <v-row class="px5 py5">
        <v-col sm="12" md="6" lg="4" xl="3"
            v-for="(i, k) in list"
            :key="k"
        >
            <v-card class="clickable" @click="openDetail(i)">
                <v-card-title>{{ i.title }}</v-card-title>
                <v-img height="200" :src="i.r_cover.url"></v-img>
                <v-card-text class="text-12 text-grey" style="height: 90px">
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
        <v-dialog v-model="dialog.open" width="500">
            <v-card class="px2 py2">
                <h3 class="px1 py1">
                    {{ dialog.title }}
                </h3>
                <div class="text-grey text-14">
                    主讲：{{ dialog.owner }} <br>
                    发布时间：{{ new Date(dialog.time * 1000).formatDate('Y-M-D h:m:s') }}
                </div>
                <v-img :src="dialog.cover"></v-img>
                <div class="text-grey text-14 mb5 mt2">
                    {{ dialog.desc }}
                </div>
                <v-btn color="primary" class="mr2" @click="toCourse">进入课程</v-btn>
                <v-btn color="primary" :disabled="dialog.subcribe" @click="subscribe">订阅课程</v-btn>
                <div class="mt5">目录</div>
                <div class="px3 py3" style="background-color: rgba(0,0,0, .05)">
                    <div v-for="(j, p) in dialog.list"
                        :key="p"
                    >
                        {{ p + 1 }} . {{ j.title }}
                    </div>
                </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_course_detail, api_course_public_list, api_course_subscribe } from '../../interface/api'
export default {
    data : () => ({
        page : 1,
        length : 0,
        list : [],
        dialog : {
            id : 0,
            open : false,
            title : '',
            cover : '',
            desc : '',
            owner : '',
            time : 0,
            list : [],
            subcribe : false
        }
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
        toCourse(){
            this.$router.push(`/knowledge/course/${this.dialog.id}`)
        },
        async subscribe(){
            const { data } = await api_course_subscribe(this.dialog.id)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.dialog.subcribe = true
                }
            }
        },
        async openDetail(item){
            this.dialog.open = true
            this.dialog.title = item.title
            this.dialog.cover = item.r_cover.url
            this.dialog.time = item.time
            this.dialog.desc = item.desc
            this.dialog.owner = item.r_owner.nickname
            this.dialog.id = item.id

            const { data } = await api_course_detail(item.id)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    if(data['data'] != null){
                        this.dialog.subcribe = data['data']['subscribe']
                        this.dialog.list = data['data']['units']
                    }
                }
            }
        }
    }
}
</script>

<style>

</style>