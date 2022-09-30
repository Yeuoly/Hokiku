<template>
    <v-container>
        <v-layout>
            <v-row>
                <v-col :cols="12">
                    <v-card-title>
                        <v-icon>
                            mdi-tools
                        </v-icon>
                        <h2 class="headline mb-0">Tools</h2>
                    </v-card-title>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <div v-for="(i, k) in tools" :key="k">
                        <v-row>
                            <v-col :cols="12">
                                <v-card-title>
                                    <v-icon>
                                        mdi-chevron-down
                                    </v-icon>
                                    {{ i.name }}
                                </v-card-title>
                                <v-card-text>
                                    {{ i.comment }}
                                </v-card-text>
                                <v-divider></v-divider>
                            </v-col>
                            <v-col :cols="12">
                                <v-col :cols="6" :sm="6" :md="4" :lg="3" :xl="2" v-for="(j, l) in i.sub" :key="l">
                                    <div class="tools-sub-card clickable" @click="to(j.path)">
                                        {{ j.name }}
                                    </div>
                                </v-col>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data : () => ({
        tools : [{
            module: 'shell',
            name: '加壳防护',
            comment : '你可以为你的Linux、Windows、Android程序加上一个外壳让它们变得难以破解',
            sub : [{
                name: 'Kurumi/x86_Linux',
                path: '/tools/kurumi'
            }]
        }, {
            module: 'en/decode',
            name : '编码解码',
            comment : '一些常见的编码解码操作，当然，需要不断完善',
            sub : [{
                name: 'Base系列编/解码',
                path: '/tools/baseserial'
            }]
        }]
    }),
    methods :{
        to(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style>
.tools-sub-card {
    width: 100%;
    color: #00aeec;
    font-weight: 700;
    background-color: aliceblue;
    height: 70px;
    text-align: center;
    line-height: 70px;
    border-radius: 8px;
}
</style>