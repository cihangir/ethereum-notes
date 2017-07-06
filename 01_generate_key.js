// from crypto-js
// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var privateKeyToAddress = function (pKey) {
    var pKeyBytes = hexToBytes(pKey)
    var walletAddr = EthUtil.privateToAddress(pKeyBytes).toString('hex')
    return "0x" + walletAddr
}

var pass = process.argv[2]
var pKey = web3.sha3(pass)
var pKeyAddr = pKey.substr(2)

console.log("password\t", pass)
console.log("private key\t", pKey)
console.log("wallet\t\t", privateKeyToAddress(pKeyAddr))