<template>
    <!-- a table contains coins of users and has text-fields so we can modify it -->
    <v-row>
        <!-- v-data-table -->
        <v-col md="12">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="coin_headers"
                :items="coins"
                :search="search"
                hide-default-footer
            >
                <template v-slot:item.apply="{ item }" >
                    <v-text-field
                        v-model="item.apply"
                        label="输入要修改的值，如+50.0 -16.0"
                        single-line
                    ></v-text-field>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="applyChange(item)">
                        mdi-pencil
                    </v-icon>
                </template>
            </v-data-table>
            <!-- page -->
            <v-pagination
                v-model="page"
                :length="99999"
                :total-visible="5"
                color="primary"
            ></v-pagination>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../../concat/bus'
import { api_trade_admin_coin_change, api_trade_admin_list_coins } from '../../../interface/api'

export default {
    data : () => ({
        coins : [],
        coin_headers : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '用户名',
            value : 'username'
        }, {
            text : '可用金币',
            value : 'value'
        }, {
            text : '冻结金币',
            value : 'freeze'
        }, {
            text : '金币增减',
            value : 'apply'
        },{
            text : '操作',
            value : 'action'
        }],
        page : 1
    }),
    methods : {
        async loadCoins() {
            const { data } = await api_trade_admin_list_coins(this.page, 15)
            if(data && data['res'] == 0){
                this.coins = data['data'].map(v => {
                    v.apply = 0
                    return v
                })
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async applyChange(item) {
            const { data } = await api_trade_admin_coin_change(item.user_id, item.apply)
            if(data && data['res'] == 0){
                this.loadCoins()
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        }
    },
    watch : {
        page() {
            this.loadCoins()
        }
    },
    mounted() {
        this.loadCoins()
    }
}
</script>

<style>

</style>