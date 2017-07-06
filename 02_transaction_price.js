var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))


var txGasAmount = 21000

var gwei = process.argv[2]
var wei = web3.toWei(gwei, "gwei")
var txGasPrice = txGasAmount * wei
var txCostInEth = web3.fromWei(txGasPrice, "ether")
var txCostInGwei = web3.fromWei(txGasPrice, "gwei")

console.log("current gas price(in gwei):\t\t", gwei)
console.log("current gas price(in wei):\t\t", wei)
console.log("transaction gas amount(in wei):\t\t", txGasAmount)
console.log("sending a transaction costs(in eth):\t", txCostInEth)