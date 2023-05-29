<template>
    <div>
      <v-container>
        <v-row>
          <v-col :cols="12">
            <v-alert outlined type="success" text>
              SHA1 哈希
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
                placeholder="选择需要计算 SHA1 哈希值的文件"
              ></v-file-input>
            </v-card-text>
            <v-divider></v-divider>
          </v-col>
          <v-col :cols="12">
            <v-card-text>
              <v-textarea
                v-model="SHA1"
                label="SHA1 哈希值"
                outlined
                rows="1"
                placeholder="计算得到的 SHA1 哈希值将显示在此处"
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
  
function calcFileHash(file, callback) {
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 1024 * 64,
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    hasher_sha1 = CryptoJS.algo.SHA1.create();

  let fileReader = new FileReader();

    fileReader.onload = function (e) {
    let CryptoJS_data = CryptoJS.enc.Latin1.parse(e.target.result);
    hasher_sha1.update(CryptoJS_data);

    currentChunk += 1;
    if (currentChunk < chunks) {
      loadNext();
    } else {
      callback(hasher_sha1.finalize().toString(CryptoJS.enc.Hex));
    }
  };


  function loadNext() {
    var start = currentChunk * chunkSize,
      end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    fileReader.readAsBinaryString(blobSlice.call(file, start, end));
  }

  loadNext();
}

export default {
    data: () => ({
        file: null,
        SHA1: '',
    }),
    watch : {
        file : {
            handler : function () {
                this.calculateSHA1();
            },
            deep : true
        }
    },
    methods: {
      calculateSHA1() {
        if (this.file) {
          const reader = new FileReader();
          reader.readAsBinaryString(this.file);
          reader.onload = () => {
            calcFileHash(this.file, (hash) => {
              this.SHA1 = hash;
            })
          };
        }
      },
    },
  };
  </script>
  