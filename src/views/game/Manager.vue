<template>
    <v-row>
        <v-col cols="6">
            <v-card-title style="padding: 0; padding-left: 15px">
                比赛管理
            </v-card-title>
        </v-col>
        <v-col cols="6">
            <v-btn style="float: right" class="mr5" @click="openAddGameDialog" color="primary">新建</v-btn>
        </v-col>
        <v-col cols="12">
            <v-data-table
                :headers="game_table_headers"
                :items="games"
                :items-per-page="10"
                :server-items-length="game_table_options.game_total"
                :loading="game_table_options.game_loading"
                :options.sync="game_table_options.game_options"
            >
                <template v-slot:item.signup_time="{ item }">
                    {{ new Date(item.signup_start_time * 1000).formatDate('Y-M-D h:m:s') }} ~ 
                    {{ new Date(item.signup_end_time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.game_time="{ item }">
                    {{ new Date(item.game_start_time * 1000).formatDate('Y-M-D h:m:s') }} ~
                    {{ new Date(item.game_end_time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.is_private="{ item }">
                    {{ (item.flag & 2) == 2 ? '是' : '否' }}
                </template>
                <template v-slot:item.action="{ item }">
                    <v-btn color="primary"
                        x-small
                        @click="openEditGameDialog(item)"
                    >编辑</v-btn>
                    <v-btn color="error" 
                        x-small
                        @click="deleteGame(item.id)"
                    >删除</v-btn>
                    <v-btn color="" 
                        x-small
                        @click="manageGame(item.id)"
                    >管理</v-btn>
                </template>
            </v-data-table>
        </v-col>
        <v-dialog v-model="dialog_switch.game" max-width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        编辑比赛
                    </v-toolbar-title>
                </v-toolbar>
                <div class="px5 py2">
                    <v-text-field
                        label="比赛名称"
                        v-model="dialog.title"
                    ></v-text-field>
                    <v-text-field
                        label="详情页链接"
                        v-model="dialog.page_url"
                    ></v-text-field>
                    <v-layout>
                        <!-- signup_start_time -->
                        <v-col :cols="6">
                            <v-menu
                                v-model="dialog_switch.signup_start_date_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.signup_start_date"
                                        label="报名开始日期"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="dialog.signup_start_date"
                                    scrollable
                                    no-title
                                    @input="dialog_switch.signup_start_date_picker = false"
                                    locale="zh-cn"
                                ></v-date-picker>
                            </v-menu> 
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                ref="signup_start_time_picker"
                                v-model="dialog_switch.signup_start_time_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="dialog.signup_start_time"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                min-height="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.signup_start_time"
                                        label="报名开始时间"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                    v-if="dialog_switch.signup_start_time_picker"
                                    v-model="dialog.signup_start_time"
                                    full-width
                                    @click:minute="$refs.signup_start_time_picker.save(dialog.signup_start_time)"
                                ></v-time-picker>
                            </v-menu> 
                        </v-col>
                    </v-layout>
                    <v-layout>
                        <!-- signup_end_time -->
                        <v-col :cols="6">
                            <v-menu
                                v-model="dialog_switch.signup_end_date_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.signup_end_date"
                                        label="报名结束日期"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="dialog.signup_end_date"
                                    scrollable
                                    no-title
                                    @input="dialog_switch.signup_end_date_picker = false"
                                    locale="zh-cn"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                ref="signup_end_time_picker"
                                v-model="dialog_switch.signup_end_time_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="dialog.signup_end_time"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                min-height="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.signup_end_time"
                                        label="报名结束时间"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                    v-if="dialog_switch.signup_end_time_picker"
                                    v-model="dialog.signup_end_time"
                                    full-width
                                    @click:minute="$refs.signup_end_time_picker.save(dialog.signup_end_time)"
                                ></v-time-picker>
                            </v-menu>
                        </v-col>
                    </v-layout>
                    <v-layout>
                        <!-- game_start_time -->
                        <v-col :cols="6">
                            <v-menu
                                v-model="dialog_switch.game_start_date_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.game_start_date"
                                        label="比赛开始日期"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="dialog.game_start_date"
                                    scrollable
                                    no-title
                                    @input="dialog_switch.game_start_date_picker = false"
                                    locale="zh-cn"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                ref="game_start_time_picker"
                                v-model="dialog_switch.game_start_time_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="dialog.game_start_time"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                min-height="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.game_start_time"
                                        label="比赛开始时间"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                    v-if="dialog_switch.game_start_time_picker"
                                    v-model="dialog.game_start_time"
                                    full-width
                                    @click:minute="$refs.game_start_time_picker.save(dialog.game_start_time)"
                                ></v-time-picker>
                            </v-menu>
                        </v-col>
                    </v-layout>
                    <v-layout>
                        <!-- game_end_time -->
                        <v-col :cols="6">
                            <v-menu
                                v-model="dialog_switch.game_end_date_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.game_end_date"
                                        label="比赛结束日期"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="dialog.game_end_date"
                                    scrollable
                                    no-title
                                    @input="dialog_switch.game_end_date_picker = false"
                                    locale="zh-cn"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                ref="game_end_time_picker"
                                v-model="dialog_switch.game_end_time_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="dialog.game_end_time"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                min-height="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.game_end_time"
                                        label="比赛结束时间"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                    v-if="dialog_switch.game_end_time_picker"
                                    v-model="dialog.game_end_time"
                                    full-width
                                    @click:minute="$refs.game_end_time_picker.save(dialog.game_end_time)"
                                ></v-time-picker>
                            </v-menu>
                        </v-col>
                    </v-layout>
                    <v-text-field
                        label="联系方式"
                        v-model="dialog.concats"
                    ></v-text-field>
                    <v-radio-group
                        row
                        v-model="dialog.type"
                    >
                        <v-radio
                            v-for="(i, k) in radio_selections.game_type"
                            :key="k"
                            :label="radio_selections.game_type[k]"
                            :value="k"
                        ></v-radio>
                    </v-radio-group>
                    <UploadImage
                        v-model="dialog.cover_rid"
                        :height="60"
                    ></UploadImage>
                    <v-switch
                        v-model="dialog.is_private"
                        label="私密比赛"
                    ></v-switch>
                    <v-btn color="primary" @click="commitGame">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { 
    api_competition_game_create, 
    api_competition_game_list, 
    api_competition_game_update, 
    api_competition_game_delete 
} from '../../interface/api'

import UploadImage from '../../components/common/UploadImage.vue'

export default {
    name : 'GameManager',
    components : { UploadImage },
    data : () => ({
        dialog_switch : {
            game: false,
            signup_start_date_picker: false,
            signup_start_time_picker: false,
            signup_end_date_picker: false,
            signup_end_time_picker: false,
            game_start_date_picker: false,
            game_start_time_picker: false,
            game_end_date_picker: false,
            game_end_time_picker: false,
        },
        dialog : {
            id : 0,
            title : '',
            page_url : '',
            signup_start_date : '',
            signup_start_time : '',
            signup_end_date : '',
            signup_end_time : '',
            game_start_date : '',
            game_start_time : '',
            game_end_date : '',
            game_end_time : '',
            concats : '',
            type : 1,
            is_new : false,
            is_private : 0,
            cover_rid : 0,
        },
        game_table_headers : [{
            text : '比赛名称',
            value : 'title'
        }, {
            text : '比赛类型',
            value : 'type'
        }, {
            text : '报名时间',
            value : 'signup_time'
        }, {
            text : '比赛时间',
            value : 'game_time'
        }, {
            text : '联系方式',
            value : 'concats'
        }, {
            text : '是否私密',
            value : 'is_private'
        }, {
            text : '操作',
            value : 'action'
        }],
        game_table_options : {
            game_loading : false,
            game_total : 999999,
            game_options : {},
        },
        games : [],
        radio_selections : {
            game_type : ['DEFAULT', 'SOLO'],
        }
    }),
    computed : {
        computed_signup_start_time() {
            return parseInt(new Date(
                this.dialog.signup_start_date + ' ' + this.dialog.signup_start_time
            ).getTime() / 1000)
        },
        computed_signup_end_time() {
            return parseInt(new Date(
                this.dialog.signup_end_date + ' ' + this.dialog.signup_end_time
            ).getTime() / 1000)
        },
        computed_game_start_time() {
            return parseInt(new Date(
                this.dialog.game_start_date + ' ' + this.dialog.game_start_time
            ).getTime() / 1000)
        },
        computed_game_end_time() {
            return parseInt(new Date(
                this.dialog.game_end_date + ' ' + this.dialog.game_end_time
            ).getTime() / 1000)
        }
    },
    methods : {
        openAddGameDialog() {
            this.dialog.title = 'XX杯'
            this.dialog.page_url = ''
            this.dialog.signup_start_date = new Date().formatDate('Y-M-D')
            this.dialog.signup_end_date = new Date().formatDate('Y-M-D')
            this.dialog.game_start_date = new Date().formatDate('Y-M-D')
            this.dialog.game_end_date = new Date().formatDate('Y-M-D')
            this.dialog.concats = 'example@edu.cn'
            this.dialog.type = 1
            this.dialog.is_new = true
            this.dialog_switch.game = true
        },
        openEditGameDialog(game) {
            this.dialog.id = game.id
            this.dialog.title = game.title
            this.dialog.page_url = game.page_url
            //parse timestamp to date and time
            const signup_datetime = new Date(game.signup_start_time * 1000).formatDate('Y-M-D h:m:s').split(' ')
            this.dialog.signup_start_date = signup_datetime[0]
            this.dialog.signup_start_time = signup_datetime[1]
            const signup_end_datetime = new Date(game.signup_end_time * 1000).formatDate('Y-M-D h:m:s').split(' ')
            this.dialog.signup_end_date = signup_end_datetime[0]
            this.dialog.signup_end_time = signup_end_datetime[1]
            const game_start_datetime = new Date(game.game_start_time * 1000).formatDate('Y-M-D h:m:s').split(' ')
            this.dialog.game_start_date = game_start_datetime[0]
            this.dialog.game_start_time = game_start_datetime[1]
            const game_end_datetime = new Date(game.game_end_time * 1000).formatDate('Y-M-D h:m:s').split(' ')
            this.dialog.game_end_date = game_end_datetime[0]
            this.dialog.game_end_time = game_end_datetime[1]
            this.dialog.concats = game.concats
            this.dialog.type = game.type
            this.dialog.cover_rid = game.cover_rid
            this.dialog.is_private = (game.flag & 2) == 2 ? 1 : 0
            this.dialog.is_new = false
            this.dialog_switch.game = true
        },
        closeEditGameDialog() {
            this.dialog_switch.game = false
        },
        commitGame() {
            if (this.dialog.is_new) {
                this.addGame()
            } else {
                this.editGame()
            }
        },
        async addGame() {
            const { data } = await api_competition_game_create(
                this.dialog.title,
                this.dialog.page_url,
                this.computed_signup_start_time,
                this.computed_signup_end_time,
                this.computed_game_start_time,
                this.computed_game_end_time,
                this.dialog.concats,
                this.dialog.type,
                this.dialog.is_private,
                this.dialog.cover_rid
            )

            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '添加成功')
                }
            }
        },
        manageGame(id) {
            this.$router.push(`/competition/game/edit/${id}`)
        },
        async editGame() {
            const { data } = await api_competition_game_update(this.dialog.id, {
                title : this.dialog.title,
                page_url : this.dialog.page_url,
                signup_start_time : this.computed_signup_start_time,
                signup_end_time : this.computed_signup_end_time,
                game_start_time : this.computed_game_start_time,
                game_end_time : this.computed_game_end_time,
                concats : this.dialog.concats,
                type : this.dialog.type,
                is_private : this.dialog.is_private,
                cover_rid : this.dialog.cover_rid
            })

            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '修改成功')
                }
            }
        },
        async deleteGame(competition_game_id) {
            const result = await openInfoMessageBox('提示', '您确定要删除吗')
            if(result){
                const { data } = await api_competition_game_delete(competition_game_id)
                if(!data){
                    openErrorMessageBox('错误', '网络错误')
                }else{
                    if(data['res'] != 0){
                        openErrorMessageBox('错误', data['err'])
                    }else{
                        openInfoMessageBox('成功', '删除成功')
                    }
                }
            }
        },
        async load() {
            const { data } = await api_competition_game_list(this.game_table_options.game_options.page, 10)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.games = data['data']
                }
            }
        }
    },
    mounted() {
        this.load()
    }
}
</script>

<style>

</style>