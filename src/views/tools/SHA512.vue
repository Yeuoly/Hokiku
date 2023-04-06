<template>
  <div>
    <v-container>
      <v-row>
        <v-col :cols="12">
          <v-alert outlined type="success" text>
            SHA512 哈希
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
          <v-card-text>
            <v-textarea
              v-model="src"
              label="输入文本"
              outlined
              rows="10"
              placeholder="在此输入需要计算 SHA512 哈希值的文本"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
        </v-col>
        <v-col :cols="12">
          <v-card-text>
            <v-textarea
              v-model="dst"
              label="SHA512 哈希值"
              outlined
              rows="2"
              placeholder="计算得到的 SHA512 哈希值将显示在此处"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  data: () => ({
    src: '',
  }),
  computed: {
    dst() {
      return this.calculateSHA512();
    },
  },
  methods: {
    calculateSHA512() {
      return CryptoJS.SHA512(this.src).toString();
    },
  },
};
</script>
