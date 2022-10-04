import Vue from "vue";

export const ui_trans_bus = new Vue()

export const applyChangeNavigationStatus = () => {
    ui_trans_bus.$emit('change-navigation-status')
}

export const disableSideMenu = () => {
    ui_trans_bus.$emit('disable-navigation')
}

export const launchSideMenu = () => {
    ui_trans_bus.$emit('launch-navigation')
}

export const disableHeader = () => {
    ui_trans_bus.$emit('disable-header')
}

export const launchHeader = () => {
    ui_trans_bus.$emit('launch-header')
}

export const openInfoMessageBox = (...args) => new Promise( resolve => {
    ui_trans_bus.$emit('open-message', resolve, 'primary', ...args)
})

export const openErrorMessageBox = (...args) => new Promise( resolve => {
    ui_trans_bus.$emit('open-message', resolve, 'red', ...args)
})

export const openLoadingOverlay = () => {
    ui_trans_bus.$emit('open-loading-overlay');
};

export const closeLoadingOverlay = () => {
    ui_trans_bus.$emit('close-loading-overlay');
};

export const openSnackbar = (message, color) => {
    ui_trans_bus.$emit('open-snackbar', message, color);
};

export const openSuccessSnackbar = (message) => {
    openSnackbar(message, 'success');
}

export const openErrorSnackbar = (message) => {
    openSnackbar(message, 'error');
}