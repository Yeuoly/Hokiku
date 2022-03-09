<template>
    <video controls :width="width" :height="height" :src="src"></video>
</template>

<script>
export default {
    props : {
        src : {
            type : String,
            default : ''
        },
        width : {
            type : Number,
            default : 600
        },
        height : {
            type : Number,
            default : 400
        }
    }
}
</script>

<style>

</style>