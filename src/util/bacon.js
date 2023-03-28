export function baconEncrypt(str) {
    var baconMap = {
        'a': 'AAAAA', 'b': 'AAAAB', 'c': 'AAABA', 'd': 'AAABB', 'e': 'AABAA', 'f': 'AABAB', 'g': 'AABBA', 'h': 'AABBB',
        'i': 'ABAAA', 'j': 'ABAAB', 'k': 'ABABA', 'l': 'ABABB', 'm': 'ABBAA', 'n': 'ABBAB', 'o': 'ABBBA', 'p': 'ABBBB',
        'q': 'BAAAA', 'r': 'BAAAB', 's': 'BAABA', 't': 'BAABB', 'u': 'BABAA', 'v': 'BABAB', 'w': 'BABBA', 'x': 'BABBB',
        'y': 'BBAAA', 'z': 'BBAAB'
    };
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (isUppercase(c)) {
            result += baconMap[c.toLowerCase()];
        } else if (isLowercase(c)) {
            result += baconMap[c];
        } else {
            result += c;
        }
    }
    return result;
}

export function baconDecrypt(str) {
    var baconMap = {
        'AAAAA': 'a', 'AAAAB': 'b', 'AAABA': 'c', 'AAABB': 'd', 'AABAA': 'e', 'AABAB': 'f', 'AABBA': 'g', 'AABBB': 'h',
        'ABAAA': 'i', 'ABAAB': 'j', 'ABABA': 'k', 'ABABB': 'l', 'ABBAA': 'm', 'ABBAB': 'n', 'ABBBA': 'o', 'ABBBB': 'p',
        'BAAAA': 'q', 'BAAAB': 'r', 'BAABA': 's', 'BAABB': 't', 'BABAA': 'u', 'BABAB': 'v', 'BABBA': 'w', 'BABBB': 'x',
        'BBAAA': 'y', 'BBAAB': 'z'
    };
    var result = '';
    for (var i = 0; i < str.length; i += 5) {
        var group = str.substr(i, 5);
        if (baconMap.hasOwnProperty(group)) {
            result += baconMap[group];
        } else {
            result += group;
        }
    }
    return result;
}