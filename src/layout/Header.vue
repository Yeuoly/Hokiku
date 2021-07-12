<template>
    <v-app-bar dense dark style="flex: none">
        <v-app-bar-nav-icon @click.stop="changeNavigationStatus"></v-app-bar-nav-icon>
        <v-app-bar-title>Hokiku</v-app-bar-title>
    </v-app-bar>
</template>

<script>

import { applyChangeNavigationStatus } from '../concat/bus'

export default {
    methods : {
        changeNavigationStatus() {
            applyChangeNavigationStatus()
        }
    }
}
</script>