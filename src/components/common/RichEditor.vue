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
import UploadAttachmentMenu from './lib/UploadAttachmentMenu'

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
        const uploadImage = file => {
            return new Promise((resolve) => {
                (async function(){
                    const { data } = await api_resource_upload_image(file)
                    if(!data){
                        openErrorMessageBox('错误', '请检查网络连接')
                    }else{
                        if(data['res'] != 0){
                            openErrorMessageBox('错误', data['err'])
                        }else{
                            resolve(data['data']['extra'])
                        }
                    }
                })()
            })
        }

        const editor = new WangEditor(this.$refs.editor)
        editor.highlight = HLJS
        editor.config.uploadImgMaxSize = 4 * 1024 * 1024
        editor.config.customUploadImg = async (files, insert) => {
            const file = files[0]
            openLoadingOverlay()
            const url = await uploadImage(file)
            insert(url)
            closeLoadingOverlay()
        }

        //hook paste event
        editor.config.pasteTextHandle = function (pasteStr) {
            const b64ToBlog = (b64Data, contentType = '', sliceSize = 512) => {
                const byteCharacters = atob(b64Data)
                const byteArrays = []
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize)
                    const byteNumbers = new Array(slice.length)
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i)
                    }
                    const byteArray = new Uint8Array(byteNumbers)
                    byteArrays.push(byteArray)
                }
                const blob = new Blob(byteArrays, { type: contentType })
                return blob
            }
            // find base64 encoded image and replace it with a link
            //const regex = /<img\s[\S\s]*src="data:image\/(png|jpg|jpeg);base64,([^"]+)"[^>]*>/g
            //the regex above is not working, It can only find the first image
            const matches = []
            for (let i = 0; i < pasteStr.length; i++) {
                //find image tag
                if (pasteStr[i] === '<' && pasteStr[i + 1] === 'i' && pasteStr[i + 2] === 'm' && pasteStr[i + 3] === 'g') {
                    //capture the end of the tag
                    let j = i + 4
                    while (j < pasteStr.length) {
                        if (pasteStr[j] === '>') {
                            break
                        }
                        j++
                    }
                    //test if the tag is a base64 image
                    const tag = pasteStr.substring(i, j + 1)
                    const regex = /<img\s[\S\s]*src="data:image\/(png|jpg|jpeg);base64,([^"]+)"[^>]*>/
                    const match = regex.exec(tag)
                    if (match && match.length === 3) {
                        matches.push(match)
                    }
                }
            }
            if (matches) {
                const pre_images = [];
                for (let i = 0; i < matches.length; i++) {
                    const match = matches[i]
                    //replace image with <pre-image id="${random}"></pre-image>
                    const random = Math.random().toString(36) + Math.random().toString(36)
                    pasteStr = pasteStr.replace(match[0], `<pre-image id="${random}"></pre-image>`);
                    pre_images.push({
                        id: random,
                        type: match[1],
                        data: match[2]
                    })
                }
                //upload images
                openLoadingOverlay();
                (async function(){
                    for (let i = 0; i < pre_images.length; i++) {
                        const pre_image = pre_images[i]
                        const blob = b64ToBlog(pre_image.data, `image/${pre_image.type}`)
                        const { data } = await api_resource_upload_image(blob)
                        if(!data){
                            openErrorMessageBox('错误', '请检查网络连接')
                        }else{
                            if(data['res'] != 0){
                                openErrorMessageBox('错误', data['err'])
                            }else{
                                const url = data['data']['extra']
                                const pre_image_element = document.getElementById(pre_image.id)
                                pre_image_element.outerHTML = `<img src="${url}">`
                            }
                        }
                    }
                    closeLoadingOverlay()
                })()
            }
            return pasteStr.replace(/&nbsp;/g, ' ')
        }
 
        //highlight code
        //上传附件
        editor.menus.extend('UploadAttachmentMenu', UploadAttachmentMenu);
        editor.config.menus = editor.config.menus.concat('UploadAttachmentMenu');

        //博客预览扩展
        editor.menus.extend('PreviewMenu', PreviewMenu);
        editor.config.menus = editor.config.menus.concat('PreviewMenu');   
        editor.create()
        if(this.$vuetify.breakpoint.mdAndUp){
            editor.config.onPreviewCallBack( res => {
                this.$emit('change-preview', res);
            });
        }
        editor.config.onUploadAttachmentBegin(() => {
            openLoadingOverlay()
        })
        editor.config.onUploadAttachmentEnd(() => {
            closeLoadingOverlay()
        })
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