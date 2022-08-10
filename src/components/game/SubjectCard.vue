<template>
    <div class="py1 clickable">
    <v-card shaped @click="openDialog">
        <!-- title -->
        <v-card-title>
            {{ title }}
        </v-card-title>
        <!-- comment -->
        <v-card-text>
            <p>初始分值：{{ origin_score }}</p>
            {{ comment }}
        </v-card-text>
    </v-card>
    <v-dialog v-model="dialog.show" max-width="800">
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    {{ title }}
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                {{ comment }}
            </v-card-text>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
export default {
    props : {
        title : {
            type : String,
            default : ''
        },
        comment : {
            type : String,
            default : ''
        },
        resolved : {
            type : Boolean,
            default : false
        },
        resolves : {
            type : Number,
            default : 0
        },
        origin_score : {
            type : Number,
            default : 0
        },
    },
    data : () => ({
        dialog : {
            show : false,
            title : '',
            content : ''
        }
    }),
    methods : {
        openDialog() {
            this.dialog.show = true
        }
    }
}
</script>

<style>

</style>