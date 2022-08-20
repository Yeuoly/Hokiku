<template>
    <div>
        <LoadingOverlay></LoadingOverlay>
        <div ref="editor" style="z-index:1"></div>
    </div>
</template>

<script>
import WangEditor from 'wangeditor'
import HLJS from 'highlight.js'
import { api_resource_upload_image } from '../../interface/api'
import { closeLoadingOverlay, openErrorMessageBox, openLoadingOverlay } from '../../concat/bus'
import LoadingOverlay from './LoadingOverlay.vue'

import PreviewMenu from './lib/PreviewMenu'

export default {
    components : { LoadingOverlay },
    name : 'RichEditor',
    model : {
        event : 'change',
        prop : 'hostValue'
    },
    props : ['hostValue'],
    data : () => ({
        editor : null,
    }),
    watch : {
        hostValue : {
            handler(v){
                this.editor.txt.html(v)
            }
        }
    },
    mounted(){
        const editor = new WangEditor(this.$refs.editor)
        editor.highlight = HLJS
        editor.config.uploadImgMaxSize = 4 * 1024 * 1024
        editor.config.customUploadImg = async (files, insert) => {
            const file = files[0]
            openLoadingOverlay()
            const { data } = await api_resource_upload_image(file)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    insert(data['data']['extra'])
                }
            }
            closeLoadingOverlay()
        }

        //博客预览扩展
        editor.menus.extend('PreviewMenu', PreviewMenu);
        editor.config.menus = editor.config.menus.concat('PreviewMenu');   
        editor.create()
        if(this.$vuetify.breakpoint.mdAndUp){
            editor.config.onPreviewCallBack( res => {
                this.$emit('change-preview', res);
            });
        }
        let active = false
        let timer_over = true
        let current_html = ''
        //延时更新
        const timer = () => {
            if(timer_over){
                timer_over = false
                setTimeout(() => {
                    timer_over = true
                    if(!active){
                        this.$emit('change', current_html)
                    }else{
                        active = false
                        timer()
                    }
                }, 300)
            }
        }
        const change = html => {
            active = true
            current_html = html
            timer()
        }
        editor.config.onchange = html => change(html)
        this.editor = editor
    }
}
</script>

<style>

.w-e-menu {
  z-index: 2 !important;
}
.w-e-toolbar {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
</style>