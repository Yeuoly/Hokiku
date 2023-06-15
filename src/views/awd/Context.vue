<template>
    <div>
        <v-container>
            <v-card>
                <v-col :cols="12">
                    <v-card-title class="text-primary">
                        AWD Checker 镜像构建
                    </v-card-title>
                </v-col>
                <v-col :cols="12">
                    <v-btn-toggle>
                        <v-btn color="primary" @click="select">
                            选择zip文件（包含镜像dockerfile在内的所有文件）
                        </v-btn>
                        <v-btn color="green" dark @click="download">
                            下载当前镜像
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
                <v-col :cols="12">
                    <file-manager :zipFile="zip" @change="updateFile"></file-manager>
                </v-col>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import FileManager from "../../components/common/FileManager.vue";
import { awd_checker_py39_pwntools, awd_checker_py27_pwntools, awd_checker_py39_requests } from "../admin/images";

export default {
    components: { FileManager },
    data : () => ({
        zip: null,
        real_zip: null,
        image_name: "",
        default_images: [
            {
                name: "py39-pwntools",
                image: new Blob([awd_checker_py39_pwntools], { type: "application/zip" }),
            },
            {
                name: "py27-pwntools",
                image: new Blob([awd_checker_py27_pwntools], { type: "application/zip" }),
            },
            {
                name: "py39-requests",
                image: new Blob([awd_checker_py39_requests], { type: "application/zip" }),
            },
        ],
        selected_default_image: null,
    }),
    methods: {
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
            // // create a hidden input element
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
}
</script>

<style>

</style>

