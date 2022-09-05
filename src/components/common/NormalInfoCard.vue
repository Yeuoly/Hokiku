<template>
    <div class="normal-info-card">
        <div class="normal-info-card-top">
            <div class="normal-info-card-name">
                <v-icon>
                    mdi-account
                </v-icon>
                {{ title }}
            </div>
        </div>
        <div class="normal-info-card-value">
            {{ content }}
        </div>
    </div>
</template>

<script>
export default {
    props : {
        title : {
            type : String,
            default : '标题'
        },
        content : {
            type : String,
            default : '内容'
        },
    }
}
</script>

<style>

.normal-info-card {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 10px;
    background-color: rgba(0,174,236,.04);
    padding: 10px;
    box-sizing: border-box;
}

.normal-info-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.normal-info-card-name {
    display: flex;
    align-items: center;
}

.normal-info-card-name > v-icon {
    margin-right: 10px;
}

.normal-info-card-value {
    font-size: 20px;
    font-weight: 600;
    color: #00aeec;
}

</style>