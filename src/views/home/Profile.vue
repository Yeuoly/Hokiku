<template>
    <v-row>
        <v-dialog v-model="dialogs.org" width="500">
            <v-card class="px5 py5">
                <v-text-field
                    label="组织ID"
                    v-model.number="apply_join_org.id"
                ></v-text-field>
                <v-text-field
                    label="组织ID"
                    v-model="apply_join_org.apply.name"
                    placeholder="组织内名"
                ></v-text-field>
                <v-textarea
                
                    label="申请信息"
                    v-model="apply_join_org.apply.text"
                    placeholder="申请信息"
                ></v-textarea>
                
                <v-btn color="primary" @click="applyJoinOrg">提交申请</v-btn>
            </v-card>
        </v-dialog>
        <v-row class="px5">
            <v-col cols="11" style="padding-top: 20px" class="pl5">
                <v-avatar size="72" class="mr5">
                    <v-img src="https://yeuoly.oss-cn-beijing.aliyuncs.com/irina/static/default_avatar.jpg"></v-img>
                </v-avatar>
                <v-btn disabled>更换头像</v-btn>
            </v-col>
            <v-col cols="12" class="pl5">
                <v-text-field
                    label="用户名"
                    v-model="profile.id"
                    counter="16"
                    type="text"
                >
                    <template v-slot:append-outer>
                        <v-btn 
                            @click="applyChangeName"
                            :disabled="!isNameAvaliable"
                        >
                            修改
                        </v-btn>
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="10" class="pl5">
                <v-card-text>已加入组织：</v-card-text>
                <v-card-actions>
                    <v-chip-group>
                        <v-chip 
                            text-color="white" 
                            v-for="(i, k) in orgs" 
                            :color="chip_colors[k % chip_colors.length]" 
                            :key="k"
                        >
                            {{ i.name }}
                        </v-chip>
                    </v-chip-group>
                </v-card-actions>
            </v-col>
            <v-col cols="2">
                <v-btn color="primary" @click="dialogs.org = true">申请加入</v-btn>
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
        </v-row>
    </v-row>
</template>

<script>

import { isAvaliableNameFormat } from '../../util/index'

export default {
    name : 'Profile',
    data : () => ({
        profile : {
            id: '',
            uid : 0
        },
        orgs : [{
            name : 'Default',
            id : 0
        }],
        chip_colors : ['primary', 'red', 'cyan', 'green', 'secondary'],
        dialogs : { org : false },
        apply_join_org : {
            id : 0,
            apply : {
                text : '',
                name : ''
            }
        }
    }),
    methods : {
        applyChangeName(){
            /* TODO */
        },
        applyJoinOrg(){
            /* TODO */
        }
    },
    computed : {
        isNameAvaliable(){
            return this.$store.getters.getUserName != this.profile.id
                && isAvaliableNameFormat(this.profile.id)
        }
    },
    mounted(){
        this.profile.id = this.$store.getters.getUserName
        this.profile.uid = this.$store.getters.getUserUid
    }
}
</script>

<style scoped>

</style>