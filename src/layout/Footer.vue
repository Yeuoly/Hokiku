<template>
    <footer class="footer">
        <div class="container">
        <div class="footer-inner">
            <v-layout class="py5">
                <v-row>
                    <v-col :cols="5" class="text-header">
                        <v-row>
                            <v-col :cols="4">
                                <div class="pb5">
                                    IrinaGame
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#" class="link-color">关于我们</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#" class="link-color">联系我们</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#" class="link-color">加入我们</a>
                                </div>
                            </v-col>
                            <v-col :cols="4">
                                <div class="pb5">
                                    友情链接
                                </div>
                                <div class="text-15 pb2">
                                    <a href="https://nssctf.cn" class="link-color">NSSCTF</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="https://hgreed.vip/" class="link-color">HRP</a>
                                </div>
                            </v-col>
                            <v-col :cols="4">
                                <div class="pb5">
                                    社区
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#" class="link-color">论坛（开发中）</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="/blog" class="link-color">博客</a>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-layout>
            <v-divider ></v-divider>
            <p class="content has-text-centered text-left">
            <a href="http://www.beian.miit.gov.cn" target="_blank" class="link-color">湘ICP备17021409号-3</a>
            <a href="#" class="link-color"> © 2020 - {{ new Date().getFullYear() }} IrinaGame</a>
            </p>
        </div>
        </div>
    </footer>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.footer {
    padding: 1rem 0;
    background-color: white;
}

.footer-inner {
    margin: 0 auto;
}

.link-color {
    color : #86c3ff;
    text-decoration: none;
}

.text-header {
    font-size: 18px;
    font-weight: 600;
    color: deepskyblue;
}

</style>