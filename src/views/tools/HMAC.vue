<template>
  <div>
    <v-container>
      <v-row>
        <v-col :cols="12">
          <v-alert outlined type="success" text>
            HMAC SHA-256
          </v-alert>
          <v-divider></v-divider>
          <v-card-text>
            <v-icon color="green">mdi-information</v-icon>
            重要提示：
            <ul>
              <li>纯前端实现，无服务器交互</li>
            </ul>
          </v-card-text>
          <v-divider></v-divider>
        </v-col>
        <v-col :cols="12">
          <v-text-field label="密钥" v-model="key"></v-text-field>
        </v-col>
        <v-col :cols="12">
          <v-card-text>
            <v-textarea
              v-model="src"
              label="输入文本"
              outlined
              rows="10"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
        </v-col>
        <v-col :cols="12">
          <v-card-text>
            <v-textarea
              v-model="dst"
              label="结果"
              outlined
              rows="1"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { HmacSHA256 } from 'crypto-js';

export default {
  data: () => ({
    src: '',
    key: '',
  }),
  computed: {
    dst() {
      return this.calculateHMAC();
    },
  },
  methods: {
    calculateHMAC() {
      return HmacSHA256(this.src, this.key).toString();
    },
  },
};
</script>
