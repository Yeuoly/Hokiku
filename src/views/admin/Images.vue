<template>
    <v-container>
        <v-data-table
            :headers="table_headers"
            :items="images"
            :items-per-page="25"
            class="elevation-1"
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
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openInfoMessageBox } from '../../concat/bus';
import {
    api_docker_native_service_image_list,
    api_docker_native_service_image_delete
} from '../../interface/docker'

export default {
    data: () => ({
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