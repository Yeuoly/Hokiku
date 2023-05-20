<template>
    <v-row class="px2">
        <v-col :cols="12">
            <v-data-table
                :headers="coin_headers"
                :items="coins"
                hide-default-footer
            >
                <template v-slot:item.from="{ item }" >
                    <span v-if="item.from === 1">
                        系统
                    </span>
                    <span v-else-if="item.from === 2">
                        微信
                    </span>
                    <span v-else-if="item.from === 3">
                        支付宝
                    </span>
                    <span v-else>
                        未知
                    </span>
                </template>
                <template v-slot:item.type="{ item }" >
                    <span v-if="item.type === 2">
                        <v-icon color="red">
                            mdi-arrow-down
                        </v-icon>
                    </span>
                    <span v-else-if="item.type === 1">
                        <v-icon color="green">
                            mdi-arrow-up
                        </v-icon>
                    </span>
                </template>
                <template v-slot:item.time="{ item }" >
                    {{ new Date(item.time * 1000).toLocaleString() }}
                </template>
            </v-data-table>
            <v-pagination
                v-model="page"
                :length="99999"
                :total-visible="5"
                color="primary"
            />
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../../concat/bus'
import { api_trade_list_coin_changes } from '../../../interface/api'

export default {
    data : () => ({
        coin_headers : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '金币增减',
            value : 'value'
        }, {
            text : '时间',
            value : 'time'
        }, {
            text : '变动来源',
            value : 'from'
        }, {
            text : '变动类型',
            value : 'type',
        }],
        coins : [],
        page : 1
    }),
    watch : {
        page : {
            handler() {
                this.loadCoins()
            },
            immediate : true
        }
    },
    methods : {
        async loadCoins() {
            const { data } = await api_trade_list_coin_changes(this.page, 15)
            if(data && data['res'] == 0){
                this.coins = data['data']
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        }
    },
}
</script>

<style>

</style>