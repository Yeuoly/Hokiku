<template>
  <v-container>
    <v-row class="py5">
      <v-col :cols="12">
        <v-btn color="primary" @click="select">
          选择zip文件（包含镜像dockerfile在内的所有文件）
        </v-btn>
      </v-col>
      <v-col :cols="12">
        <v-alert color="primary" dark dense> 选择默认镜像 </v-alert>
        <v-chip-group>
          <v-chip
            color="primary"
            v-for="image in default_images"
            :key="image.name"
            @click="selectDefaultImage(image.image)"
          >
            {{ image.name }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <file-manager :zipFile="zip" @change="updateFile"></file-manager>
  </v-container>
</template>

<script>
import FileManager from "../../components/common/FileManager.vue";
import { pwn_template, awd_php7_template, awd_php7_mysql_template, php7_template, php7_mysql } from "./images";

export default {
  components: { FileManager },
  data: () => ({
    zip: null,
    real_zip: null,
    zip_name: "image.zip",
    default_images: [
      {
        name: "pwn",
        image: new Blob([pwn_template], { type: "application/zip" }),
      },
      {
        name: "awd_php7",
        image: new Blob([awd_php7_template], { type: "application/zip" }),
      },
        {
            name: "awd_php7_mysql",
            image: new Blob([awd_php7_mysql_template], { type: "application/zip" }),
        },
        {
            name: "php7",
            image: new Blob([php7_template], { type: "application/zip" }),
        },
        {
            name: "php7_mysql",
            image: new Blob([php7_mysql], { type: "application/zip" }),
        },
    ],
    selected_default_image: null,
  }),
  methods: {
    selectDefaultImage(image) {
      this.zip = image;
    },
    updateFile(file) {
      this.real_zip = file;
    },
    select() {
      // create a hidden input element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".zip";
      input.onchange = (e) => {
        const file = e.target.files[0];
        this.zip = file;
        this.zip_name = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
          const arr = new Uint8Array(e.target.result);
          let str = "";
          for (let i = 0; i < arr.length; i++) {
            str += arr[i] + ",";
            if (i % 32 == 0) {
              str += "\n";
            }
          }
          console.log(str);
        };
        reader.readAsArrayBuffer(file);
      };
      input.click();
      input.remove();
    },
  },
};
</script>

<style>
</style>