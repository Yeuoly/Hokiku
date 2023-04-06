<template>
  <div>
    <v-container>
      <v-row>
        <v-col :cols="12">
          <v-alert outlined type="success" text>
            AES 加密
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
          <v-radio-group v-model="dst_type" row>
            <v-radio label="加密" value="encode"></v-radio>
            <v-radio label="解密" value="decode"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col :cols="12">
          <v-select
            v-model="selectedMode"
            :items="modes"
            label="加密模式"
            outlined
          ></v-select>
        </v-col>
        <v-col :cols="12">
          <v-btn color="primary" @click="switchTo">切换加密/解密</v-btn>
        </v-col>
        <v-col :cols="12">
          <v-text-field label="密钥" v-model="key"></v-text-field>
        </v-col>
        <v-col :cols="12">
          <v-text-field
            v-if="selectedMode !== 'ECB'"
            label="初始化向量 (IV)"
            v-model="iv"
          ></v-text-field>
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
              rows="10"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { AES, enc } from 'crypto-js';
import CryptoJs from 'crypto-js';

console.log(AES, enc)

export default {
  data: () => ({
    src: '',
    dst_type: 'encode',
    key: '',
    iv: '',
    selectedMode: 'CBC',
    modes: ['CBC', 'ECB', 'CFB', 'OFB', 'CTR'],
  }),
  computed: {
    dst() {
      switch (this.dst_type) {
        case 'encode':
          return this.encrypt();
        case 'decode':
          return this.decrypt();
      }
      return '';
    },
  },
  methods: {
    switchTo() {
      switch (this.dst_type) {
        case 'encode':
          this.src = this.dst;
          this.dst_type = 'decode';
          break;
        case 'decode':
          this.src = this.dst;
          this.dst_type = 'encode';
          break;
      }
    },
    encrypt() {
      const keyBytes = enc.Utf8.parse(this.key);
      const ivBytes = this.selectedMode !== 'ECB' ? enc.Utf8.parse(this.iv) : null;
      const srcBytes = enc.Utf8.parse(this.src);

      let cipherText;

      if (this.selectedMode === 'ECB') {
        cipherText = AES.encrypt(srcBytes, keyBytes, {
          mode: CryptoJs.mode.ECB,
          padding: CryptoJs.pad.Pkcs7,
        });
      } else {
        cipherText = AES.encrypt(srcBytes, keyBytes, {
          iv: ivBytes,
          mode: CryptoJs.mode[this.selectedMode],
          padding: CryptoJs.pad.Pkcs7,
        });
      }

      return cipherText.toString();
    },
    decrypt() {
      const keyBytes = enc.Utf8.parse(this.key);
      const ivBytes = this.selectedMode !== 'ECB' ? enc.Utf8.parse(this.iv) : null;

      let decryptedText;

      if (this.selectedMode === 'ECB') {
        decryptedText = AES.decrypt(this.src, keyBytes, {
          mode: CryptoJs.mode.ECB,
          padding: CryptoJs.pad.Pkcs7,
        });
      } else {
        decryptedText = AES.decrypt(this.src, keyBytes, {
          iv: ivBytes,
          mode: CryptoJs.mode[this.selectedMode],
          padding: CryptoJs.pad.Pkcs7,
        });
      }

      return enc.Utf8.stringify(decryptedText);
    },
  },
};
</script>

