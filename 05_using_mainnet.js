var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")

var mainNetURL = "https://mainnet.infura.io/" + process.argv[2]
var web3 = new Web3(new Web3.providers.HttpProvider(mainNetURL))

acc1 = "0x571Bc3a874000A3bC27b352A665a50fdAAbc5ABE"

// display how many eth we have
var balanceOfFAcc1InEther = web3.fromWei(web3.eth.getBalance(acc1), "ether").toNumber()

console.log("acc1 comes with ", balanceOfFAcc1InEther, " ether")
