function isUppercase(c) {
    return c >= 65 && c <= 90;
}

function isLowercase(c) {
    return c >= 97 && c <= 122;
}

export function vigenereEncrypt (str, key) {
    key = key.toLowerCase();
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (isUppercase(c)) {
            result += String.fromCharCode((c - 65 + key.charCodeAt(i % key.length) - 97) % 26 + 65);
        } else if (isLowercase(c)) {
            result += String.fromCharCode((c - 97 + key.charCodeAt(i % key.length) - 97) % 26 + 97);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}

export function vigenereDecrypt (str, key) {
    key = key.toLowerCase();
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (isUppercase(c)) {
            result += String.fromCharCode((c - 65 - key.charCodeAt(i % key.length) + 97 + 26) % 26 + 65);
        } else if (isLowercase(c)) {
            result += String.fromCharCode((c - 97 - key.charCodeAt(i % key.length) + 97 + 26) % 26 + 97);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}