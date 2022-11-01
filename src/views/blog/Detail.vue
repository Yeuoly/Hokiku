<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h2 class="headline mb-0">{{ title }}</h2>
            </v-card-title>
            <v-card-text>
                <v-icon>mdi-clock-outline</v-icon> 创建于： {{ new Date(created_at * 1000).formatDate('Y-M-D h:m:s') }}
                <v-icon>mdi-clock-outline</v-icon> 更新于： {{ new Date(updated_at * 1000).formatDate('Y-M-D h:m:s') }}
                <v-icon>mdi-account-outline</v-icon>  <router-link :to="'/blog/space/' + uid">前往作者主页>></router-link>
                <br class="py2">
                <br>
                <v-row>
                    <v-col>
                        <v-icon>mdi-eye-outline</v-icon>阅读：{{ views }}
                    </v-col>
                    <v-col>
                        <v-icon>mdi-comment-outline</v-icon>评论：{{ comments }}
                    </v-col>
                    <v-col>
                        <v-icon>mdi-thumb-up-outline</v-icon>点赞：{{ likes }}
                    </v-col>
                </v-row>
                <v-divider class="my-5" />
                <div v-if="content_type === 1">
                    <InnerHTML
                        :html="content"
                    />
                </div>
                <div v-else>
                    <Markdown
                        :content="content"
                    />
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import InnerHTML from '../../components/common/InnerHTML.vue'
import Markdown from '../../components/common/Markdown.vue'
import { openErrorSnackbar } from '../../concat/bus'
import { api_blog_detail } from '../../interface/api'
export default {
    components : { InnerHTML, Markdown },
    data : () => ({
        title : '',
        content : '',
        content_type : 1,
        created_at : 0,
        updated_at : 0,
        uid : 0,
        id : 0,
        views : 0,
        comments : 0,
        likes : 0,
    }),
    methods : {
        async loadBlog() {
            const { data } = await api_blog_detail(this.id)
            if (data && data['res'] == 0) {
                this.title = data['data']['blog']['title']
                this.content = data['data']['blog']['r_rich_content']['content']
                this.content_type = data['data']['blog']['r_rich_content']['type']
                this.created_at = data['data']['blog']['created_at']
                this.updated_at = data['data']['blog']['updated_at']
                this.views = data['data']['blog']['views']
                this.comments = data['data']['blog']['comments']
                this.likes = data['data']['blog']['likes']
                this.uid = data['data']['blog']['uid']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        }
    },
    mounted() {
        const id = parseInt(this.$route.params.id)
        if (id) {
            this.id = id
            this.loadBlog()
        } else {
            this.$router.push('/blog')
        }
    }
}
</script>

<style>

</style>