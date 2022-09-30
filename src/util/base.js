const Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var c2 = 0;
        var c3;
        var t = "";
        var n = 0;
        var r;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

export function base64encode(srcString){
    if (!srcString) {
        return '';
    }
    return Base64.encode(srcString);
}

export function base32encode(srcString) {
    if (!srcString) {
        return '';
    }

    let BASE32CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let index = 0;
    let digit = 0;
    let currByte;
    let nextByte;
    let retrunString = '';
    srcString = Base64._utf8_encode(srcString);

    for (let i = 0; i < srcString.length;) {
        currByte = (srcString.charCodeAt(i) >= 0) ? srcString.charCodeAt(i)
            : (srcString.charCodeAt(i) + 256);

        if (index > 3) {
            if ((i + 1) < srcString.length) {
                nextByte = (srcString.charCodeAt(i + 1) >= 0)
                    ? srcString.charCodeAt(i + 1)
                    : (srcString.charCodeAt(i + 1) + 256);
            } else {
                nextByte = 0;
            }

            digit = currByte & (0xFF >> index);
            index = (index + 5) % 8;
            digit <<= index;
            digit |= (nextByte >> (8 - index));
            i++;
        } else {
            digit = (currByte >> (8 - (index + 5))) & 0x1F;
            index = (index + 5) % 8;

            if (index == 0) {
                i++;
            }
        }

        retrunString = retrunString + BASE32CHAR.charAt(digit);
    }

    while((retrunString.length % 8) !== 0){
        retrunString += "=";
    }

    return retrunString;
}

export function base16encode(srcString) {
    if (!srcString) {
        return '';
    }
    let BASE16CHAR = "0123456789ABCDEF";
    let index = 0;
    let digit = 0;
    let currByte;
    let nextByte;
    let retrunString = '';
    srcString = Base64._utf8_encode(srcString);
    
    //Base16 instead of Base64
    for (let i = 0; i < srcString.length;) {
        currByte = (srcString.charCodeAt(i) >= 0) ? srcString.charCodeAt(i)
            : (srcString.charCodeAt(i) + 256);
        if (index > 1) {
            if ((i + 1) < srcString.length) {
                nextByte = (srcString.charCodeAt(i + 1) >= 0)
                    ? srcString.charCodeAt(i + 1)
                    : (srcString.charCodeAt(i + 1) + 256);
            } else {
                nextByte = 0;
            }

            digit = currByte & (0xFF >> index);
            index = (index + 4) % 8;
            digit <<= index;
            digit |= (nextByte >> (8 - index));
            i++;
        } else {
            digit = (currByte >> (8 - (index + 4))) & 0x0F;
            index = (index + 4) % 8;

            if (index == 0) {
                i++;
            }
        }

        retrunString = retrunString + BASE16CHAR.charAt(digit);
    }

    while((retrunString.length % 2) !== 0){
        retrunString += "0";
    }

    return retrunString;
}

export function base64decode(srcString){
    if (!srcString) {
        return '';
    }
    return Base64.decode(srcString);
}

export function base32decode(srcString) {
    if (!srcString) {
        return '';
    }

    let BASE32CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let index = 0;
    let lookup;
    let offset;
    let digit;
    let retrunString = '';

    for (let i = 0; i < srcString.length; i++) {
        lookup = srcString.charAt(i);

        if (lookup == '=') {
            break;
        }

        offset = BASE32CHAR.indexOf(lookup);

        if (offset < 0) {
            continue;
        }

        if (index <= 3) {
            index = (index + 5) % 8;

            if (index == 0) {
                retrunString += String.fromCharCode(digit | offset);
            } else {
                digit = offset << (8 - index);
            }
        } else {
            index = (index + 5) % 8;
            digit |= (offset >> index);

            retrunString += String.fromCharCode(digit);
            digit = (offset << (8 - index)) & 0xFF;
        }
    }

    return Base64._utf8_decode(retrunString);
}

export function base16decode(srcString) {
    if (!srcString) {
        return '';
    }

    let BASE16CHAR = "0123456789ABCDEF";
    let index = 0;
    let lookup;
    let offset;
    let digit;
    let retrunString = '';

    for (let i = 0; i < srcString.length; i++) {
        lookup = srcString.charAt(i);

        if (lookup == '=') {
            break;
        }

        offset = BASE16CHAR.indexOf(lookup);

        if (offset < 0) {
            continue;
        }

        if (index <= 1) {
            index = (index + 4) % 8;

            if (index == 0) {
                retrunString += String.fromCharCode(digit | offset);
            } else {
                digit = offset << (8 - index);
            }
        } else {
            index = (index + 4) % 8;
            digit |= (offset >> index);

            retrunString += String.fromCharCode(digit);
            digit = (offset << (8 - index)) & 0xFF;
        }
    }

    return Base64._utf8_decode(retrunString);
}