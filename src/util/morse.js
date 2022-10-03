const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': ' '
};

export function morseencode(src, splitor) {
    splitor = splitor || '/';
    var morse = '';
    for (var i = 0; i < src.length; i++) {
        var c = src.charAt(i);
        if (c) {
            morse += morseCode[c.toUpperCase()];
            morse += splitor;
        }
    }
    return morse;
}

export function morsedecode(src, splitor) {
    splitor = splitor || '/';
    var morse = src.toString();
    var str = '';
    var words = morse.split(splitor);
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (word) {
            str += Object.keys(morseCode).find(key => morseCode[key] === word);
        }
    }
    return str;
}
