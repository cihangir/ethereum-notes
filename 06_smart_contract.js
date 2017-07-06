var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var solc = require("solc")

var src = `contract HelloWorld {
  function displayMessage() constant returns (string) {
    return "Hello from a smart contract";
  }
}`

var compiled = solc.compile(src)

//console.log(compiled.contracts[":HelloWorld"])
console.log("bytecode")
console.log(compiled.contracts[":HelloWorld"].bytecode)
console.log("\n\n")
// this is one to one mapping ^^ 

console.log("opcodes")
console.log(compiled.contracts[":HelloWorld"].opcodes)
console.log("\n\n")

var abiRaw = compiled.contracts[":HelloWorld"].interface
var abi = JSON.parse(abiRaw)
console.log("abiRaw")
console.log(abiRaw)
console.log("\n\n")
//return

var HelloWorldContract = web3.eth.contract(abi)

var contractData = {
    from: web3.eth.accounts[0],
    data: compiled.contracts[":HelloWorld"].bytecode,
    gasPrice: 21000000000,
    gas: '4700000' // ?? http://ethereum.github.io/browser-solidity/
}

var DeployedHelloWorldContract = HelloWorldContract.new(contractData, function (err, contract) {
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
    console.log("contract address:", DeployedHelloWorldContract.address)


    // when we have the deployed object we can call the functions on it.

    DeployedHelloWorldContract.displayMessage.call(function (err, resp) {
        console.log("err:", err);
        console.log("resp:", resp);
    })
})