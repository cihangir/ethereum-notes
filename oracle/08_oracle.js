var EthUtil = require("ethereumjs-util")
var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var solc = require("solc")
var fs = require("fs")

function getContract(name, cname, modifier) {

  var src = fs.readFileSync(__dirname + "/" + name.toLowerCase() + ".sol", 'utf8')
  if (modifier) {
    src = modifier(src)
  }

  var compiled = solc.compile(src)
  var ctr = compiled.contracts[":" + cname + ""]
  var abiRaw = ctr.interface
  var abi = JSON.parse(abiRaw)
  return {
    contract: web3.eth.contract(abi),
    bytecode: ctr.bytecode,
    data: contractData = {
      from: web3.eth.accounts[0],
      data: ctr.bytecode,
      gasPrice: 22000000000,
      gas: web3.eth.estimateGas({ data: ctr.bytecode })
    }
  }
}

var dispatch = getContract("dispatch", "TestOracleDispatch")

// first deploy dispatch
var deployedDispatch = dispatch.contract.new(dispatch.data, function (err, dispatchContract) {
  if (!dispatchContract.address) { return } // if the address is not available yet, cb will be called more than once.
  if (err) {
    console.log("dispatchContract err:", err);
    return
  }

  console.log('dispatchContract address: ' + dispatchContract.address)

  var lookup = getContract("Lookup", "TestOracleLookup")
  var deployedLookup = lookup.contract.new(lookup.data, function (err, lookupContract) {
    if (!lookupContract.address) { return } // if the address is not available yet, cb will be called more than once.
    if (err) {
      console.log("lookupContract err:", err);
      return
    }

    console.log('lookupContract address: ' + lookupContract.address)

    deployedLookup.setQueryAddress(dispatchContract.address, { from: web3.eth.accounts[0] }, function (err, resp) {
      if (err) {
        console.log("setQueryAddress err:", err);
        return
      }

      deployedLookup.setResponseAddress(web3.eth.accounts[0], { from: web3.eth.accounts[0] }, function (err, resp) {
        if (err) {
          console.log("setQueryAddress err:", err);
          return
        }

        console.log("resp from setResponseAddress", resp)

        var client = getContract("Client", "SampleClient", function (s) { return s.replace("0x0", lookupContract.address) })
        var deployedClient = client.contract.new(client.data, function (err, clientContract) {
          if (!clientContract.address) { return } // if the address is not available yet, cb will be called more than once.
          if (err) {
            console.log("clientContract err:", err);
            return
          }

          console.log('clientContract address: ' + clientContract.address)

          var f = function(){
            deployedClient.query.call(function (err, resp) {
              if (err) {
                console.log("deployedClient.query err:", err);
                return
              }
              console.log("resp", resp.valueOf())

            })
          }
          setInterval(f, 1000);
          
            setTimeout(function () {
              console.log('Blah blah blah blah extra-blah');
            }, 30000);
        })
      })
    })
  })
})