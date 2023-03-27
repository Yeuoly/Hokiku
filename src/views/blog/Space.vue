<template>
    <v-container>
        <div class="blog-space-header">
            <div class="blog-space-header-spacer"></div>
            <div class="blog-space-header-avatar">
                <v-avatar size="100" class="mx-auto">
                    <img class="blog-space-header-avatar-inner" :src="profile.avatar" />
                </v-avatar>
            </div>
            <div class="blog-space-header-info">
                <div class="blog-space-header-info-name">
                    {{ profile.username }} <span class="text-14">(UID: {{ uid }})</span> 
                </div>
            </div>
        </div>
        <v-row>
            <v-col :cols="12" :sm="12" :lg="10" :xl="9">
                <div class="blog-list-container">
                    <div class="blog" v-for="(i, k) in blogs" :key="k">
                        <div class="blog-head">
                            <div class="blog-head-title" :id="'blog-anchor-' + i.id">
                                <router-link :to="'/blog/detail/' + i.id">{{ i.title }}</router-link>
                            </div>
                            <div class="blog-head-info-menu" v-if="is_self">
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon v-on="on">
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-row class="px5 py5" style="background-color: white">
                                        <v-list>
                                            <v-list-item>
                                                <v-btn depressed color="primary" dark @click="to('/blog/edit/' + i.id)">
                                                    <v-icon>mdi-pencil</v-icon> 编辑
                                                </v-btn>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-btn depressed color="red" dark>
                                                    <v-icon>mdi-delete</v-icon> 删除
                                                </v-btn>
                                            </v-list-item>
                                        </v-list>
                                    </v-row>
                                </v-menu>
                            </div>
                            <div class="blog-head-info">
                                <div class="blog-head-info-item">
                                    <v-icon class="blog-head-info-item-icon">mdi-clock-outline</v-icon>
                                    <span class="blog-head-info-item-text">
                                        {{ new Date(i.created_at * 1000).formatDate('Y-M-D h:m:s') }}
                                    </span>
                                    <!-- spacer -->
                                    <div style="width: 10px"></div>
                                    <!-- views -->
                                    <v-icon class="blog-head-info-item-icon">mdi-eye-outline</v-icon>
                                    <span class="blog-head-info-item-text">阅读：{{ i.views }}</span>
                                    <!-- spacer -->
                                    <div style="width: 10px"></div>
                                    <!-- comments -->
                                    <v-icon class="blog-head-info-item-icon">mdi-comment-outline</v-icon>
                                    <span class="blog-head-info-item-text">评论：{{ i.comments }}</span>
                                    <!-- spacer -->
                                    <div style="width: 10px"></div>
                                    <!-- likes -->
                                    <v-icon class="blog-head-info-item-icon">mdi-thumb-up-outline</v-icon>
                                    <span class="blog-head-info-item-text">点赞：{{ i.likes }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="blog-content">
                            <div class="blog-content-text">
                                {{ i.descript }}
                            </div>
                        </div>
                        <v-divider></v-divider>
                    </div>
                </div>
                <dir class="blog-list-pagination pt5">
                    <v-pagination
                        v-model="page"
                        :length="999999"
                        :total-visible="7"
                        :prev-icon="'mdi-chevron-left'"
                        :next-icon="'mdi-chevron-right'"
                        :color="'#3C87CD'"
                        :background-color="'#F5F5F5'"
                        :hide-default-footer="true"
                    ></v-pagination>
                </dir>
            </v-col>
            <v-col :cols="12" :sm="12" :lg="2" :xl="3">
                <div class="blog-sidebar">
                    <div class="blog-sidebar-title">最新文章</div>
                    <v-divider></v-divider>
                    <div class="blog-sidebar-content">
                        <div class="blog-sidebar-content-item" v-for="(i, k) in blogs" :key="k">
                            <a :href="'#blog-anchor-' + i.id">{{k}}. {{ i.title }}</a>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
        <div class="helper-btn-group">
            <v-btn
                class="helper-btn"
                fab
                dark
                color="primary"
                @click="to('/blog/edit/0')"
                title="新建文章"
            >
                <v-icon>mdi-plus </v-icon>
            </v-btn>
        </div>
    </v-container>
</template>

<script>
import { api_blog_list, api_user_info } from '../../interface/api'
export default {
    data : () => ({
        blogs : [],
        uid : 0,
        profile : {
            avatar : 'https://yeuoly.oss-cn-beijing.aliyuncs.com/irina/static/default_avatar.jpg',
            username : 'Anonymous',
        },
        page : 1,
    }),
    computed : {
        is_self : function() {
            return this.$store.getters.getUserUid == this.uid
        }
    },
    methods : {
        async getBlogs(){
            const { data } = await api_blog_list(this.uid, this.page, 20)
            if (data && data['res'] == 0 && data['data']['blogs']) {
                this.blogs = data['data']['blogs']
            }
        },
        async loadUserInfo() {
            const { data } = await api_user_info(this.uid)
            if (data && data['res'] == 0) {
                this.profile.username = data['data']['username']
            }
        },
        to(path) {
            this.$router.push(path)
        }
    },
    watch : {
        page() {
            this.getBlogs()
        }
    },
    mounted(){
        let uid = parseInt(this.$route.params.uid)
        if (uid == 0) {
            uid = this.$store.getters.getUserUid;
            this.$router.push({params : {uid : uid}})
        } else if (!uid) {
            this.$router.push('/404')
            return
        }
        this.uid = uid
        this.getBlogs()
        this.loadUserInfo()
    }
}
</script>

<style>
.blog-space-header {
    margin-bottom: 20px;
    height: 150px;
    position: relative;
}

.blog-space-header-spacer {
    padding: 20px;
    border-radius: 10px;
    background-image: url(//yeuoly.oss-cn-beijing.aliyuncs.com/yeuolyblog/public/daily/20210127/e1d73ecc5b9f932f8e4879a30ee890693d3ee429.png);
    height: 120px;
    background-position: center;
    background-size: cover;
}

.blog-space-header-avatar {
    position: absolute;
    top: 50px;
    left: 30px;
    right: 0;
    bottom: 0;
    margin: auto;
}

.blog-space-header-info {
    position: absolute;
    top: 80px;
    left: 140px;
    bottom: 0;
    margin: auto;
    font-size: 26px;
    font-weight: 500;
    color: aliceblue;
}

.blog-space-header-avatar-inner {
    border-radius: 50%;
    border: aliceblue solid 3px;
}

.blog {
    padding: 20px;
}

.blog-list-container {
    background-color: rgb(255,255,255);
    border-radius: 10px;
}

.blog-head {
    position: relative;
}

.blog-head-title {
    font-family: "Open Sans","Microsoft Jhenghei","Microsoft Yahei",sans-serif;
    font-size: 2.4rem;
    font-weight: 700;
    letter-spacing: -1px;
    transition-delay: 0s;
    transition-duration: .3s;
    transition-property: color;
    transition-timing-function: ease;
    word-wrap: break-word;
    -webkit-tap-highlight-color: transparent;
}

.blog-head-title a {
    color : rgb(74,74,74);
    /** remove a tag underline */
    text-decoration: none !important;
}

.blog-head-title a:hover {
    color : rgb(0,0,0);
    text-decoration: none !important;
}

.blog-head-info {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}

.blog-head-info-menu {
    position: absolute;
    right: 0;
    top: 0;
    margin: auto;
}

.blog-head-info-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 20px;
}

.blog-head-info-item-icon {
    margin-right: 5px;
    font-size: 16px !important;
}

.blog-head-info-item-text {
    font-size: 14px;
    color: #999;
}

.blog-content {
    margin-top: 20px;
}

.blog-content-text {
    color: #666;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    line-height: 1.5;
    padding: 5px 0 10px 0;
    color: #3a4145;
    margin: 0;
    text-align: justify;
    font-size: 1.05em;
    font-weight: 100;
}

.blog-sidebar {
    margin-top: 20px;
    border-radius: 10px;
}

.blog-sidebar-title {
    padding: 10px;
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: -1px;
    transition-delay: 0s;
    transition-duration: .3s;
    transition-property: color;
    transition-timing-function: ease;
    word-wrap: break-word;
    -webkit-tap-highlight-color: transparent;
    text-align: center;
    color: rgb(74,74,74);
}

.blog-sidebar-content {
    padding: 10px;
}

.blog-sidebar-content-item {
    padding: 5px 0;
}

.blog-sidebar-content-item a {
    color: rgb(74,74,74);
    text-decoration: none;
}

.helper-btn-group {
    position: fixed;
    right : 120px;
    bottom : 120px;
}

.helper-btn-group button {
    width: 80px !important;
    height: 80px !important;
}

/** mobile of  helper-btn-group */
@media screen and (max-width: 768px) {
    .helper-btn-group {
        position: fixed;
        right : 20px;
        bottom : 20px;
    }

    .helper-btn-group button {
        width: 60px !important;
        height: 60px !important;
    }
}

</style>