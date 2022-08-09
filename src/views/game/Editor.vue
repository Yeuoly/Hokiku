<template>
    <v-container>
        <v-card-title class="text-grey">
            编辑详情页html
        </v-card-title>
        <RichEditor
            v-model="html_content"
        ></RichEditor>
        <p></p>
        <v-btn @click="commitDetailPage" color="primary">提交详情页</v-btn>
    </v-container>
</template>

<script>
import { api_competition_game_detail, api_competition_game_detail_upload } from '../../interface/api'
import RichEditor from '../../components/common/RichEditor'
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'

export default {
    components : { RichEditor },
    data : () => ({
        subjects : [],
        html_content : '',
        competition_id : 0
    }),
    methods : {
        async load() {
            const { data } = await api_competition_game_detail(this.competition_id)
            console.log(data)
        },
        async commitDetailPage() {
            const { data } = await api_competition_game_detail_upload(this.competition_id, this.html_content)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['info'])
                } else {
                    openInfoMessageBox('成功', '提交成功')
                }
            }
        }
    },
    mounted() {
        const competition_id = parseInt(this.$route.params.competition_id);
        if (competition_id) {
            this.competition_id = competition_id;
            this.load();
        }
    }
}
</script>

<style>

</style>