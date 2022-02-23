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

let XSS = require('xss');
const XSSFilterXSS = new XSS.FilterXSS({
    css : {
        whiteList : {
            'color' : true,
            'background-color': true,
            'top' : true,
            'left' : true,
            'text-decoration-line' : true,
            'font-family' : true,
            'font-size' : true,
            'font-weight' : true,
            'border-collapse' : true,
            'width' : true,
            'height' : true,
            'border' : true,
            'position' : true,
            'overflow' : true,
            'clip' : true,
            'padding-left' : true,
            'padding-right' : true,
            'padding-top' : true,
            'padding-bottom' : true,
            'padding' : true,
            'background-image' : true,
            'background' : true,
            'margin' : true,
            'margin-left' : true,
            'margin-right' : true,
            'margin-top' : true,
            'margin-bottom' : true,
            'max-width' : true
        }
    },
    whiteList : {
        p : ['style','class'],
        h1 : ['style','class'],
        h2 : ['style','class'],
        h3 : ['style','class'],
        h4 : ['style','class'],
        h5 : ['style','class'],
        h6 : ['style','class'],
        span : ['style','class'],
        br : [],
        img : ['src','class','preview', 'style', 'contenteditable', 'width'],
        a : ['href','target'],
        sup : ['class'],
        ol : ['class'],
        li : ['class'],
        ul : ['class'],
        blockquote : ['class'],
        em : ['class'],
        s : ['class'],
        u : ['class'],
        strong : ['class'],
        pre : ['class','spellcheck'],
        font : ['class','size'],
        table : ['border','width','cellpadding','cellspacing','style'],
        tbody : [],
        tr : ['height'],
        th : [],
        td : ['class','width','colspan','rowspan','height'],
        div : ['style','class'],
        colgroup : [],
        col : ['width','span'],
        code : [],
        pmicrosoft : [],
        spanmicrosoft : [],
        latexpression : ['size'],
        blogpreview : ['pid'],
        b : [],
        small : [],
        big : [],
        mark : [],
        hr : []
    }
});

export const xssFilter = html => XSSFilterXSS.process(html)

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

export const isOrganizationManager = flag => !!(flag & 2)