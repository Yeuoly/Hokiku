<template>
    <div class="v-overlay text-xs-center bg-overlay v-overlay--active loading-overlay" v-show="value">
        <VProgressCircular
                class="app-items__loading"
                indeterminate
                size="64"
                color="white"
        ></VProgressCircular>
    </div>
</template>

<script>
    import { ui_trans_bus } from "../../concat/bus";
    export default {
        name: "LoadingOverlay",
        data : () => ({
            value : false
        }),
        methods : {
            open(){
                this.value = true;
            },
            close(){
                this.value = false;
            }
        },
        created(){
            ui_trans_bus.$on('open-loading-overlay',this.open);
            ui_trans_bus.$on('close-loading-overlay',this.close);
        }
    }
</script>

<style>
    .app-items__loading{
        position: fixed;
        height: 100px;
        width: 100%;
        top: calc((100% - 200px) / 2);
    }

    .loading-overlay{
        z-index: 999999;
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: rgb(0,0,0, 0.45);
    }
</style>