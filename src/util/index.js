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