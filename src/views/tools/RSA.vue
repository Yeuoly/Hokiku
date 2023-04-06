<template>
  <div>
    <v-container>
      <v-row>
        <v-col :cols="12">
          <v-alert outlined type="success" text>
            RSA 加密
          </v-alert>
          <v-divider></v-divider>
          <v-card-text>
            <v-icon color="green">mdi-information</v-icon>
            重要提示：
            <ul>
              <li>纯前端实现，无服务器交互</li>
              <li>默认使用pkcs8格式的秘钥</li>
              <li>您可以使用默认的秘钥来测试平台功能</li>
              <li>
                随机生成的公钥：{{defaultPublicKey}}
              </li>
              <li>
                随机生成的私钥：{{defaultPrivateKey}}
              </li>
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
          <v-btn color="primary" @click="switchTo">切换加密/解密</v-btn>
        </v-col>
        <v-col :cols="12">
          <v-text-field label="公钥" v-model="publicKey" v-if="dst_type === 'encode'"></v-text-field>
          <v-text-field label="私钥" v-model="privateKey" v-if="dst_type === 'decode'"></v-text-field>
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
import NodeRSA from 'node-rsa';

export default {
  data: () => ({
    src: '',
    dst_type: 'encode',
    publicKey: '',
    privateKey: '',
    defaultPublicKey : '',
    defaultPrivateKey : '',
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
    initDefaultKey() {
      const key = new NodeRSA({b: 512});
      this.defaultPublicKey = key.exportKey('pkcs8-public-pem');
      this.defaultPrivateKey = key.exportKey('pkcs8-private-pem');
    },
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
      try {
          const key = new NodeRSA(this.publicKey);
          return key.encrypt(this.src, 'base64');
      } catch (e) {
        return '';
      }
    },
    decrypt() {
      try {
          const key = new NodeRSA(this.privateKey);
          return key.decrypt(this.src, 'utf8');
      } catch (e) {
        return '';
      }
    },
  },
  mounted() {
    this.initDefaultKey();
  }
};
</script>
