<template>
    <v-container>
        <v-row>
            <v-col 
                :cols="12"
            >
                <v-card>
                    <v-card-title>
                        <span class="headline">课程信息</span>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="course.title"
                            label="课程名称"
                            disabled
                        ></v-text-field>
                        <v-textarea
                            v-model="course.desc"
                            label="课程描述"
                            disabled
                        ></v-textarea>
                    </v-card-text>
                    <v-card-title>
                        <span class="headline">练习题内容</span>
                    </v-card-title>
                    <v-card-text>
                        <div v-for="(i, k) in course_units" :key="k">
                            <v-row>
                                <v-col :cols="3">
                                    <v-text-field
                                        v-model="course_units[k].title"
                                        label="章节名称"
                                        disabled
                                    ></v-text-field>
                                </v-col>
                                <v-col :cols="9">
                                    <v-sheet class="py-4 px-1">
                                        <v-chip-group
                                            multiple
                                        >
                                            <v-chip 
                                                v-for="chan, k in course_challenges" 
                                                :key="k"
                                                v-show="chan.uid == i.id"
                                                @click="openChallengeDialog(i, chan)"
                                            >
                                                {{ chan.name }}
                                            </v-chip>
                                            <v-chip :key="999999"
                                                color="primary"
                                                @click="openChallengeDialog(i)"
                                            >
                                                <v-icon>mdi-plus</v-icon>
                                                添加题目    
                                            </v-chip>
                                        </v-chip-group>
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="current_challenge.dialog" width="500">
            <v-card>
                <v-card-title>
                    <span class="headline">题目信息</span>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            v-model="current_challenge.name"
                            label="题目名称"
                        ></v-text-field>
                        <v-text-field
                            v-model.number="current_challenge.score"
                            label="题目分值"
                        ></v-text-field>
                        <v-text-field
                            v-model.number="current_challenge.challenge_id"
                            label="题目ID"
                            disabled
                        ></v-text-field>
                        <v-radio-group row v-model="current_challenge.challenge_type">
                            <!-- <v-radio
                                label="ACM"
                                value="acm"
                            ></v-radio> -->
                            <v-radio
                                label="CTF"
                                value="ctf"
                            ></v-radio>
                        </v-radio-group>
                        <v-autocomplete
                            v-model="current_challenge.select"
                            :items="current_challenge.search_items"
                            :loading="current_challenge.loading"
                            :search-input.sync="current_challenge.search"
                            cache-items
                            class="mx-4"
                            flat
                            hide-no-data
                            hide-details
                            solo-inverted
                            label="题目"
                        ></v-autocomplete>
                        <v-text-field
                            v-model="current_challenge.desc"
                            label="题目描述"
                        ></v-text-field>
                        <v-text-field
                            v-model="current_challenge.hint"
                            label="题目提示"
                        ></v-text-field>
                        <v-btn
                            color="primary"
                            @click="current_challenge.id == 0 ? createChallenge() : updateChallenge()"
                        >
                            {{ current_challenge.id == 0 ? '创建' : '更新' }}
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_course_challenge_course_list,
    api_course_get,
    api_course_detail,
    api_course_challenge_create,
    api_course_challenge_update,
    api_competition_train_title_search
} from '../../interface/api'

export default {
    data : () => ({
        course_id : 0,
        course_units : [],
        course : {
            title : '',
            desc : '',
        },
        course_challenges : [],
        current_challenge : {
            dialog : false,
            id : 0,
            name : '',
            unit_id : 0,
            challenge_id : 0,
            challenge_type : 0,
            score : 0,
            desc : '',
            hint : '',
            search : null,
            search_items : [],
            loading : false,
            select : '',
            timer : null,
        }
    }),
    methods : {
        async createChallenge() {
            const { data } = await api_course_challenge_create(
                this.current_challenge.name,
                this.current_challenge.unit_id,
                this.course_id,
                this.current_challenge.challenge_id,
                this.current_challenge.challenge_type,
                this.current_challenge.score,
                this.current_challenge.desc,
                this.current_challenge.hint,
            )
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.current_challenge.dialog = false
                    this.getCourseChallengeCourseList()
                    openSuccessSnackbar('创建成功')
                }
            }
        },
        async updateChallenge() {
            const { data } = await api_course_challenge_update(
                this.current_challenge.id,
                this.current_challenge.name,
                this.current_challenge.unit_id,
                this.course_id,
                this.current_challenge.challenge_id,
                this.current_challenge.challenge_type,
                this.current_challenge.score,
                this.current_challenge.desc,
                this.current_challenge.hint,
            )
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.current_challenge.dialog = false
                    this.getCourseDetail()
                    openSuccessSnackbar('更新成功')
                }
            }
        },
        async openChallengeDialog(unit, chan) {
            if (chan) {
                this.current_challenge.id = chan.id
                this.current_challenge.name = chan.name
                this.current_challenge.challenge_id = chan.challenge_id
                this.current_challenge.challenge_type = function(){
                    if(chan.challenge_type == 1){
                        return 'ctf'
                    }else{
                        return 'acm'
                    }
                }()
                this.current_challenge.score = chan.score
                this.current_challenge.desc = chan.desc
                this.current_challenge.hint = chan.hint
            } else {
                this.current_challenge.id = 0
            }
            this.current_challenge.unit_id = unit.id
            this.current_challenge.dialog = true
        },
        async getCourseDetail() {
            const { data } = await api_course_detail(this.course_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.course_units = data['data']['units']
                }
            }
        },
        async getCourse() {
            const { data } = await api_course_get(this.course_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.course.title = data['data']['title']
                    this.course.desc = data['data']['desc']
                }
            }
        },
        async getCourseChallengeCourseList() {
            const { data } = await api_course_challenge_course_list(this.course_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.course_challenges = data['data']['challenges']
                }
            }
        }
    },
    watch : {
        'current_challenge.select' : function(val) {
            if (val) {
                const dis = val.split(':')
                const id = parseInt(dis[0])
                if (id) {
                    this.current_challenge.challenge_id = id
                }
            }
        },
        'current_challenge.search' : function(val) {
            const self = this;
            const searcher = async () =>  {
                if (val && val === self.current_challenge.select) {
                    return
                }
                if (self.current_challenge.search.length > 0) {
                    self.current_challenge.loading = true
                    const { data } = await api_competition_train_title_search(self.current_challenge.search, 1, 20)
                    if(!data){
                        openErrorSnackbar('请检查网络连接')
                    }else{
                        if(data['res'] != 0){
                            openErrorSnackbar(data['err'])
                        }else{
                            console.log(data['data'])
                            self.current_challenge.search_items = data['data'] ? data['data'].map(v => {
                                return `${v.id}:${v.title}`
                            }) : []
                        }
                    }
                    self.current_challenge.loading = false
                }
                this.current_challenge.timer = null
            }
            if (this.current_challenge.timer) {
                clearTimeout(this.current_challenge.timer)
            }
            this.current_challenge.timer = setTimeout(searcher, 500)
        }
    },
    mounted() {
        this.course_id = parseInt(this.$route.params.course_id)
        if (this.course_id) {
            this.getCourse()
            this.getCourseChallengeCourseList()
            this.getCourseDetail()
        } else {
            this.$router.back()
        }
    }
}
</script>

<style>

</style>