<template>
    <v-container>
        <v-card class="px5 py5">
            <v-card-title>
                编辑
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col :cols="12">
                        <v-text-field
                            v-model="game.name"
                            label="名称"
                            placeholder="比赛名称"
                        ></v-text-field>
                    </v-col>
                    <v-col :cols="12">
                        <v-textarea
                            v-model="game.description"
                            label="简介"
                            placeholder="比赛简介"
                        ></v-textarea>
                    </v-col>
                    <v-col :cols="12">
                        <v-text-field
                            v-model="game.subnet"
                            label="子网"
                            placeholder="172.79.0.0/16"
                        ></v-text-field>
                    </v-col>
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
                                    v-model="game.start_time.date"
                                    label="比赛开始日期"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="game.start_time.date"
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
                            :return-value.sync="game.start_time.time"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                            min-height="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    dense
                                    v-model="game.start_time.time"
                                    label="比赛开始时间"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-time-picker
                                v-if="dialog_switch.game_start_time_picker"
                                v-model="game.start_time.time"
                                full-width
                                @click:minute="$refs.game_start_time_picker.save(game.start_time.time)"
                            ></v-time-picker>
                        </v-menu>
                    </v-col>
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
                                    v-model="game.end_time.date"
                                    label="比赛结束日期"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="game.end_time.date"
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
                            :return-value.sync="game.end_time.time"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                            min-height="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    dense
                                    v-model="game.end_time.time"
                                    label="比赛结束时间"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-time-picker
                                v-if="dialog_switch.game_end_time_picker"
                                v-model="game.end_time.time"
                                full-width
                                @click:minute="$refs.game_end_time_picker.save(game.end_time.time)"
                            ></v-time-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="12">
                        <v-btn color="primary" @click="commit">
                            {{ isNew ? '创建' : '更新' }}
                        </v-btn>
                    </v-col>
                    <v-card-title>节点选择</v-card-title>
                    <v-col :cols="12">
                        <v-radio-group v-model="current_node" row>
                            <v-radio
                                v-for="n in nodes"
                                :key="n.Client.client_id"
                                :label="`Node ${n.Client.client_ip} - ${n.Client.client_id.slice(0, 8)}`"
                                :value="n.Client.client_id"
                            ></v-radio>
                        </v-radio-group>
                    </v-col>
                    <v-col :cols="12">
                        <v-btn @click="selectNode()" color="primary">选择节点</v-btn>
                    </v-col>
                    <v-card-title>题目</v-card-title>
                    <v-col :cols="12">
                        <v-btn color="primary" @click="newSubject()">新建</v-btn>
                    </v-col>
                    <v-col :cols="12">
                        <v-data-table
                            :headers="subject_header"
                            :items="subjects"
                            class="elevation-1"
                        >
                            <template v-slot:item.action="{ item }">
                                <v-icon small @click="editSubject(item)">
                                    mdi-pencil
                                </v-icon>
                                <v-icon small @click="deleteSubject(item.id)">
                                    mdi-delete
                                </v-icon>
                            </template>
                            <template v-slot:item.start_time="{ item }">
                                {{ new Date(item.start_time * 1000).toLocaleString() }}
                            </template>
                            <template v-slot:item.end_time="{ item }">
                                {{ new Date(item.end_time * 1000).toLocaleString() }}
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog_switch.subject_editor_dialog" width="600px">
            <v-card>
                <v-card-title>
                    编辑题目
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col :cols="6">
                            <v-text-field v-model="subject.name" label="题目名"></v-text-field>
                        </v-col>
                        <v-col :cols="6">
                            <v-text-field v-model="subject.comment" label="题目描述"></v-text-field>
                        </v-col>
                        <v-col :cols="4">
                            <v-text-field v-model.number="subject.attack_initial_score" label="攻击初始分"></v-text-field>
                        </v-col>
                        <v-col :cols="4">
                            <v-text-field v-model.number="subject.defense_initial_score" label="防守初始分"></v-text-field>
                        </v-col>
                        <v-col :cols="4">
                            <v-text-field v-model="subject.docker_image" label="镜像"></v-text-field>
                        </v-col>
                        <v-col :cols="4">
                            <v-text-field v-model="subject.expose_ports" label="开放端口" placeholder="22,33"></v-text-field>
                        </v-col>
                        <v-col :cols="4">
                            <v-text-field v-model="subject.environment" label="环境变量" placeholder="key=value;key1=value1"></v-text-field>
                        </v-col>
                        <v-col :cols="4">
                            <v-text-field v-model="subject.default_user" label="默认用户"></v-text-field>
                        </v-col>
                        <!-- start_time and end_time -->
                        <v-col :cols="6">
                            <v-menu
                                v-model="dialog_switch.subject_start_date_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="subject.start_time.date"
                                        label="题目开始日期"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="subject.start_time.date"
                                    scrollable
                                    no-title
                                    @input="dialog_switch.subject_start_date_picker = false"
                                    locale="zh-cn"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                ref="subject_start_time_picker"
                                v-model="dialog_switch.subject_start_time_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="subject.start_time.time"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                min-height="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="subject.start_time.time"
                                        label="题目开始时间"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                    v-if="dialog_switch.subject_start_time_picker"
                                    v-model="subject.start_time.time"
                                    full-width
                                    @click:minute="$refs.subject_start_time_picker.save(subject.start_time.time)"
                                ></v-time-picker>
                            </v-menu>
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                v-model="dialog_switch.subject_end_date_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="subject.end_time.date"
                                        label="题目结束日期"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="subject.end_time.date"
                                    scrollable
                                    no-title
                                    @input="dialog_switch.subject_end_date_picker = false"
                                    locale="zh-cn"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                ref="subject_end_time_picker"
                                v-model="dialog_switch.subject_end_time_picker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="subject.end_time.time"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                min-height="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="subject.end_time.time"
                                        label="题目结束时间"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                    v-if="dialog_switch.subject_end_time_picker"
                                    v-model="subject.end_time.time"
                                    full-width
                                    @click:minute="$refs.subject_end_time_picker.save(subject.end_time.time)"
                                ></v-time-picker>
                            </v-menu>
                        </v-col>
                        <!---->
                        <v-col :cols="12">
                            <v-radio-group
                                row
                                v-model="subject.flag_type"
                            >
                                <v-radio
                                    v-for="(i, k) in flag_types"
                                    :key="k"
                                    :label="flag_types[k]"
                                    :value="k"
                                ></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col :cols="6">
                            <v-text-field v-model="subject.flag_path" label="flag路径"></v-text-field>
                        </v-col>
                        <v-col :cols="6">
                            <v-text-field v-model="subject.flag_refresh_interval" label="flag刷新间隔">
                                <template v-slot:append>
                                    s
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col :cols="12">
                            <v-btn color="primary" @click="commitSubject">提交</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { 
    api_competition_awd_game_create,
    api_competition_awd_game_update,
    api_competition_awd_subject_create,
    api_competition_awd_subject_delete,
    api_competition_awd_subject_list,
    api_competition_awd_subject_update
} from '../../interface/api'
import {
    api_get_docker_nodes
} from '../../interface/docker'
import {
    api_inspect_awd_game,
    api_awd_game_set_node
} from '../../interface/awd'
import {
    openSuccessSnackbar,
    openErrorSnackbar
} from '../../concat/bus'

export default {
    data : () => ({
        flag_types: ['DEFAULT', '文件flag', '模板指令', '环境变量'],
        nodes : [],
        current_node : '',
        dialog_switch : {
            game_start_date_picker: false,
            game_start_time_picker: false,
            game_end_date_picker: false,
            game_end_time_picker: false,
            subject_start_date_picker: false,
            subject_start_time_picker: false,
            subject_end_date_picker: false,
            subject_end_time_picker: false,
            subject_editor_dialog: false,
        },
        game : {
            id : 0,
            name : '',
            description : '',
            start_time :{
                date : '',
                time : ''
            },
            end_time : {
                date : '',
                time : ''
            },
            subnet : ''
        },
        subject : {
            id : 0,
            name : '',
            comment : '',
            attack_initial_score : 200,
            defense_initial_score : 200,
            docker_image : '',
            expose_ports : '22',
            default_user : 'root',
            start_time : {
                date : '',
                time : ''
            },
            end_time : {
                date : '',
                time : ''
            },
            flag_type : 0,
            flag_path : '/home/flag',
            flag_refresh_interval : 1200,
            checker : 'none',
            environment : 'ROOT_PASSWORD=root',
        },
        dialog : {

        },
        subjects : [],
        subject_header : [{
            text : '题目名称',
            value : 'name',
        }, {
            text : '题目描述',
            value : 'comment',
        }, {
            text : '攻击方初始分数',
            value : 'attack_initial_score',
        }, {
            text : '防守方初始分数',
            value : 'defense_initial_score',
        }, {
            text : '题目开始时间',
            value : 'start_time',
        }, {
            text : '题目结束时间',
            value : 'end_time',
        }, {
            text : '镜像',
            value : 'docker_image',
        }, {
            text : '操作',
            value : 'action',
        }]
    }),
    methods : {
        commitSubject() {
            if (this.isSubjectNew) {
                this.createSubject()
            } else {
                this.updateSubject()
            }
        },
        newSubject() {
            this.subject.id = 0
            this.subject.name = ''
            this.subject.comment = ''
            this.subject.attack_initial_score = 200
            this.subject.defense_initial_score = 200
            this.subject.docker_image = ''
            this.subject.expose_ports = '22'
            this.subject.default_user = 'root'
            this.subject.start_time.date = ''
            this.subject.start_time.time = ''
            this.subject.end_time.date = ''
            this.subject.end_time.time = ''
            this.subject.flag_type = 0
            this.subject.flag_path = '/home/flag'
            this.subject.flag_refresh_interval = 1200
            this.subject.checker = 'none'
            this.subject.environment = 'ROOT_PASSWORD=root'
            this.dialog_switch.subject_editor_dialog = true
        },
        editSubject(subject) {
            this.subject.id = subject.id
            this.subject.name = subject.name
            this.subject.comment = subject.comment
            this.subject.attack_initial_score = subject.attack_initial_score
            this.subject.defense_initial_score = subject.defense_initial_score
            this.subject.docker_image = subject.docker_image
            this.subject.expose_ports = subject.expose_ports
            this.subject.default_user = subject.default_user
            const start_time = new Date(subject.start_time * 1000)
            this.subject.start_time.date = start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate()
            this.subject.start_time.time = start_time.getHours() + ':' + start_time.getMinutes()
            const end_time = new Date(subject.end_time * 1000)
            this.subject.end_time.date = end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate()
            this.subject.end_time.time = end_time.getHours() + ':' + end_time.getMinutes()
            this.subject.flag_type = subject.flag_type
            this.subject.flag_path = subject.flag_path
            this.subject.flag_refresh_interval = subject.flag_refresh_int
            this.subject.checker = subject.checker
            this.subject.environment = subject.environment
            this.dialog_switch.subject_editor_dialog = true
        },
        async getGame() {
            const { data } = await api_inspect_awd_game(this.game.id)
            if (data && data['res'] == 0) {
                this.game.description = data['data']['game']['description']
                this.game.name = data['data']['game']['name']
                // game is timestamp, need to convert to date and time
                const start_time = new Date(data['data']['game']['start_time'] * 1000)
                const end_time = new Date(data['data']['game']['end_time'] * 1000)
                this.game.start_time.date = start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate()
                this.game.start_time.time = start_time.getHours() + ':' + start_time.getMinutes()
                this.game.end_time.date = end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate()
                this.game.end_time.time = end_time.getHours() + ':' + end_time.getMinutes()

                this.current_node = data['data']['node_id']
                openSuccessSnackbar('加载成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '获取比赛信息失败')
            }
        },
        commit() {
            if (this.isNew) {
                this.create()
            } else {
                this.update()
            }
        },
        async selectNode() {
            const { data } = await api_awd_game_set_node(this.game.id, this.current_node)
            if (data && data['res'] == 0) {
                openSuccessSnackbar('设置成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '设置节点失败')
            }
        },
        async loadNodes() {
            const { data } = await api_get_docker_nodes()
            if(data && data['res'] == 0){
                this.nodes = data['data']
            }
        },
        async create() {
            const { data } = await api_competition_awd_game_create(
                this.game.name,
                this.game_start_time,
                this.game_end_time,
                this.game.description,
                this.game.subnet
            )
            if (data && data['res'] == 0) {
                openSuccessSnackbar('创建成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '创建比赛失败')
            }
        },
        async update() {
            const { data } = await api_competition_awd_game_update(
                this.game.id,
                this.game.name,
                this.game_start_time,
                this.game_end_time,
                this.game.description,
                this.game.subnet
            )
            if (data && data['res'] == 0) {
                openSuccessSnackbar('更新成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '更新比赛失败')
            }
        },
        async loadSubjects() {
            const { data } = await api_competition_awd_subject_list(this.game.id)
            if (data && data['res'] == 0) {
                this.subjects = data['data']['subject']
            } else {
                openErrorSnackbar(data ? data['err'] : '获取题目列表失败')
            }
        },
        async createSubject() {
            const { data } = await api_competition_awd_subject_create(
                this.game.id,
                this.subject.name,
                this.subject.comment,
                this.subject.attack_initial_score,
                this.subject.defense_initial_score,
                this.subject.docker_image,
                this.subject.expose_ports,
                this.subject.default_user,
                this.subject_start_time,
                this.subject_end_time,
                this.subject.flag_type,
                this.subject.flag_path,
                this.subject.flag_refresh_interval,
                this.subject.checker,
                this.subject.environment,
            )
            if (data && data['res'] == 0) {
                console.log(data)
                this.game.id = data['data']['id']
                openSuccessSnackbar('创建成功')

            } else {
                openErrorSnackbar(data ? data['err'] : '创建题目失败')
            }
        },
        async deleteSubject(/*subject_id*/) {
            api_competition_awd_subject_delete()
        },
        async updateSubject() {
            const { data } = await api_competition_awd_subject_update(
                this.subject.id,
                this.subject.name,
                this.subject.comment,
                this.subject.attack_initial_score,
                this.subject.defense_initial_score,
                this.subject.docker_image,
                this.subject.expose_ports,
                this.subject.default_user,
                this.subject_start_time,
                this.subject_end_time,
                this.subject.flag_type,
                this.subject.flag_path,
                this.subject.flag_refresh_interval,
                this.subject.checker,
                this.subject.environment,
            )
            if (data && data['res'] == 0) {
                openSuccessSnackbar('更新成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '更新题目失败')
            }
        }
    },
    computed : {
        isNew() {
            return this.game.id == 0
        },
        isSubjectNew() {
            return this.subject.id == 0
        },
        game_start_time() {
            // return timestamp
            return parseInt(new Date(this.game.start_time.date + ' ' + this.game.start_time.time).getTime() / 1000)
        },
        game_end_time() {
            // return timestamp
            return parseInt(new Date(this.game.end_time.date + ' ' + this.game.end_time.time).getTime() / 1000)
        },
        subject_start_time() {
            // return timestamp
            return parseInt(new Date(this.subject.start_time.date + ' ' + this.subject.start_time.time).getTime() / 1000)
        },
        subject_end_time() {
            // return timestamp
            return parseInt(new Date(this.subject.end_time.date + ' ' + this.subject.end_time.time).getTime() / 1000)
        },
    },
    async mounted() {
        const game_id = parseInt(this.$route.params.game_id);
        if (game_id) {
            this.game.id = game_id
            await this.getGame()
            await this.loadSubjects()
            this.loadNodes()
        } else {
            this.$router.back()
        }
    },
}
</script>

<style>

</style>