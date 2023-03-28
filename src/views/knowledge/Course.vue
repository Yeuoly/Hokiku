<template>
    <v-container>
        <v-card-title>
            {{ course.title }}
        </v-card-title>
        <v-card-text>
            <span> {{ course.r_owner && course.r_owner.nickname }} - {{ new Date(course.time * 1000).formatDate('Y-M-D h:m:s') }}</span>
        </v-card-text>
        <v-row>
            <v-col cols="8">
                <CommonVideo :src="current_unit && current_unit.r_media && current_unit.r_media.url" :height="500" style="width: 100%" />
                <PPTContainer :src="current_unit && current_unit.r_ppt && current_unit.r_ppt.url" :height="500" style="width: 100%" />
            </v-col>
            <v-col cols="4">
                <h4 class="px5 py5">目录</h4>
                <v-divider class="pt5"></v-divider>
                <ul class="course-progress-ul" style="background-color: rgba(0,0,0,.05)">
                    <div v-for="(i, k) in units"
                        :key="k"
                        class="py1 clickable"
                        @click="selectUnit(i)"
                    > {{ i.name }} </div>
                </ul>
                <h4 class="px5 py5"> 当前章节习题 </h4>
                <v-divider class="pt5"></v-divider>
                <ul class="course-progress-ul" style="background-color: rgba(0,0,0,.05)">
                    <div v-for="(i, k) in current_challenge.challenges || []"
                        :key="k"
                        class="py1 clickable"
                        @click="toChallenge(i)"
                    > 
                        <v-icon>
                            mdi-arrow-right
                        </v-icon>
                        <span>
                            {{ i.name }}
                        </span>
                    </div>
                </ul>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import PPTContainer from '../../components/common/PPTContainer.vue'
import CommonVideo from '../../components/common/CommonVideo.vue'

import { openErrorMessageBox, openErrorSnackbar } from '../../concat/bus'
import { 
    api_course_get_progress,
    api_course_challenge_unit_list
} from '../../interface/api'

export default {
    components : { PPTContainer, CommonVideo },
    data : () => ({
        course : {},
        units : [],
        cid: 0,
        current_unit : null,
        container_width : 750,
        current_challenge : {
            dialog : false,
            challenges : [],
            type : 0,
            id : 0
        }
    }),
    methods : {
        async load(){
            const cid = parseInt(this.$route.params.cid)
            if(cid) {
                this.cid = cid
            } else {
                this.$router.back()
                return
            }
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
                    this.loadChallenges()
                }
            }
        },
        openChallengeDialog(type, id){
            this.current_challenge.type = type
            this.current_challenge.id = id
            this.current_challenge.dialog = true
        },
        resize(){
            if(this.$vuetify.breakpoint.lgAndUp){
                console.log(this.$refs)
            }
        },
        async loadChallenges() {
            const { data } = await api_course_challenge_unit_list(this.cid, this.current_unit.id)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.current_challenge.challenges = data['data']['challenges']
                }
            }
        },
        selectUnit(unit){
            this.current_unit = unit
            this.loadChallenges()
        },
        toChallenge(chan) {
            console.log(chan)
            if (chan.type == 1) {
                this.$router.push(`/competition/train?id=${chan.challenge_id}`)
            }
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