Date.prototype.formatDate = function(format){
    let date = this;
    let res = '';
    format.split('').forEach( item => {
        if(item === 'Y'){
            res += date.getFullYear();
        }else if(item  === 'M'){
            res += (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        }else if(item  === 'D'){
            res += date.getDate();
        }else if(item  === 'h'){
            res += date.getHours();
        }else if(item  === 'm'){
            res += date.getMinutes();
        }else if(item  === 's'){
            res += date.getSeconds();
        }else{
            res += item;
        }
    });
    return res;
}

export const isTeacher = status => {
    return !!(status & ( 0x1 << 1 ))
}

export const isStudent = status => {
    return !!(status & ( 0x1 ))
}

export const isSA = status => {
    return !!(status & ( 0x1 << 3 ))
}

export const allowManageOrganization = status => {
    return !!(status & ( 0x1 << 5 ))
}

export const isHash = (hash, len) => {
    return new RegExp(`^[a-fA-F0-9]{${len}}$`).test(hash)
}

export const isFlagDynamic = flag => {
    return !!(flag & 1)
}

export const sleep = time => new Promise(resolve => {
    setTimeout(() => resolve(), time)
})

export const isAvaliableNameFormat = name => {
    return new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5\\.\u0800-\u4e00\\-]{6,16}$').test(name)
}

export const getMessageFromText = (type)=> {
    return ['系统'][type]
}