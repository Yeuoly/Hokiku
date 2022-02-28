<template>
    <v-container></v-container>
</template>

<script>
export default {
    data : () => ({
        cid: 0
    }),
    methods : {

    },
    mounted(){
        const cid = this.$route.params.cid
        console.log(cid)
    }
}
</script>

<style>

</style>