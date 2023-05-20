<template>
    <v-container>
        <v-data-table
            :headers="table_headers"
            :items="images"
            :items-per-page="25"
        >
            <template v-slot:item.id="{ item }">
                {{ item.Id }}
            </template>
            <template v-slot:item.name="{ item }">
                {{ (item.RepoTags && item.RepoTags.length > 0) ? item.RepoTags[0] : '无' }}
            </template>
            <template v-slot:item.size="{ item }">
                {{ (item.Size / 1024 / 1024).toFixed(2) }} MB
            </template>
            <template v-slot:item.time="{ item }">
                {{ new Date(item.Created * 1000) }}
            </template>
            <template v-slot:item.action="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="deleteImageConfirm(item.Id)"
                >
                    mdi-delete
                </v-icon>
                <v-icon
                    small
                    class="mr-2"
                    @click="push((item.RepoTags && item.RepoTags.length > 0) ? item.RepoTags[0] : '无')"
                >
                    mdi-upload
                </v-icon>
            </template>
        </v-data-table>
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
import { openErrorMessageBox, openErrorSnackbar, openInfoMessageBox, openSuccessSnackbar } from '../../concat/bus';
import {
    api_docker_native_service_image_list,
    api_docker_native_service_image_delete,
    api_docker_native_service_image_push,
    api_docker_native_service_image_push_check
} from '../../interface/docker'
import { sleep } from '../../util';

export default {
    data: () => ({
        dialog : {
            show : false,
            title : '',
            content : '',
        },
        images: [],
        table_headers : [
            { text: '镜像ID', value: 'id' },
            { text: '镜像名', value: 'name' },
            { text: '镜像大小', value: 'size' },
            { text: '创建时间', value: 'time' },
            { text: '操作', value: 'action', sortable: false },
        ],
    }),
    methods: {
        async push(image_name) {
            const { data } = await api_docker_native_service_image_push(image_name);
            this.dialog.title = `上传镜像`;
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }

            const message_response_id = data['data']['message_response_id'];
            const status_response_id = data['data']['status_response_id'];
            this.dialog.show = true;

            let condition = true;
            while(condition) {
                const { data } = await api_docker_native_service_image_push_check(message_response_id, status_response_id);
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
        async getImages() {
            const { data } = await api_docker_native_service_image_list();
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
            } else {
                this.images = data['data']['images'];
            }
        },
        async deleteImage(image_id) {
            const { data } = await api_docker_native_service_image_delete(image_id);
            if(!data || data['res'] != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
            } else {
                this.getImages();
            }
        },
        async deleteImageConfirm(image_id) {
           const v = await openInfoMessageBox('确认','确认删除镜像 ' + image_id + ' 吗？');
            if(v) {
                this.deleteImage(image_id);
            }
        },
    },
    mounted() {
        this.getImages();
    }
}
</script>

<style>

</style>