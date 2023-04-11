<template>
  <v-container>
    <v-row class="py5">
      <v-col :cols="12">
        <v-text-field
            v-model="image_name"
        ></v-text-field>
      </v-col>
      <v-col :cols="12">
        <v-btn-toggle>
            <v-btn color="primary" @click="select">
            选择zip文件（包含镜像dockerfile在内的所有文件）
            </v-btn>
            <v-btn color="green" dark @click="download">
            下载当前镜像
            </v-btn>
            <v-btn color="primary" dark @click="compile">
            编译
            </v-btn>
        </v-btn-toggle>
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
    <v-dialog
        v-model="dialog.show"
        max-width="800"
    >
        <v-card>
            <v-card-title class="headline">{{ dialog.title }}</v-card-title>
            <v-card-text>
                <v-textarea
                    v-model="dialog.content"
                    label="编译日志"
                    readonly
                    rows="20"
                ></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog.show = false">
                    关闭
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import FileManager from "../../components/common/FileManager.vue";
import { pwn_template, awd_php7_template, awd_php7_mysql_template, php7_template, php7_mysql } from "./images";
import {
    api_docker_native_service_image_build,
    api_docker_native_service_image_build_check
} from '../../interface/docker'
import { openErrorMessageBox, openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus';
import {
  sleep
} from '../../util/index'

export default {
  components: { FileManager },
  data: () => ({
    zip: null,
    real_zip: null,
    image_name: "pwn:v1",
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
    dialog : {
        show : false,
        title : '',
        content : '',
    }
  }),
  methods: {
    async compile() {
        const dockerzip = new Blob([this.real_zip], { type: "application/zip" });
        const { data } = await api_docker_native_service_image_build(this.image_name, dockerzip);
        this.dialog.title = `编译镜像 ${this.image_name}`;
        if (!data || data.res != 0) {
            openErrorSnackbar(data ? data['err'] : '请检查网络');
            return
        }

        const message_response_id = data['data']['message_response_id'];
        const status_response_id = data['data']['status_response_id'];
        this.dialog.show = true;

        let condition = true;
        while(condition) {
            const { data } = await api_docker_native_service_image_build_check(message_response_id, status_response_id);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            const message = data['data']['message'];
            const finished = data['data']['finished'];
            const error = data['data']['error'];
            if (message) {
                this.dialog.content += message;
            }
            if (finished) {
                condition = false;
                if (error) {
                    openErrorMessageBox('错误', error)
                    condition = false;
                } else {
                    openSuccessSnackbar('编译成功')
                }
                break;
            }

            await sleep(1000)
        }
    },
    download() {
        // download real_zip which is a blob
        const a = document.createElement("a");
        //Failed to execute 'createObjectURL' on 'URL': Overload resolution failed."
        // a.href = URL.createObjectURL(this.real_zip);
        a.href = URL.createObjectURL(new Blob([this.real_zip], { type: "application/zip" }));
        a.download = `image-${new Date().getTime()}.zip`
        a.click();
        a.remove();
    },
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