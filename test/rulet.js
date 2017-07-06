var Rulet = artifacts.require("./Rulet.sol");

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider('http://localhost:8545');
var web3 = new Web3(provider);

Rulet.setProvider(provider);

contract('Rulet', function(accounts) {

  it("should send some coins to second acc", function() {

    var deployed;
    // Get initial balances of first and second account.
    var acc0 = accounts[0];
    var acc1 = accounts[1];
    var amount = 10
    var acc0Balance;
    var acc1Balance;
    var ruletBalance;
    
    return Rulet.deployed().then(function(result){
        console.log(result)
        deployed = result;
        console.log("sending 5 ether from acc1")
        deployed.contribute({ from: acc0, value: web3.toWei(5, 'ether') }, function (err, resp) {
        console.log("err:", err);
        console.log("resp:", resp);
        console.log("total balance of the contract:")
        var balance = web3.fromWei(web3.eth.getBalance(deployed.address), 'ether').toNumber()
        console.log(balance)
        console.log("\n\n")
            
        console.log("sending 5 ether from acc2")
        deployed.contribute({ from: acc0, value: web3.toWei(3, 'ether') }, function (err, resp) {
            console.log("err:", err);
            console.log("resp:", resp);
            console.log("total balance of the contract:")
            var balance = web3.fromWei(web3.eth.getBalance(deployed.address), 'ether').toNumber()
            console.log(balance)
            console.log("\n\n")
            
                
            // TODO: change this to acc1
            console.log("finishing the rulet from acc1")
            deployed.payout({ from: acc0}, function (err, resp) {
                console.log("err:", err);
                console.log("resp:", resp);
                console.log("total balance of the contract:")
                var balance = web3.fromWei(web3.eth.getBalance(deployed.address), 'ether').toNumber()
                console.log(balance)
                console.log("\n\n")
                
                console.log("total balance of acc1:")
                var balance = web3.fromWei(web3.eth.getBalance(acc0), 'ether').toNumber()
                console.log(balance)
                console.log("\n\n")
                
                console.log("total balance of acc2:")
                var balance = web3.fromWei(web3.eth.getBalance(acc1), 'ether').toNumber()
                console.log(balance)
                console.log("\n\n")
            })
        })
    })
    })
  });
});