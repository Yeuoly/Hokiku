<template>
    <v-card>
        <v-row>
            <v-col :cols="12" :sm="12" :md="6" :lg="6" :xl="6">
                <CodeEditor
                    language="markdown"
                    v-model="code"
                ></CodeEditor>
            </v-col>
            <v-col :cols="12" :sm="12" :md="6" :lg="6" :xl="6">
                <Markdown
                    :content="visual"
                ></Markdown>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import CodeEditor from '../../components/common/CodeEditor.vue'
import Markdown from '../../components/common/Markdown.vue'

export default {
    components : { CodeEditor, Markdown },
    name : 'MarkdownEditor',
    model : {
        prop : 'value',
        event : 'change'
    },
    props : {
        value : {
            type : String,
            default : ''
        }
    },
    data : () => ({
        code : '',
        visual : '',
        timer : null
    }),
    watch : {
        code() {
            this.$emit('change', this.code)
            this.$emit('input', this.code)

            //lazy update
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.visual = this.code
            }, 500)
        },
        value : {
            handler() {
                this.code = this.value
            },
            immediate : true
        }
    }
}
</script>

<style>

</style>