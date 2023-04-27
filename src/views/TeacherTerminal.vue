<template>
    <v-container style="margin-bottom: 30px">
        <v-flex>
            <v-row>
                <v-col v-if="!isMobile" cols="12">
                    <v-card>
                        <v-btn-toggle
                            v-model="text"
                            tile
                            color="deep-purple accent-3"
                            group
                        >
                            <v-btn
                                v-for="(i, k) in navs"
                                :key="k" 
                                link 
                                @click="$router.push(`/teacher/${i.path}`)"
                            >
                                <v-icon class="px3" color="primary">
                                    {{ i.icon }}
                                </v-icon> 
                                {{ i.text }}
                            </v-btn>
                            <v-menu
                                left
                                bottom
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        link
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-icon class="px3" color="primary">mdi-book-open-page-variant</v-icon>
                                        题库
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item
                                        v-for="(o, k) in orgs"
                                        :key="k"
                                        link
                                        @click="$router.push(`/teacher/question/${o.id}`)"
                                    >
                                        <v-list-item-title>{{o.name}}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            <v-menu
                                left
                                bottom
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        link
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-icon class="px3" color="primary">mdi-web</v-icon>
                                        渗透测试
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item
                                        v-for="(o, k) in orgs"
                                        :key="k"
                                        link
                                        @click="$router.push(`/teacher/service/${o.id}`)"
                                    >
                                        <v-list-item-title>{{o.name}}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-btn-toggle>
                    </v-card>
                </v-col>
                <v-col v-else>
                    <v-bottom-navigation class="message-bottom-nav">
                        <v-btn
                           v-for="(i, k) in navs"
                            :key="k" 
                            link 
                            @click="$router.push(`/teacher/${i.path}`)"
                        >
                            <span>{{ i.text }}</span>
                        </v-btn>
                    </v-bottom-navigation>
                </v-col>
                <v-col cols="12">
                    <v-card>
                        <router-view></router-view>
                        <div class="py5"></div>
                    </v-card>
                </v-col>
            </v-row>
        </v-flex>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../concat/bus';
import {
    api_organization_manage_list_orgs,
} from "../interface/api";

export default {
    data : () => ({
        orgs: [],
        text : null,
        navs : [{
            text : '发布作业',
            path : 'publish-homework',
            icon : 'mdi-file-document-edit-outline'
        }, {
            text : '查看作业',
            path : 'check-homework',
            icon : 'mdi-file-document-check-outline'
        }, {
            text : '发布收集表',
            path : 'publish-coll',
            icon : 'mdi-file-document-arrow-right-outline'
        }, {
            text : '发布课程',
            path : 'publish-course',
            icon : 'mdi-human-male-board-poll'
        }, {
            text : '我的课程',
            path : 'courses',
            icon : 'mdi-math-integral-box'
        }, {
            text : '班级',
            path : 'orgs',
            icon : 'mdi-account-group'
        }, {
            text : '课程集',
            path : 'course/sheet',
            icon : 'mdi-unfold-less-vertical'
        }],
    }),
    computed : {
        isMobile(){
            return !this.$vuetify.breakpoint.mdAndUp
        }
    },
    methods : {
        async loadOrganizations() {
            const { data } = await api_organization_manage_list_orgs();
            if (!data) {
                    openErrorMessageBox("错误", "网络异常");
            } else {
                if (data["res"] != 0) {
                    openErrorMessageBox("错误", data["err"]);
                } else {
                    this.orgs = data["data"];
                }
            }
        },
    },
    mounted() {
        this.loadOrganizations();
    },
}
</script>

<style>
.message-bottom-nav{
    position: fixed;
    z-index: 5;
}
</style>