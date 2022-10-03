<template>
    <div>
        <v-container>
            <v-row>
                <v-col :cols="12">
                    <v-alert
                        outlined
                        type="success"
                        text
                    >
                        ROTn（凯撒）
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>纯前端实现，随便造</li>
                        </ul>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-card-text>
                        <v-textarea
                            v-model="src"
                            label="原文"
                            outlined
                            rows="10"
                        ></v-textarea>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <div class="rot-item" v-for="(i, k) in result" :key="k">
                        <v-row>
                            <v-col :cols="3">
                                ROT {{ k + 1 }} :
                            </v-col>
                            <v-col>
                                {{ i }}
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

import {
    rot
} from '../../util/crypto/rot'

export default {
    data : () => ({
        src : '',
        result : [],
    }),
    watch : {
        src() {
            this.result = []
            for (let i = 1; i < 26; i++) {
                this.result.push(
                    rot(this.src, i)
                )
            }
        }
    },
}
</script>

<style>
.rot-item {
    padding: 3px;
}
</style>