<template>
    <footer class="footer">
        <div class="container">
        <div class="footer-inner">
            <v-layout>
                <v-row>
                    <v-col :cols="5" class="text-grey">
                        <v-row>
                            <v-col :cols="3">
                                <div class="pb5">
                                    IrinaCTF
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#">关于我们</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#">联系我们</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#">加入我们</a>
                                </div>
                            </v-col>
                            <v-col :cols="3">
                                <div class="pb5">
                                    友情链接
                                </div>
                                <div class="text-15 pb2">
                                    <a href="https://ctfer.vip">NSSCTF</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="https://hgreed.vip/">HRP</a>
                                </div>
                            </v-col>
                            <v-col :cols="6">
                                <div class="pb5">
                                    社区
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#">论坛（开发中）</a>
                                </div>
                                <div class="text-15 pb2">
                                    <a href="#">博客（开发中）</a>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col :cols="7">

                    </v-col>
                </v-row>
            </v-layout>
            <p class="content has-text-centered text-center">
            <a href="http://www.beian.miit.gov.cn" target="_blank">湘ICP备17021409号-3</a> <br>
            <a href="#"> © 2020 - {{ new Date().getFullYear() }} IrinaCTF</a>
            </p>
        </div>
        </div>
    </footer>
</template>

<script>
export default {
    
}
</script>

<style>
.footer {
    background-color: #f6f9fa;
    padding: 1rem 0;
}

.footer-inner {
    margin: 0 auto;
    max-width: 1000px;
}


</style>