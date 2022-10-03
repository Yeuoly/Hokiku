import { Utils } from "./encoding";

export function hexencode(src) {
    src = Utils._utf8_encode(src);
    var hex = '';
    for (var i = 0; i < src.length; i++) {
        var c = src.charCodeAt(i);
        hex += c.toString(16);
    }
    return hex;
}

export function hexdecode(src) {
    var hex = src.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    } 
    str = Utils._utf8_decode(str);
    return str
}