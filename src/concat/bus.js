import Vue from "vue";

export const ui_trans_bus = new Vue()

export const applyChangeNavigationStatus = () => {
    ui_trans_bus.$emit('change-navigation-status')
}

export const openInfoMessageBox = (...args) => {
    ui_trans_bus.$emit('open-message', 'primary', ...args)
}

export const openErrorMessageBox = (...args) => {
    ui_trans_bus.$emit('open-message', 'red', ...args)
}