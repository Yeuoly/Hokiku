function isUppercase(c) {
    return c >= 65 && c <= 90;
}

function isLowercase(c) {
    return c >= 97 && c <= 122;
}

function gcd(a, b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

function phi(n) {
    var result = 1;
    for (var i = 2; i < n; i++) {
        if (gcd(i, n) == 1) {
            result++;
        }
    }
    return result;
}

export function affineEncrypt (str, a, b) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (isUppercase(c)) {
            result += String.fromCharCode((a * (c - 65) + b) % 26 + 65);
        } else if (isLowercase(c)) {
            result += String.fromCharCode((a * (c - 97) + b) % 26 + 97);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}

function convert(a, b) {
    //use A^-1 = A^(phi(n)-1) (mod n)
    return Math.pow(a, phi(26) - 1) * b % 26;
}

export function affineDecrypt (str, a, b) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (isUppercase(c)) {
            result += String.fromCharCode((convert(a, 26) * (c - 65 - b) + 26) % 26 + 65);
        } else if (isLowercase(c)) {
            result += String.fromCharCode((convert(a, 26) * (c - 97 - b) + 26) % 26 + 97);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}