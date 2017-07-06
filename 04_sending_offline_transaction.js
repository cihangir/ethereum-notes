var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var EthUtil = require("ethereumjs-util")
var EthTx = require("ethereumjs-tx")


acc1 = web3.eth.accounts[0]
acc2 = web3.eth.accounts[1]


var nonceHex = web3.toHex(web3.eth.getTransactionCount(acc1));
var gasPriceHex = web3.toHex(20000000000)
var gasLimitHex = web3.toHex(21000)
var valueHex = web3.toHex(web3.toWei(10, "ether"))
var dataHex = web3.toHex("")

var rawTx = {
    from: acc1,
    to: acc2,
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    value: valueHex
    //  data: dataHex
}

console.log('eth.getBlock("pending").gasLimit', web3.eth.getBlock("pending").gasLimit)

// TODO: get the latest key from testrpc
var pKeyAcc1 = "8540e632c57bbd036c1ad97e7612446926e993da0dfec827872b1477e9c29d20"
var pKeyAcc1HexBuf = new Buffer(pKeyAcc1, "hex")

console.log("raw Tx:", rawTx)

var tx = new EthTx(rawTx)
tx.sign(pKeyAcc1HexBuf)


var txStr = tx.serialize().toString("hex")
var txStrHex = "0x" + txStr // watch for the "0x" 

console.log("if you send this transaction to eth network, tx will succeed")
console.log(txStrHex)


// TODO: remove return
//return

web3.eth.sendRawTransaction(txStrHex, function (err, txResp) {
    console.log("err:", err);
    console.log("tx resp", txResp);
})