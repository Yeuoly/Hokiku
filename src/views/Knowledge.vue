<template>
    <v-container>
        <v-breadcrumbs divider="\" :items="routes">
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item
                    href="#"
                    :disabled="!item.avaliable"
                    @click="$router.push('/knowledge/' + item.path)"
                >
                    {{ item.text.toUpperCase() }}
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>
        <router-view></router-view>
    </v-container>
</template>

<script>
export default {
    data : () => ({
        routes : [{
            text : '我的课程',
            path : 'mine',
            avaliable : true
        }, {
            text : '公共资源',
            path : 'public',
            avaliable : true
        }, {
            text : '课程集',
            path : 'sheet',
            avaliable : true
        }, {
            text : '付费课程',
            path : 'jinkela',
            avaliable : false
        }]
    })
}
</script>

<style>

</style>