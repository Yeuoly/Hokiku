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
        <div class="blog-list-container">
            <div class="blog" v-for="(i, k) in blogs" :key="k">
                <div class="blog-head">
                    {{i}}
                </div>
                <div class="blog-body">

                </div>
            </div>
        </div>
        <dir class="blog-list-pagination">
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
    methods : {
        async getBlogs(){
            const { data } = await api_blog_list(this.uid, this.page, 20)
            console.log(data)
        },
        async loadUserInfo() {
            const { data } = await api_user_info(this.uid)
            if (data && data['res'] == 0) {
                this.profile.username = data['data']['username']
            }
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
    height: 200px;
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
</style>