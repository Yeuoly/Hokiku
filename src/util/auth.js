export const setAuthToken = token => {
    localStorage.setItem('auth_token', JSON.stringify({
        token: token,
        time: parseInt(new Date().getTime() / 1000)
    }))
}

export const getAuthToken = () => {
    const token = localStorage.getItem('auth_token')
    if(!token) {
        return ''
    }
    try {
        const obj = JSON.parse(token)
        if (obj['time'] + 7 * 24 * 3600 < parseInt(new Date().getTime() / 1000)) {
            setAuthToken('')
            return ''
        } else {
            return obj['token']
        }
    } catch(e){
        return ''
    }
}