<template>
    <v-container full-height>

    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_collection_statistics } from '../../interface/api'
import { isHash } from '../../util'
export default {
    methods : {
        async getStatistics(){
            const cid = this.$route.params.cid
            if(!isHash(cid, 32)){
                openErrorMessageBox('错误', '无效的id')
                return
            }
            const { data } = api_collection_statistics(cid)
            console.log(data)
        }
    },
    mounted(){
        this.getStatistics()
    }
}
</script>

<style>

</style>