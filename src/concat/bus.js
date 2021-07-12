import Vue from "vue";

export const ui_trans_bus = new Vue()

export const applyChangeNavigationStatus = () => {
    ui_trans_bus.$emit('change-navigation-status')
}