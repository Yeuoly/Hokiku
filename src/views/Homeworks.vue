<template>
    <v-container style="margin-top: 30px; margin-bottom: 30px">
        <v-card>
            <v-row>
                <v-col xl="12" lg="12" md="12" sm="12" cols="12">
                    <v-card-text style="color:rgba(0, 0, 0, 0.6)">作业列表</v-card-text>
                    <v-data-table
                        :loading="homework_loading"
                        :options.sync="table_options"
                        :headers="homeworks_headers"
                        :items="homeworks"
                        dense
                    >
                        <template v-slot:item.submit="{ item }">
                            <v-icon small @click="toSubmitHomeWork(item.hid)">
                                mdi-pencil
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { api_get_homeworks } from '../interface/api'

export default {
    components : {},
    data : () => ({
        homeworks_headers : [{
            text : '作业ID',
            value : 'hid'
        }, {
            text : '标题',
            value : 'title'
        }, {
            text : '内容',
            value : 'desc'
        }, {
            text : '发布者',
            value : 'publisher'
        }, {
            text : '发布时间',
            value : 'time'
        }, {
            text : '结束时间',
            value : 'end_at'
        }, {
            text : '提交',
            value : 'submit'
        }],
        homeworks : [],
        table_options : {},
        homework_loading : false
    }),
    watch : {
        table_options : {
            handler(){
                const { page } = this.table_options
                this.injectHomewroks(page)
            },
            deep : true
        }
    },
    computed : {

    },
    methods : {
        async injectHomewroks(page){
            this.homework_loading = true
            const data = await api_get_homeworks(page)
            this.homeworks = data
            this.homework_loading = false
        },
        toSubmitHomeWork(hid){
            this.$router.push(`/homework/${hid}`)
        }
    }
}
</script>

<style scoped>
    .theme--light.v-data-table{
        color: rgba(0, 0, 0, 0.6);
    }

    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
        font-size: 11px;
    }
</style>