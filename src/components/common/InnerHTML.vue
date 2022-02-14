<template>
    <div class="innerhtml">
        <div v-html="clean_html"></div>
    </div>
</template>

<script>
import { xssFilter } from '../../util/index'

export default {
    props : ['html'],
    computed : {
        clean_html(){
            return xssFilter(this.html)
        }
    }
}
</script>

<style>
.innerhtml * img {
    width: 100%;
}
</style>