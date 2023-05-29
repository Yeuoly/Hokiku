export const tools_pages = [{
    name : 'tools-routes',
    path : '/tools/routes',
    component : () => import('../views/tools/Routes.vue')
}, {
    name : 'tools-kurumi',
    path : '/tools/kurumi',
    component : () => import('../views/tools/Kurumi.vue')
}, {
    name : 'tools-baseserial',
    path : '/tools/baseserial',
    component : () => import('../views/tools/BaseSerial.vue')
}, {
    name : 'tools-hex',
    path : '/tools/hex',
    component : () => import('../views/tools/Hex.vue')
}, {
    name : 'tools-01',
    path : '/tools/01',
    component : () => import('../views/tools/01.vue')
}, {
    name : 'tools-time',
    path : '/tools/time',
    component : () => import('../views/tools/Timestamp.vue')
}, {
    name : 'tools-url',
    path : '/tools/url',
    component : () => import('../views/tools/Url.vue')
}, {
    name : 'tools-ascii',
    path : '/tools/ascii',
    component : () => import('../views/tools/Ascii.vue')
}, {
    name : 'tools-morse',
    path : '/tools/morse',
    component : () => import('../views/tools/Morse.vue')
}, {
    name : 'tools-vigenere',
    path : '/tools/vigenere',
    component : () => import('../views/tools/Vigenere.vue')
},{
    name : 'tools-metatoy',
    path : '/tools/metatoy',
    component : import('../views/tools/MetaToy.vue')
}, {
    name : 'tools-rot',
    path : '/tools/rot',
    component : () => import('../views/tools/Rot.vue')
}, {
    name : 'tools-affine',
    path : '/tools/affine',
    component : () => import('../views/tools/Affine.vue')
}, {
    name : 'tool-playfair',
    path : '/tools/playfair',
    component : () => import('../views/tools/PlayFair.vue')
}, {
    name : 'tools-aes',
    path : '/tools/aes',
    component : () => import('../views/tools/AES.vue')
}, {
    name : 'tools-des',
    path : '/tools/des',
    component : () => import('../views/tools/DES.vue')
}, {
    name : 'tools-rsa',
    path : '/tools/rsa',
    component : () => import('../views/tools/RSA.vue')
}, {
    name : 'tools-md5',
    path : '/tools/md5',
    component : () => import('../views/tools/MD5.vue')
}, {
    name : 'tools-sha1',
    path : '/tools/sha1',
    component : () => import('../views/tools/SHA1.vue')
}, {
    name : 'tools-sha256',
    path : '/tools/sha256',
    component : () => import('../views/tools/SHA256.vue')
}, {
    name : 'tools-sha512',
    path : '/tools/sha512',
    component : () => import('../views/tools/SHA512.vue')
}, {
    name : 'tools-sha384',
    path : '/tools/sha384',
    component : () => import('../views/tools/SHA384.vue')
}, {
    name : 'tools-rc4',
    path : '/tools/rc4',
    component : () => import('../views/tools/RC4.vue')
}, {
    name : 'tools-tripledes',
    path : '/tools/tripledes',
    component : () => import('../views/tools/TripleDES.vue')
}, {
    name : 'tools-crc32',
    path : '/tools/crc32',
    component : () => import('../views/tools/CRC32.vue')
}, {
    name : 'tools-hmac',
    path : '/tools/hmac',
    component : () => import('../views/tools/HMAC.vue')
}, {
    name : 'tools-md5file',
    path : '/tools/md5file',
    component : () => import('../views/tools/MD5File.vue')
} , {
    name : 'tools-sha1file',
    path : '/tools/sha1file',
    component : () => import('../views/tools/SHA1File.vue')
}, {
    name : 'tools-sha256file',
    path : '/tools/sha256file',
    component : () => import('../views/tools/SHA256File.vue')
}, {
    name : 'tools-convertcase',
    path : '/tools/convertcase',
    component : () => import('../views/tools/CaseSwitch.vue')
}, {
    path : '/tools/',
    redirect : '/tools/routes'
}]