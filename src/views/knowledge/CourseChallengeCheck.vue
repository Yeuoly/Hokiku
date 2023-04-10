<template>
    <v-container class="px5 py5" style="background-color: white">
        <v-row v-if="challenges.length > 0" class="px5 py5">
            <v-col :cols="12" v-for="(i, k) in challenges" :key="k">
                <v-row>
                    <div class="challenge_name">
                        {{ i.challenge_name }}
                    </div>
                    <div class="challenge_percent">
                        <v-progress-circular
                            :value="caculatePercent(i.users)"
                            :size="50"
                            :width="2"
                            color="primary"
                            rounded
                        >
                            <v-icon>
                                mdi-check
                            </v-icon>
                        </v-progress-circular>
                    </div>
                    <div class="challenge_items">
                        <v-sheet
                            class="mx-auto"
                        >
                            <v-slide-group
                                multiple
                                show-arrows
                            >
                                <v-slide-item
                                    v-for="n in i.users"
                                    :key="n"
                                >
                                    <v-btn
                                        class="mx-2"
                                        :input-value="n.done"
                                        active-class="primary white--text"
                                        depressed
                                        rounded
                                    >
                                        {{ n.username }}
                                    </v-btn>
                                </v-slide-item>
                            </v-slide-group>
                        </v-sheet>
                    </div>
                </v-row>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" class="text-center">
                                <v-icon class="display-4" color="primary">mdi-alert-circle-outline</v-icon>
                            </v-col>
                            <v-col cols="12" class="text-center">
                                <span class="display-1">暂无习题</span>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_course_challenge_check
} from '../../interface/course'

export default {
    data : () => ({
        unit_id : 0,
        challenges : [],
    }),
    methods : {
        caculatePercent(users){
            let done = 0
            for(let i = 0; i < users.length; i++){
                if(users[i].done){
                    done++
                }
            }
            return (done / users.length) * 100
        },
        async loadChallenges(){
            const { data } = await api_course_challenge_check(this.unit_id)
            if(!data){
                openErrorSnackbar('获取习题列表失败，请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.challenges = data['data']['challenges']
                    openSuccessSnackbar('加载成功')
                }
            }
        }
    },
    mounted() {
        this.unit_id = parseInt(this.$route.params.unit_id)
        if (this.unit_id) {
            this.loadChallenges()
        } else {
            this.$router.back()
        }
    }
}
</script>

<style>

.challenge_name{
    font-size: 1.5rem;
    font-weight: bold;
    color: deepskyblue;
    width: 200px;
    line-height: 52px;
}

.challenge_percent{
    font-size: 1.2rem;
    color: #3c3c3c;
    width: 200px;
}

.challenge_items{
    margin: 8px 0px 8px 0px;
    width: calc(100% - 400px);
}

</style>