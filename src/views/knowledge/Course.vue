<template>
    <v-container>
        <v-card-title>
            {{ course.title }}
        </v-card-title>
        <v-card-text>
            <span> {{ course.r_owner.nickname }} - {{ new Date(course.time * 1000).formatDate('Y-M-D h:m:s') }}</span>
        </v-card-text>
        <v-row v-if="$vuetify.breakpoint.lg">
            <v-col md="8">
                <CommonVideo :src="current_unit.r_media.url" :height="500" :width="container_width" />
                <PPTContainer :src="current_unit.r_ppt.url" :height="500" :width="container_width" />
            </v-col>
            <v-col md="4">
                <h4>目录</h4>
                <v-divider class="pt5"></v-divider>
                <ul class="course-progress-ul" style="background-color: rgba(0,0,0,.05)">
                    <div v-for="(i, k) in units"
                        :key="k"
                        class="py1 clickable"
                        @click="selectUnit(i)"
                    > {{ i.name }} </div>
                </ul>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col xl="6" md="12" cols="12">
                <CommonVideo :src="current_unit.r_media.url" :height="500" :width="container_width" />
            </v-col>
            <v-col xl="6" md="12" cols="12">
                <PPTContainer :src="current_unit.r_ppt.url" :height="500" :width="container_width" />
            </v-col>
            <v-col>
                <h4>目录</h4>
                <v-divider class="pt5"></v-divider>
                <ul class="course-progress-ul" style="background-color: rgba(0,0,0,.05)">
                    <div v-for="(i, k) in units"
                        :key="k"
                        class="py1 clickable"
                        @click="selectUnit(i)"
                    > {{ i.name }} </div>
                </ul>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import PPTContainer from '../../components/common/PPTContainer.vue'
import CommonVideo from '../../components/common/CommonVideo.vue'

import { openErrorMessageBox } from '../../concat/bus'
import { api_course_get_progress } from '../../interface/api'

export default {
    components : { PPTContainer, CommonVideo },
    data : () => ({
        course : {},
        units : [],
        cid: 0,
        current_unit : null,
        container_width : 750
    }),
    methods : {
        async load(){
            const cid = this.$route.params.cid
            const { data } = await api_course_get_progress(cid)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.course = data['data']['course']
                    this.units = data['data']['units']
                    this.current_unit = data['data']['units'][0]
                }
            }
        },
        resize(){
            if(this.$vuetify.breakpoint.lgAndUp){
                console.log(this.$refs)
            }
        },
        selectUnit(unit){
            this.current_unit = unit
        }
    },
    mounted(){
        this.load()
        setTimeout(() => {
            this.resize()
        })
    }
}
</script>

<style>
    .course-progress-ul .clickable:hover{
        color: rgb(35,173,229);
    }
</style>