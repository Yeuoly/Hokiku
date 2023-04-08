<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card-title>
                    <h3>公告管理</h3>
                </v-card-title>
            </v-col>
            <v-col cols="12">
                <v-card-actions>
                    <v-btn color="primary" @click="dialog.new_carousel = true">新建</v-btn>
                </v-card-actions>
            </v-col>
            <v-col cols="12">
                <v-data-table
                    :headers="carousel_headers"
                    :items="carousels"
                    :items-per-page="10"
                    :server-items-length="99999999"
                    :options.sync="carousel_options"
                    class="elevation-1"
                >
                    <template v-slot:item.title="{ item }">
                        <v-text-field
                            v-model="item.title"
                            label="标题"
                        ></v-text-field>
                    </template>
                    <template v-slot:item.content="{ item }">
                        <v-text-field
                            v-model="item.content"
                            label="内容"
                        ></v-text-field>
                    </template>
                    <template v-slot:item.image="{ item }">
                        <v-text-field
                            v-model="item.image"
                            label="图片地址"
                        ></v-text-field>
                    </template>
                    <template v-slot:item.show="{ item }">
                        <v-switch
                            v-model="item.show"
                            label="是否公开"
                        ></v-switch>
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-btn color="error" @click="deleteCarousel(item.id)">删除</v-btn>
                        <v-btn color="primary" @click="updateCarousel(item.id, item.title, item.content, item.image, item.show)">更新</v-btn>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12">
                <v-card-title>
                    <h3>新闻管理</h3>
                </v-card-title>
            </v-col>
            <v-col cols="12">
                <v-card-actions>
                    <v-btn color="primary" @click="dialog.new_newspost = true">新建</v-btn>
                </v-card-actions>
            </v-col>
            <v-col cols="12">
                <v-data-table
                    :headers="newspost_headers"
                    :items="newsposts"
                    :items-per-page="10"
                    :server-items-length="99999999"
                    :options.sync="newsposts_options"
                    class="elevation-1"
                >
                    <template v-slot:item.content="{ item }">
                        <v-text-field
                            v-model="item.content"
                            label="内容"
                        ></v-text-field>
                    </template>
                    <template v-slot:item.icon="{ item }">
                        <v-select
                            v-model="item.icon"
                            :items="mdi_icons"
                            label="图标"
                        >
                            <template v-slot:item="{ item }">
                                <v-list-item-avatar>
                                    <v-icon>{{ item }}</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{ item }}</v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-select>
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-btn color="error" @click="deleteNewspost(item.id)">删除</v-btn>
                        <v-btn color="primary" @click="updateNewspost(item.id, item.content, item.icon)">更新</v-btn>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12">
                <v-card-title>
                    <h3>更新日志管理</h3>
                </v-card-title>
            </v-col>
            <v-col cols="12">
                <v-card-actions>
                    <v-btn color="primary" @click="dialog.new_updatelog = true">新建</v-btn>
                </v-card-actions>
            </v-col>
            <v-col cols="12">
                <v-data-table
                    :headers="updatelog_headers"
                    :items="updatelogs"
                    :items-per-page="10"
                    :server-items-length="99999999"
                    :options.sync="updatelogs_options"
                    class="elevation-1"
                >
                    <template v-slot:item.content="{ item }">
                        <v-text-field
                            v-model="item.content"
                            label="内容"
                        ></v-text-field>
                    </template>
                    <template v-slot:item.version="{ item }">
                        <v-text-field
                            v-model="item.version"
                            label="版本"
                        ></v-text-field>
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-btn color="error" @click="deleteUpdatelog(item.id)">删除</v-btn>
                        <v-btn color="primary" @click="updateUpdatelog(item.id, item.content, item.version)">更新</v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-dialog
            v-model="dialog.new_carousel"
            max-width="500px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">新建轮播图</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="form.new_carousel.title"
                        label="标题"
                    ></v-text-field>
                    <v-text-field
                        v-model="form.new_carousel.content"
                        label="内容"
                    ></v-text-field>
                    <upload-image
                        @src="onChangeNewCarouselImage"
                    ></upload-image>
                    <v-switch
                        v-model="form.new_carousel.show"
                        label="是否公开"
                    ></v-switch>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog.new_carousel = false">取消</v-btn>
                    <v-btn color="blue darken-1" text @click="createCarousel()">创建</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialog.new_newspost"
            max-width="500px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">新建新闻</span>
                </v-card-title>
                <v-card-text>
                    <v-select
                        v-model="form.new_newspost.icon"
                        :items="mdi_icons"
                        label="图标"
                    >
                        <template v-slot:item="{ item }">
                            <v-list-item-avatar>
                                <v-icon>{{ item }}</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{ item }}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-select>
                    <v-text-field
                        v-model="form.new_newspost.content"
                        label="内容"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog.new_newspost = false">取消</v-btn>
                    <v-btn color="blue darken-1" text @click="createNewspost()">创建</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialog.new_updatelog"
            max-width="500px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">新建更新日志</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="form.new_updatelog.content"
                        label="内容"
                    ></v-text-field>
                    <v-text-field
                        v-model="form.new_updatelog.version"
                        label="版本"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog.new_updatelog = false">取消</v-btn>
                    <v-btn color="blue darken-1" text @click="createUpdatelog()">创建</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { openErrorSnackbar } from '../../concat/bus'
import {
    api_boardcast_carousel_create,
    api_boardcast_carousel_delete,
    api_boardcast_carousel_update,
    api_boardcast_carousel_list_admin,
    api_boardcast_newspost_create,
    api_boardcast_newspost_delete,
    api_boardcast_newspost_update,
    api_boardcast_newspost_list,
    api_boardcast_updatelog_create,
    api_boardcast_updatelog_delete,
    api_boardcast_updatelog_update,
    api_boardcast_updatelog_list,
} from '../../interface/boardcast'

import UploadImage from '../../components/common/UploadImage'

export default {
    components : { UploadImage },
    data : () => ({
        carousel_headers : [
            { text: 'ID', value: 'id' },
            { text: '标题', value: 'title' },
            { text: '图片', value: 'image' },
            { text: '内容', value: 'content' },
            { text: '是否公开', value: 'show' },
            { text: '修改', value: 'action' }
        ],
        carousel_options : {},
        carousels : [],
        newspost_headers : [
            { text: 'ID', value: 'id' },
            { text: '内容', value: 'content' },
            { text: '图标', value: 'icon' },
            { text: '修改', value: 'action' }
        ],
        newsposts : [],
        newsposts_options : {},
        updatelog_headers : [
            { text: 'ID', value: 'id' },
            { text: '内容', value: 'content' },
            { text: '版本', value: 'version' },
            { text: '修改', value: 'action' },
        ],
        updatelogs_options : {},
        updatelogs : [],
        dialog : {
            new_carousel : false,
            new_newspost : false,
            new_updatelog : false,
        },
        form : {
            new_carousel : {
                title : '',
                image : '',
                content : '',
                show : true,
            },
            new_newspost : {
                content : '',
                icon : ''
            },
            new_updatelog : {
                content : '',
                version : '',
            },
        },
        mdi_icons : [
            'mdi-account', 'mdi-calendar', 'mdi-camera', 'mdi-check', 'mdi-chevron-down', 'mdi-chevron-left', 
            'mdi-chevron-right', 'mdi-chevron-up', 'mdi-close', 'mdi-email', 'mdi-heart', 'mdi-home', 'mdi-lock', 
            'mdi-menu', 'mdi-music', 'mdi-play', 'mdi-search', 'mdi-star', 'mdi-trash-can', 'mdi-account-circle', 'mdi-arrow-left',
            'mdi-arrow-right', 'mdi-arrow-up', 'mdi-arrow-down', 'mdi-arrow-collapse', 'mdi-arrow-expand', 'mdi-arrow-collapse-all',
            'mdi-arrow-expand-all', 'mdi-arrow-down-bold', 'mdi-arrow-up-bold', 'mdi-arrow-left-bold', 'mdi-arrow-right-bold',
            'mdi-arrow-down-bold-circle', 'mdi-arrow-up-bold-circle', 'mdi-arrow-left-bold-circle', 'mdi-arrow-right-bold-circle',
            'mdi-arrow-down-bold-circle-outline', 'mdi-arrow-up-bold-circle-outline', 'mdi-arrow-left-bold-circle-outline',
            'mdi-arrow-right-bold-circle-outline', 'mdi-arrow-down-bold-hexagon-outline', 'mdi-arrow-up-bold-hexagon-outline',
            'mdi-arrow-left-bold-hexagon-outline', 'mdi-arrow-right-bold-hexagon-outline', 'mdi-arrow-collapse-vertical',
            'mdi-arrow-expand-vertical', 'mdi-arrow-collapse-horizontal', 'mdi-arrow-expand-horizontal', 'mdi-arrow-decision',
            'mdi-arrow-decision-auto', 'mdi-arrow-decision-auto-outline', 'mdi-arrow-decision-outline', 'mdi-arrow-left-right',
            'mdi-arrow-left-right-bold', 'mdi-arrow-left-right-bold-outline', 'mdi-arrow-left-right-thick', 'mdi-arrow-split-horizontal',
            'mdi-arrow-split-vertical', 'mdi-arrow-top-left', 'mdi-arrow-top-left-bold-outline', 'mdi-arrow-top-left-bottom-right',
            'mdi-arrow-top-left-bottom-right-bold', 'mdi-arrow-top-left-thick', 'mdi-arrow-top-right', 'mdi-arrow-top-right-bold-outline',
            'mdi-arrow-top-right-bottom-left', 'mdi-arrow-top-right-bottom-left-bold', 'mdi-arrow-top-right-thick', 'mdi-arrow-up-down',
            'mdi-arrow-up-down-bold', 'mdi-arrow-up-down-bold-outline', 'mdi-arrow-up-down-thick', 'mdi-arrow-vertical-lock',
            'mdi-asterisk', 'mdi-at', 'mdi-attachment', 'mdi-auto-fix', 'mdi-auto-upload', 'mdi-autorenew', 'mdi-av-timer', 'mdi-baby',
            'mdi-baby-buggy', 'mdi-backburger', 'mdi-backspace', 'mdi-backup-restore', 'mdi-bandcamp', 'mdi-bank', 'mdi-barcode',
            'mdi-barcode-scan', 'mdi-barley', 'mdi-barrel', 'mdi-basecamp', 'mdi-basket', 'mdi-basket-fill', 'mdi-basket-unfill',
            'mdi-battery', 'mdi-battery-10', 'mdi-battery-20', 'mdi-battery-30', 'mdi-battery-40', 'mdi-battery-50', 'mdi-battery-60',
            'mdi-battery-70', 'mdi-battery-80', 'mdi-battery-90', 'mdi-battery-alert', 'mdi-battery-charging', 'mdi-battery-charging-100',
            'mdi-battery-charging-20', 'mdi-battery-charging-30', 'mdi-battery-charging-40', 'mdi-battery-charging-60',
            'mdi-battery-charging-80', 'mdi-battery-charging-90', 'mdi-battery-minus', 'mdi-battery-negative', 'mdi-battery-outline',
            'mdi-battery-plus', 'mdi-battery-positive', 'mdi-battery-unknown', 'mdi-beach', 'mdi-beaker', 'mdi-beats', 'mdi-beer',
            'mdi-behance', 'mdi-bell', 'mdi-bell-off', 'mdi-bell-outline', 'mdi-bell-plus', 'mdi-bell-ring', 'mdi-bell-ring-outline',
            'mdi-bell-sleep', 'mdi-beta', 'mdi-bible', 'mdi-bike', 'mdi-bing', 'mdi-binoculars', 'mdi-bio', 'mdi-biohazard', 'mdi-bitbucket',
            'mdi-black-mesa', 'mdi-blackberry', 'mdi-blender', 'mdi-blinds', 'mdi-block-helper', 'mdi-blogger', 'mdi-bluetooth',
            'mdi-alert-circle-outline'
        ]
    }),
    watch : {
        'carousel_options.page' : function(){
            this.loadCarousels()
        },
        'newsposts_options.page' : function(){
            this.loadNewsposts()
        },
        'updatelogs_options.page' : function(){
            this.loadUpdatelogs()
        },
    },
    methods : {
        onChangeNewCarouselImage(src) {
            this.form.new_carousel.image = src
        },
        async loadCarousels() {
            const { data } = await api_boardcast_carousel_list_admin(this.carousel_options.page)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.carousels = data['data']['carousels']
                }
            }
        },
        async loadNewsposts() {
            const { data } = await api_boardcast_newspost_list(this.newsposts_options.page)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.newsposts = data['data']['newsposts']
                }
            }
        },
        async loadUpdatelogs() {
            const { data } = await api_boardcast_updatelog_list(this.updatelogs_options.page)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                } else {
                    this.updatelogs = data['data']['update_logs']
                }
            }
        },
        async createCarousel() {
            const { data } = await api_boardcast_carousel_create(
                this.form.new_carousel.title, 
                this.form.new_carousel.content, 
                this.form.new_carousel.image, 
                this.form.new_carousel.show
            )
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.dialog.new_carousel = false
                    this.loadCarousels()
                }
            }
        },
        async createNewspost() {
            const { data } = await api_boardcast_newspost_create(
                this.form.new_newspost.content,
                this.form.new_newspost.icon
            )
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.dialog.new_newspost = false
                    this.loadNewsposts()
                }
            }
        },
        async createUpdatelog() {
            const { data } = await api_boardcast_updatelog_create(
                this.form.new_updatelog.content,
                this.form.new_updatelog.version
            )
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.dialog.new_updatelog = false
                    this.loadUpdatelogs()
                }
            }
        },
        async deleteCarousel(id) {
            const { data } = await api_boardcast_carousel_delete(id)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.loadCarousels()
                }
            }
        },
        async deleteNewspost(id) {
            const { data } = await api_boardcast_newspost_delete(id)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.loadNewsposts()
                }
            }
        },
        async deleteUpdatelog(id) {
            const { data } = await api_boardcast_updatelog_delete(id)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.loadUpdatelogs()
                }
            }
        },
        async updateCarousel(id, title, content, image, show) {
            const { data } = await api_boardcast_carousel_update(id, title, content, image, show)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.loadCarousels()
                }
            }
        },
        async updateNewspost(id, content, icon) {
            const { data } = await api_boardcast_newspost_update(id, content, icon)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.loadNewsposts()
                }
            }
        },
        async updateUpdatelog(id, content, version) {
            const { data } = await api_boardcast_updatelog_update(id, content, version)
            if(!data){
                openErrorSnackbar('网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.loadUpdatelogs()
                }
            }
        },
    },
    mounted() {
        this.loadCarousels()
        this.loadNewsposts()
        this.loadUpdatelogs()
    }
}
</script>

<style>

</style>