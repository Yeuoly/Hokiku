function isUppercase(c) {
    return c >= 65 && c <= 90;
}

function isLowercase(c) {
    return c >= 97 && c <= 122;
}

export function rot (str, n) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (isUppercase(c)) {
            result += String.fromCharCode((c - 65 + n) % 26 + 65);
        } else if (isLowercase(c)) {
            result += String.fromCharCode((c - 97 + n) % 26 + 97);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}