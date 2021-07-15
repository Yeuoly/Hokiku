import Vue from "vue";

export const ui_trans_bus = new Vue()

export const applyChangeNavigationStatus = () => {
    ui_trans_bus.$emit('change-navigation-status')
}

export const openInfoMessageBox = (...args) => new Promise( resolve => {
    ui_trans_bus.$emit('open-message', resolve, 'primary', ...args)
})

export const openErrorMessageBox = (...args) => new Promise( resolve => {
    ui_trans_bus.$emit('open-message', resolve, 'red', ...args)
})