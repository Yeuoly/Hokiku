<template>
<div>
    <v-container v-if="isIndex">
        <v-card>

        </v-card>
    </v-container>
    <router-view v-else></router-view>
</div>
</template>

<script>

export default {
    computed : {
        isIndex(){
            return this.$route.name === 'collection-index'
        }
    }
}
</script>

<style>

</style>