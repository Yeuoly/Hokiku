<template>
    <v-container></v-container>
</template>

<script>
import { openErrorSnackbar } from '../../concat/bus';
import {
    api_organization_manage_train_sheet_rank
} from '../../interface/organization'

export default {
    data : () => ({
        rank : [],
        sid : 0,
        gid : 0
    }),
    methods :{
        async loadRank() {
            const { data } = await api_organization_manage_train_sheet_rank(this.gid, this.sid);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            this.rank = data['data']['rank'] || []
        }
    },
    mounted() {
        this.sid = parseInt(this.$route.params.sid)
        this.gid = parseInt(this.$route.params.gid)
        if(!this.sid || !this.gid) {
            this.$router.back()
            return
        }
        this.loadRank()
    }
}
</script>

<style>

</style>