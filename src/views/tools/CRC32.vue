<template>
  <div>
    <v-container>
      <v-row>
        <v-col :cols="12">
          <v-alert outlined type="success" text>
            CRC32 校验和
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
import { crc32 } from 'crc';

export default {
  data: () => ({
    src: '',
  }),
  computed: {
    dst() {
      return this.calculateCRC32();
    },
  },
  methods: {
    calculateCRC32() {
      return crc32(this.src).toString(16).toUpperCase();
    },
  },
};
</script>
