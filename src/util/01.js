import { Utils } from './encoding'

export function bitencode(src, splitor) {
    src = Utils._utf8_encode(src);
    splitor = splitor || ' ';
    var bits = '';
    for (var i = 0; i < src.length; i++) {
        var c = src.charCodeAt(i);
        for (var j = 0; j < 8; j++) {
            bits += (c & (1 << (7 - j))) ? '1' : '0';
        }
        bits += splitor;
    }
    return bits;
}

export function bitdecode(src, splitor) {
    splitor = splitor || ' ';
    var bits = src.split(splitor);
    var str = '';
    for (var i = 0; i < bits.length; i++) {
        var c = 0;
        for (var j = 0; j < 8; j++) {
            c = (c << 1) + (bits[i][j] == '1' ? 1 : 0);
        }
        str += String.fromCharCode(c);
    }
    str = Utils._utf8_decode(str);
    return str;
}