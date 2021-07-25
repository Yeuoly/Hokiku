<template>
    <div>
        <div ref="editor" style="z-index:1"></div>
    </div>
</template>

<script>
import WangEditor from 'wangeditor'
import HLJS from 'highlight.js'

export default {
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
        editor.config.uploadImgMaxSize = 2 * 1024 * 1024
        editor.config.customUploadImg = (files, insert) => {
            //上传图片
            console.log(files, insert)
        }
        editor.create()
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
                }, 1000)
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