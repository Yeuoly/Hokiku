<template>
    <v-card class="service-card px3 py3">
        <div class="service-avatar">
            <v-avatar :size="80">
                <v-icon :size="60" color="primary">mdi-server</v-icon>
            </v-avatar>
        </div>
        <div class="service-card-header">
            <div class="service-card_title text-25 text-primary">
                <span>
                    {{ name }}
                </span>
            </div>
            <div class="service-card_info">
                <v-chip color="primary" dark small class="mr3">
                    <v-icon left>mdi-server</v-icon>
                    服务器数量 
                    <span>{{ container_count }}</span>
                </v-chip>
                <v-chip color="orange" dark small class="mr3">
                    <v-icon left>mdi-network</v-icon>
                    网络数量 
                    <span>{{ network_count }}</span>
                </v-chip>
                <v-chip color="green" dark small class="mr3">
                    <v-icon left>mdi-currency-cny</v-icon>
                    价格 
                    <span>{{ price }}</span>
                </v-chip>
                <v-chip color="blue" dark small class="mr3">
                    <v-icon left>mdi-star</v-icon>
                    总分 
                    <span>{{ score }}</span>
                </v-chip>
            </div>
        </div>
        <div class="service-card_author">
            <span>
                <v-icon color="primary">
                    mdi-account
                </v-icon>
                {{ author }}
            </span>
        </div>
        <div class="service-card_description">
            <span>
                {{ description }}
            </span>
        </div>
        <div class="service-card-actions">
            <v-btn
                text
                color="primary"
                @click="dialog = true"
            >
                打开
            </v-btn>
            <v-btn
                text
                color="green"
                @click="toRank()"
            >
                排名
            </v-btn>
        </div>
        <v-dialog
            v-model="dialog"
            width="800"
        >
            <v-card>
                <v-tabs
                    v-model="tab"
                >
                    <v-tab
                        :key="0"
                    >
                        题目环境
                    </v-tab>
                    <v-tab
                        :key="1"
                    >
                        Writeup
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item
                        :key="0"
                    >
                        <v-card-title>
                            {{ name }}
                        </v-card-title>
                        <v-card-text>
                            {{ description }}
                        </v-card-text>
                        <v-card-text>
                            <ul>
                                <li>注意，当前如果已启动其他题目的环境，请先关闭对应环境，否则给出的地址将为其他题目的环境</li>
                                <li>用户提交的flag只会记录最新的一次提交，因此如果后续提交的flag错误，那么将失去之前的得分</li>
                                <li>如果该题为非免费题目，那么系统将扣除账户对应的金币，并将其50%转入作者账户，如果启动失败那么金币将原路返还</li>
                                <li>续费不消耗金币</li>
                                <li>班级内启动该班级自身的题目不消耗金币</li>
                                <li>账户余额不足将无法启动</li>
                                <li>如有bug或任何安全隐患请联系admin@srmxy.cn</li>
                                <li>查看题解请点击卡片左上角Writeup</li>
                            </ul>
                        </v-card-text>
                        <v-card-text
                            v-if="launched"
                        >
                            <v-chip color="green" dark small class="mr3 mb2">
                                <v-icon left>mdi-check</v-icon>
                                已启动
                            </v-chip>
                            <v-chip color="blue" dark small class="mr3 mb2">
                                <v-icon left>mdi-clock</v-icon>
                                启动时间
                                <span>{{ new Date(current_env.started_at * 1000).formatDate('h:m:s') }}</span>
                            </v-chip>
                            <v-chip color="red" dark small class="mr3 mb2">
                                <v-icon left>mdi-clock</v-icon>
                                关闭时间
                                <span>{{ new Date(current_env.ended_at * 1000).formatDate('h:m:s') }}</span>
                            </v-chip>
                            <v-chip
                                v-for="(item, index) in current_env.port_protocol"
                                v-show="item.trim()"
                                :key="index"
                                color="blue" dark small class="mr3 mb2">
                                <v-icon left>mdi-protocol</v-icon>
                                <span>{{ item }}</span>
                            </v-chip>
                        </v-card-text>
                        <v-card-text
                            v-if="launch_log"
                        >
                            <v-textarea
                                readonly
                                :value="launch_log"
                                label="启动日志"
                                filled
                                rows="5"
                            ></v-textarea>
                        </v-card-text>
                        <v-card-text v-if="launching">
                            <v-progress-linear
                                indeterminate
                                color="primary"
                            ></v-progress-linear>
                        </v-card-text>
                        <v-card-text>
                            <v-text-field
                                label="flag，多个flag用;分隔"
                                v-model="flags"
                            >
                                <template v-slot:append>
                                    <v-btn
                                        small
                                        color="primary"
                                        @click="commit()"
                                    >
                                        提交
                                    </v-btn>
                                </template>
                            </v-text-field>
                        </v-card-text>
                        <v-card-text>
                            <v-btn
                                color="primary"
                                :disabled="launched"
                                @click="launch()"
                            >
                                启动
                            </v-btn>
                            <v-btn
                                color="primary"
                                :disabled="!launched"
                                @click="extend()"
                            >
                                延期
                            </v-btn>
                            <v-btn
                                dark
                                color="red"
                                :disabled="!launched"
                                @click="stop()"
                            >
                                关闭
                            </v-btn>
                        </v-card-text>
                    </v-tab-item>
                    <v-tab-item
                        :key="1"
                    >
                        <v-card flat>
                            <v-card-title>
                                {{ name }} 的Writeup
                            </v-card-title>
                            <v-card-text>
                                <ul>
                                    <li>Writeup的价格由Writeup作者决定，平台不会做任何干预</li>
                                    <li>免费Writeup可以直接点击购买</li>
                                    <li>支付价格的50%将会被转入作者账户</li>
                                </ul>
                            </v-card-text>
                            <v-card-text>
                                <v-btn color="primary" @click="toServiceEditor(my_wp)">编写我的WP</v-btn>
                            </v-card-text>
                            <v-card-text>
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">作者</th>
                                                <th class="text-left">价格</th>
                                                <th class="text-left">原始评分</th>
                                                <th class="text-left">我的评分</th>
                                                <th class="text-left">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in writeups" :key="index">
                                                <td>{{ item.author }}</td>
                                                <td>{{ item.price }}</td>
                                                <td>
                                                    {{ (item.vote == 0 ? 0 : item.score / item.vote).toFixed(1) }}
                                                </td>
                                                <td>
                                                    <v-rating
                                                        v-model="item.my_score"
                                                        color="primary"
                                                    ></v-rating>
                                                </td>
                                                <td>
                                                    <v-btn
                                                        color="success"
                                                        small
                                                        :disabled="item.bought"
                                                        @click="buyWriteup(item.id)"
                                                    >
                                                        购买
                                                    </v-btn>
                                                    <v-btn
                                                        color="primary"
                                                        small
                                                        :disabled="!item.bought"
                                                        @click="openWriteup(item.id)"
                                                    >
                                                        打开
                                                    </v-btn>
                                                    <v-btn
                                                        color="primary"
                                                        small
                                                        :disabled="!item.bought"
                                                        @click="voteWp(item.id, item.my_score)"
                                                    >
                                                        评分
                                                    </v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="writeup_dialog"
            width="800"
        >
            <v-card>
                <v-card-title>
                    {{ name }} 的WP
                </v-card-title>
                <v-card-text>
                    <InnerHTML
                        :html="current_wp.content"
                    ></InnerHTML>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_comp_service_check,
    api_comp_service_launch,
    api_comp_service_launch_check,
    api_comp_service_stop,
    api_comp_service_stop_check,
    api_comp_service_extend,
    api_comp_service_flag_commit,
    api_comp_service_writeup_list,
    api_comp_service_writeup_vote,
    api_comp_service_writeup_get,
    api_comp_service_writeup_buy
} from '../../interface/service'
import { sleep } from '../../util'
import InnerHTML from './InnerHTML.vue'

export default {
    components : { InnerHTML },
    data : () => ({
        dialog : false,
        launching : false,
        launch_log : '',
        flags : '',
        current_env : {
            port_protocol : [],
            started_at : '未启动',
            ended_at : '未启动',
        },
        tab : 0,
        writeups : [],
        current_wp : {
            content : '',
        },
        writeup_dialog : false,
    }),
    watch : {
        dialog(val) {
            if(val && !this.launched) {
                this.load()
            }
        },
        tab(val) {
            if(val == 1) {
                this.loadWriteup()
            }
        }
    },
    computed : {
        launched() {
            return this.current_env.started_at != '未启动'
        },
        my_wp() {
            let wid = 0
            for(let i = 0; i < this.writeups.length; i++) {
                if(this.writeups[i].is_my) {
                    wid = this.writeups[i].id
                    break
                }
            }
            return wid
        }
    },
    methods : {
        toRank() {
            this.$router.push(`/competition/service/rank/${this.id}`)
        },
        toServiceEditor(wid) {
            this.$router.push(`/competition/service/writeup/${this.id}/${wid}`)
        },
        async buyWriteup(wid) {
            const { data } = await api_comp_service_writeup_buy(wid)
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '购买失败')
                return
            }
            openSuccessSnackbar('购买成功')
            this.loadWriteup()
        },
        async openWriteup(wid){
            await this.loadWriteupDetail(wid)
            this.writeup_dialog = true
        },
        async loadWriteupDetail(wid) {
            const { data } = await api_comp_service_writeup_get(wid)
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '获取Writeup详情失败')
                return
            }
            this.current_wp.content = data['data']['writeup']['content']
        },
        async voteWp(wid, score) {
            const { data } = await api_comp_service_writeup_vote(wid, score)
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '评分失败')
                return
            }
            openSuccessSnackbar('评分成功')
            this.loadWriteup()
        },
        async loadWriteup() {
            const { data } = await api_comp_service_writeup_list(this.id)
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '获取Writeup列表失败')
                return
            }

            for (const item of data['data']['list']) {
                item['my_score'] = 0
            }

            this.writeups = data['data']['list']
        },
        async commit() {
            const { data } = await api_comp_service_flag_commit(this.flags)
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '提交失败')
                return
            }
            openSuccessSnackbar('提交成功')
        },
        async extend() {
            const { data } = await api_comp_service_extend(this.id)
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '延期失败')
                return
            }
            openErrorSnackbar('延期成功')
        },
        async load() {
            const { data } = await api_comp_service_check()
            if(data && data['res'] == 0) {
                this.current_env.started_at = data['data']['create_at']
                this.current_env.ended_at = data['data']['end_at']
                this.current_env.port_protocol = data['data']['port_protocol'].split(/,/g)
            } else {
                this.current_env.started_at = '未启动'
                this.current_env.ended_at = '未启动'
                this.current_env.port_protocol = '未启动'
            }
        },
        async launch() {
            this.launching = true
            const { data } = await api_comp_service_launch(this.id)
            if(!data || data['res'] != 0) {
                openErrorSnackbar('启动失败')
                this.launching = false
                return
            }

            const message_response_id = data['data']['message_response_id']
            const finish_response_id = data['data']['finish_response_id']

            let launched = false
            while(!launched) {
                await sleep(1000)
                
                const { data } = await api_comp_service_launch_check(message_response_id, finish_response_id)
                if(!data || data['res'] != 0) {
                    openErrorSnackbar('启动失败')
                    break
                }

                if (data['data']['message']) {
                    this.launch_log += data['data']['message']
                }
                
                if(data['data']['finished']) {
                    launched = true
                }

                if (data['data']['error']) {
                    openErrorSnackbar(data['data']['error'])
                    break
                }
            }

            this.launching = false

            if(launched) {
                this.load()
            }
        },
        async stop() {
            this.launching = true

            const { data } = await api_comp_service_stop(this.id)
            if(!data || data['res'] != 0) {
                openErrorSnackbar('关闭失败')
                this.launching = false
                return
            }

            const finish_response_id = data['data']['finish_response_id']

            let stopped = false
            while(!stopped) {
                await sleep(1000)
                const { data } = await api_comp_service_stop_check(finish_response_id)
                if(!data || data['res'] != 0) {
                    openErrorSnackbar('关闭失败')
                    break
                }

                if(data['data']['finished']) {
                    stopped = true
                }

                if (data['data']['error']) {
                    openErrorSnackbar(data['data']['error'])
                    break
                }
            }

            this.launching = false

            if(stopped) {
                this.load()
            }
        }
    },
    props : {
        id : {
            type : Number,
            default : 0
        },
        name : {
            type : String,
            default : '暂无'
        },
        description : {
            type : String,
            default : '暂无'
        },
        author :{
            type : String,
            default : '暂无'
        },
        price : {
            type : Number,
            default : 0
        },
        score : {
            type : Number,
            default : 0
        },
        container_count : {
            type : Number,
            default : 0
        },
        network_count : {
            type : Number,
            default : 0
        },
    }
}
</script>

<style>

.service-card {
    width: 100%;
    height: 140px;
    margin: 0;
    border-radius: 0;
    box-shadow: 0 0 0 0;
    transition: background-color 0.3s ease-in-out;
    position: relative;
}

.service-card:hover {
    background-color: rgba(0,0,0,0.1);
}

.service-card-header {
    left: 85px;
    top: 10px;
    position: absolute;
    width: 100%;
    padding: 0;
    margin: 0;
    border-radius: 0;
    box-shadow: 0 0 0 0;
    transition: box-shadow 0.3s ease-in-out;
}

.service-card_title {
    position: absolute;
    width: 100%;
    padding: 0;
    margin: 0;
    border-radius: 0;
    box-shadow: 0 0 0 0;
    transition: box-shadow 0.3s ease-in-out;
}

.service-card_author {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 24px;
    color: rgb(25,118,210);
}

.service-card_description {
    position: absolute;
    width: calc(100% - 210px);
    line-break: anywhere;
    padding: 0;
    margin: 0;
    border-radius: 0;
    box-shadow: 0 0 0 0;
    transition: box-shadow 0.3s ease-in-out;
    top: 90px;
    left: 85px;
}

.service-card_info {
    position: absolute;
    top: 39px;
}

.service-card-actions {
    position: absolute;
    bottom: 0;
    right: 0;
}

</style>