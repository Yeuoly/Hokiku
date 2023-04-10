<template>
    <div style="width: 100%">
        <editor v-model="code" :lang="language" theme="monokai" height="528" ref="coder"></editor>
    </div>
</template>

<script>
require('vue2-ace-editor')
require('brace/ext/language_tools');              
require('brace/mode/c_cpp')
require('brace/mode/javascript')
require('brace/mode/html')
require('brace/mode/markdown')
require('brace/mode/css')
require('brace/mode/python')
require('brace/mode/golang')
require('brace/mode/php')
require('brace/mode/java')
require('brace/theme/monokai')
require('brace/snippets/javascript') //snippet
require('brace/snippets/html') //snippet
require('brace/snippets/css') //snippet
require('brace/snippets/c_cpp') //snippet
require('brace/snippets/markdown') //snippet
require('brace/snippets/python') //snippet
require('brace/snippets/golang') //snippet
require('brace/snippets/java') //snippet
require('brace/snippets/php') //snippet

export default {
    components : { 
        editor: require('vue2-ace-editor')
    },
    props : {
        language : {
            type : String,
            default : 'javascript'
        },
        parent_code : {
            type : String,
            default : ''
        }
    },
    data : () => ({
        code : ''
    }),
    model : {
        prop : 'parent_code',
        event : 'change'
    },
    watch : {
        code() {
            this.$emit('change', this.code)
            this.$emit('input', this.code)
        },
        parent_code : {
            handler() {
                this.code = this.parent_code
            },
            immediate : true
        }
    },
    mounted() {
        setTimeout(() => {
            const coder = this.$refs.coder.editor;
            coder.setTheme('ace/theme/monokai');
            coder.setOptions({
                enableLiveAutocompletion : true
            });
            coder.container.style.fontSize = '16px'
        });
    }
}
</script>

<style>

</style>