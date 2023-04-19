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
                        <li>子网请使用ABCDEFG等字母代替，最终平台将自动生成子网</li>
                        <li>端口映射将会将对应容器的端口映射到公共区域，用于环境入口</li>
                    </ul>
                </v-card-text>
            </v-col>
            <v-col :cols="12">
                <v-text-field
                    label="服务名称"
                    v-model="service_name"
                ></v-text-field>
            </v-col>
        </v-row>
        <service-editor
            :containers.sync="containers"
        ></service-editor>
    </v-container>
</template>

<script>
import ServiceEditor from '../../components/common/ServiceEditor.vue'

export default {
    components: {
        ServiceEditor
    },
    data: () => ({
        service_name : '',
        containers : []
    }),
    watch : {
        containers : {
            handler : function (val) {
                console.log(val)
            },
            deep : true
        }
    }
}
</script>

<style>

</style>