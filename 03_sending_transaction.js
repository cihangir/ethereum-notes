var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

acc1 = web3.eth.accounts[0]
acc2 = web3.eth.accounts[1]

// display how many eth we have
var balanceOfFAcc1InEther = web3.fromWei(web3.eth.getBalance(acc1), "ether").toNumber()
var balanceOfFAcc2InEther = web3.fromWei(web3.eth.getBalance(acc2), "ether").toNumber()

console.log("acc1 comes with ", balanceOfFAcc1InEther, " ether")
console.log("acc2 comes with ", balanceOfFAcc2InEther, " ether")


// send transaction from acc1 to acc2

var tx = {
    from: web3.eth.accounts[0],
    to: web3.eth.accounts[1],
    value: web3.toWei(1, "ether"), // try sending 1 ether
    gasLimit: 21000, // we know the gas limit from previous google doc
    gasPrice: 22000000000,
    data: "<>"
};

web3.eth.sendTransaction(tx, function (err, txHash) {
    console.log("err:", err);
    console.log("tx hash", txHash);

    //return
    // TODO: remove return 

    // get all the info of the tx
    web3.eth.getTransaction(txHash, function (err, txData) {
        console.log("err:", err);
        console.log("tx data", txData);

        //return
        // TODO: remove return

        web3.eth.getTransactionCount(acc1, function (err, txCount) {
            console.log("err:", err);
            console.log("tx count", txCount);
        })
    })
})