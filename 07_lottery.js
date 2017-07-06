var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var solc = require("solc")

var src = `pragma solidity ^ 0.4.0;

contract Rulet {

  address public dealer;

  mapping(address => uint256) players;
  address[] playerAddresses;

  function Rulet() {
    dealer = msg.sender;
  }

  function getPlayerAddress(uint _index) constant returns (address) {
    return playerAddresses[_index];
  }

  function playerAddressLength() constant returns (uint) {
    return playerAddresses.length;
  }

  function contribute() payable {
    if (players[msg.sender] == 0) playerAddresses.push(msg.sender);
    players[msg.sender] += msg.value;
  }

  modifier dealerOnly {
    if (msg.sender == dealer) {
      _;
    } else {
      throw;
    }
  }

  function payout() dealerOnly {
    uint seed = playerAddressLength();
    uint limit = playerAddressLength();

    uint rand = uint(sha3(block.blockhash(block.number - 1), seed)) % limit;

    address winner = getPlayerAddress(rand);
    winner.transfer(this.balance);
  }
}`

var compiled = solc.compile(src)

//console.log(compiled.contracts[":Rulet"])
console.log("bytecode")
console.log(compiled.contracts[":Rulet"].bytecode)
console.log("\n\n")
// this is one to one mapping ^^ 

console.log("opcodes")
console.log(compiled.contracts[":Rulet"].opcodes)
console.log("\n\n")

var abiRaw = compiled.contracts[":Rulet"].interface
var abi = JSON.parse(abiRaw)
console.log("abiRaw")
console.log(abiRaw)
console.log("\n\n")


var contract = web3.eth.contract(abi)

var contractData = {
    from: web3.eth.accounts[0],
    data: compiled.contracts[":Rulet"].bytecode,
    gasPrice: 22000000000,
    gas: '4700000' // ?? http://ethereum.github.io/browser-solidity/
}

var deployed = contract.new(contractData, function (err, contract) {
    if (!contract.address) { return } // if the address is not available yet, cb will be called more than once.

    console.log("err:", err);
    // console.log("contract", contract);

    console.log('Contract address: ' + contract.address)
    console.log('transactionHash: ' + contract.transactionHash)

    // TODO: remove return
    // return

    // we can get the contract tx like every other transaction
    // web3.eth.getTransaction(contract.transactionHash, function (err, txData) {
    //    console.log("err:", err);
    //    console.log("txData.hash", txData);
    // })

    // we can get the address later from the deployed contract
    // console.log("contract address:", deployed.address)


    // when we have the deployed object we can call the functions on it.

    console.log("sending 5 ether from acc1")
    deployed.contribute({ from: web3.eth.accounts[0], value: web3.toWei(5, 'ether') }, function (err, resp) {
        console.log("err:", err);
        console.log("resp:", resp);
        console.log("total balance of the contract:")
        var balance = web3.fromWei(web3.eth.getBalance(contract.address), 'ether').toNumber()
        console.log(balance)
        console.log("\n\n")

        console.log("sending 3 ether from acc2")
        deployed.contribute({ from: web3.eth.accounts[1], value: web3.toWei(3, 'ether') }, function (err, resp) {
            console.log("err:", err);
            console.log("resp:", resp);
            console.log("total balance of the contract:")

            var balance = web3.fromWei(web3.eth.getBalance(contract.address), 'ether').toNumber()
            console.log(balance)
            console.log("\n\n")


            // TODO: change this to acc1
            console.log("finishing the rulet from acc1")
            deployed.payout({ from: web3.eth.accounts[0] }, function (err, resp) {
                console.log("err:", err);
                console.log("resp:", resp);
                console.log("total balance of the contract:")
                var balance = web3.fromWei(web3.eth.getBalance(contract.address), 'ether').toNumber()
                console.log(balance)
                console.log("\n\n")

                console.log("total balance of acc1:")
                var balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), 'ether').toNumber()
                console.log(balance)
                console.log("\n\n")

                console.log("total balance of acc2:")
                var balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), 'ether').toNumber()
                console.log(balance)
                console.log("\n\n")
            })
        })
    })
})