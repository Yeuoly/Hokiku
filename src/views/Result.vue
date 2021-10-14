<template>
    <v-container full-height full-width>
        <h1 :style="`margin: 0 auto;color: ${map[type]};`">
            {{ text }}
        </h1>
    </v-container>
</template>

<script>
export default {
    data : () => ({
        type : 'success',
        text : '',
        map : {
            success : 'rgb(76, 175, 80)'
        }
    }),
    mounted(){
        this.text = this.$route.params.text
    }
}
</script>

<style>

</style>