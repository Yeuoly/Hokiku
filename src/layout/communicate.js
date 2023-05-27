import Vue from 'vue'

import {
    ui_trans_bus
} from '../concat/bus'

let global_style_info = {
    width : document.body.clientWidth,
    sider_width : parseInt(document.body.clientWidth * 0),
    header_width : parseInt(document.body.clientWidth * 1),
    scope : false,
    ratio : 0
}

export const eventBus = new Vue();

function refreshStyle() {
    global_style_info.width = document.body.clientWidth;
    global_style_info.sider_width = parseInt(document.body.clientWidth * global_style_info.ratio);
    global_style_info.header_width = parseInt(document.body.clientWidth * (1 - global_style_info.ratio));
    eventBus.$emit('resize::sider', global_style_info.sider_width);
    eventBus.$emit('resize::header', global_style_info.header_width);
}

ui_trans_bus.$on('change-navigation-status', () => {
    if (global_style_info.scope) {
        global_style_info.ratio = 0;
    } else {
        global_style_info.ratio = 0.2;
    }
    global_style_info.scope = !global_style_info.scope;
    refreshStyle();
})

window.addEventListener('resize', () => {
    refreshStyle();
})

export const getSiderWidth = () => {
    return global_style_info.sider_width;
}

export const getHeaderWidth = () => {
    return global_style_info.header_width;
}