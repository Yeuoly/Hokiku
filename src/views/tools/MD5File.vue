<template>
    <div>
      <v-container>
        <v-row>
          <v-col :cols="12">
            <v-alert outlined type="success" text>
              MD5 哈希
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
              <v-file-input
                v-model="file"
                label="选择文件"
                outlined
                placeholder="选择需要计算 MD5 哈希值的文件"
              ></v-file-input>
            </v-card-text>
            <v-divider></v-divider>
          </v-col>
          <v-col :cols="12">
            <v-card-text>
              <v-textarea
                v-model="md5"
                label="MD5 哈希值"
                outlined
                rows="1"
                placeholder="计算得到的 MD5 哈希值将显示在此处"
              ></v-textarea>
            </v-card-text>
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import SparkMD5 from 'spark-md5';
  
  export default {
    data: () => ({
        file: null,
        md5: '',
    }),
    watch : {
        file : {
            handler : function () {
                this.calculateMD5();
            },
            deep : true
        }
    },
    methods: {
      calculateMD5() {
        if (this.file) {
          const reader = new FileReader();
          reader.readAsBinaryString(this.file);
          reader.onload = e => {
            this.md5 = SparkMD5.hashBinary(e.target.result);
          };
        }
      },
    },
  };
  </script>
  