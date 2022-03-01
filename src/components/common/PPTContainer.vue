<template>
    <iframe :src="'https://view.officeapps.live.com/op/view.aspx?src=' + src" 
    :height="height" :width="width" frameborder="0"></iframe>
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