<template>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-alert
                    color="primary"
                    dark
                    dense
                >
                    服务编辑器（注意事项）
                </v-alert>
                <v-card-text>
                    <ul>
                        <li>子网请使用ABCDEFG等大写字母代替，最终平台将自动生成子网</li>
                        <li>端口映射将会将对应容器的端口映射到公共区域，用于环境入口，未映射的容器将被认为是不可公开访问的</li>
                        <li>flag请输入用于生成flag的指令，提供一个模板，例如 echo $flag > /flag</li>
                        <li>每一个节点都是一台容器，新建节点后点击节点即可编辑</li>
                        <li>目前最多支持4个子网(C段)与16台容器，且每台容器至少处于一个网络当中</li>
                        <li>请不要任何修改flag的uuid或随意删除flag，如果删除或修改了某个flag的uuid，那么当前已经解出该flag的用户将失去该flag的得分</li>
                    </ul>
                </v-card-text>
            </v-col>
            <v-col :cols="12">
                <v-text-field
                    label="题目名称"
                    v-model="service_name"
                ></v-text-field>
            </v-col>
            <v-col :cols="12">
                <v-textarea
                    label="题目描述"
                    v-model="service_description"
                ></v-textarea>
            </v-col>
            <v-col :cols="6">
                <v-text-field
                    label="作者（可以填团队名或个人名，请尊重原作者版权）"
                    v-model="author"
                ></v-text-field>
            </v-col>
            <v-col :cols="6">
                <v-text-field
                    label="价格（用户扣除的金币，其中50%将进入创建该题目用户的账户）"
                    v-model.number="price"
                ></v-text-field>
            </v-col>
            <v-col :cols="4">
                <v-text-field
                    label="当前容器数量"
                    disabled
                    v-model="service_config.container_count"
                ></v-text-field>
            </v-col>
            <v-col :cols="4">
                <v-text-field
                    label="当前网络数量"
                    disabled
                    v-model="service_config.network_count"
                ></v-text-field>
            </v-col>
            <v-col :cols="4">
                <v-text-field
                    label="当前总分数"
                    disabled
                    v-model="service_config.total_score"
                ></v-text-field>
            </v-col>
            <v-col :cols="12">
                <service-editor
                    :containers.sync="service_config.containers"
                ></service-editor>
            </v-col>
            <v-col :cols="12">
                <v-btn color="primary" @click="commit()">提交</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ServiceEditor from '../../components/common/ServiceEditor.vue'
import { openErrorSnackbar } from '../../concat/bus'
import {
    api_comp_service_create,
    api_comp_service_update,
    api_comp_service_get
} from '../../interface/service'

class ContainerNetwork {
    constructor() {
        this.network = ''
        this.random_cidr = true
    }
}

class ContainerPort {
    constructor() {
        this.port = 0
        this.protocol = 'tcp'
    }
}

class ContainerFlag {
    constructor() {
        this.flag_command = ''
        this.flag_score = 0
        this.flag_uuid = ''
    }
}

class Container {
    constructor() {
        this.image = ''
        this.ports = []
        this.networks = []
        this.flags = []
        this.env = {}
    }
}

const parse_front_config_to_service = (total_score, network_count, container_count, containers) => {
    const service = {
        total_score,
        network_count,
        container_count,
        containers : []
    }

    for(const container of containers) {
        const container_obj = new Container()
        container_obj.image = container.image_name
        container_obj.flags = []
        for (const flag of container.flags) {
            const flag_obj = new ContainerFlag()
            flag_obj.flag_command = flag.flag_command
            flag_obj.flag_score = flag.flag_score
            flag_obj.flag_uuid = flag.flag_uuid
            container_obj.flags.push(flag_obj)
        }
        container_obj.ports = []
        for (const port of container.ports) {
            const port_obj = new ContainerPort()
            port_obj.port = port.port
            port_obj.protocol = port.protocol
            container_obj.ports.push(port_obj)
        }
        container_obj.networks = []
        for (const network of container.networks) {
            const network_obj = new ContainerNetwork()
            network_obj.network = network.subnet
            network_obj.random_cidr = true
            container_obj.networks.push(network_obj)
        }

        service.containers.push(container_obj)
    }

    return service
}

const parse_service_to_front_config = (service) => {
    const containers = []
    let index = 0
    for(const container of service.containers) {
        const container_obj = {
            id : index,
            name : 'Service ' + index++,
            image_name : container.image,
            flags : [],
            ports : [],
            networks : []
        }
        for (const flag of container.flags) {
            const flag_obj = {
                flag_command : flag.flag_command,
                flag_score : flag.flag_score,
                flag_uuid : flag.flag_uuid
            }
            container_obj.flags.push(flag_obj)
        }
        for (const port of container.ports) {
            const port_obj = {
                port : port.port,
                protocol : port.protocol
            }
            container_obj.ports.push(port_obj)
        }
        for (const network of container.networks) {
            const network_obj = {
                subnet : network.network
            }
            container_obj.networks.push(network_obj)
        }
        containers.push(container_obj)
    }
    return {
        total_score : service.total_score,
        network_count : service.network_count,
        container_count : service.container_count,
        containers
    }
}

export default {
    components: {
        ServiceEditor
    },
    computed : {
        isNew() {
            return this.sid == 0
        }
    },
    data: () => ({
        gid : 0,
        sid : 0,
        service_name : '',
        service_description : '',
        author : '',
        price : 0,
        service_config : {
            total_score : 0,
            network_count : 0,
            container_count : 0,
            containers : []
        }
    }),
    watch : {
        'service_config.containers' : {
            handler : function (val) {
                this.service_config.container_count = val.length
                let total_score = 0
                let network_count = 0
                const network_map = {}
                for(let i = 0; i < val.length; i++) {
                    for (let j = 0; j < val[i].flags.length; j++) {
                        total_score += val[i].flags[j].flag_score
                    }
                    for (let j = 0; j < val[i].networks.length; j++) {
                        if(!network_map[val[i].networks[j].subnet]) {
                            network_map[val[i].networks[j].subnet] = true
                            network_count++
                        }
                    }
                }
                this.service_config.total_score = total_score
                this.service_config.network_count = network_count
            },
            deep : true
        }
    },
    methods : {
        commit() {
            if (this.isNew) {
                this.create()
            } else {
                this.update()
            }
        },
        async load() {
            const { data } = await api_comp_service_get(this.sid)
            if (data && data['res'] == 0) {
                const service = data['data']['service']
                this.gid = service.gid
                this.service_name = service.name
                this.service_description = service.description
                this.author = service.author
                this.price = service.price
                this.service_config = parse_service_to_front_config(JSON.parse(service.config))
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async create() {
            const { data } = await api_comp_service_create(
                this.service_name, this.service_description, this.author, this.gid, this.service_config.total_score, this.price, 
                JSON.stringify(parse_front_config_to_service(this.service_config.total_score, this.service_config.network_count, this.service_config.container_count, this.service_config.containers))
            )

            if (data && data['res'] == 0) {
                this.$router.back()
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async update() {
            const { data } = await api_comp_service_update(
                this.sid, this.service_name, this.service_description, this.author, this.service_config.total_score, this.price, 
                JSON.stringify(parse_front_config_to_service(this.service_config.total_score, this.service_config.network_count, this.service_config.container_count, this.service_config.containers))
            )

            if (data && data['res'] == 0) {
                this.$router.back()
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        }
    },
    mounted() {
        this.gid = parseInt(this.$route.params.gid)
        this.sid = parseInt(this.$route.params.sid)
        if(!this.gid) {
            this.$router.back()
        }
        if (this.sid) {
            this.load()
        }
    }
}
</script>

<style>

</style>