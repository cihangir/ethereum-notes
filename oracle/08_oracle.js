var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var solc = require('solc');
var fs = require('fs');
var abi = require('ethereumjs-abi')

function getContract(name, cname, modifier) {
  var src = fs.readFileSync(__dirname + '/' + name.toLowerCase() + '.sol', 'utf8')
  if (modifier) {
    src = modifier(src);
  }

  var compiled = solc.compile(src);
  if (!compiled.contracts) { throw new Error("compilation has errors", compiled); }

  var ctr = compiled.contracts[':' + cname];
  return {
    contract: web3.eth.contract(JSON.parse(ctr.interface)),
    bytecode: ctr.bytecode,
    data: {
      from: web3.eth.accounts[0],
      data: ctr.bytecode,
      gasPrice: 22000000000,
      gas: web3.eth.estimateGas({ data: ctr.bytecode })
    }
  }
}

var dispatch = getContract('dispatch', 'TiteOracleDispatch');

// first deploy dispatch
var deployedDispatch = dispatch.contract.new(dispatch.data, function (err, dispatchContract) {
  if (!dispatchContract.address) { return } // if the address is not available yet, cb will be called more than once.
  if (err) { throw new Error('dispatchContract err:', err); }

  console.log('dispatchContract address: ' + dispatchContract.address)

  var lookup = getContract('Lookup', 'TiteOracleLookup')
  var deployedLookup = lookup.contract.new(lookup.data, function (err, lookupContract) {
    if (!lookupContract.address) { return } // if the address is not available yet, cb will be called more than once.
    if (err) { throw new Error('lookupContract err:', err); }

    console.log('lookupContract address: ' + lookupContract.address)

    deployedLookup.setQueryAddress(dispatchContract.address, { from: web3.eth.accounts[0] }, function (err, resp) {
      if (err) { throw new Error('setQueryAddress err:', err); }

      deployedLookup.getQueryAddress({ from: web3.eth.accounts[0] }, function (err, resp) {
        if (err) { throw new Error('getQueryAddress err:', err); }
        if (resp != dispatchContract.address) {
          throw new Error("dispatchContract.address is not same with the gotten one", dispatchContract.address, resp)
        } else {
          throw new Error("dispatchContract.address is same with the gotten one")
        }
      })

      deployedLookup.setResponseAddress(web3.eth.accounts[0], { from: web3.eth.accounts[0] }, function (err, resp) {
        if (err) { throw new Error('setQueryAddress err:', err); }

        deployedLookup.getResponseAddress({ from: web3.eth.accounts[0] }, function (err, resp) {
          if (err) { throw new Error('getResponseAddress err:', err); }

          if (resp != web3.eth.accounts[0]) {
            throw new Error("web3.eth.accounts[0] is not same with the gotten one", web3.eth.accounts[0], resp)
          }
        })

        console.log('resp from setResponseAddress', resp)

        var client = getContract("Client", "SampleClient", function (s) { return s.replace("0x0", lookupContract.address) })
        var deployedClient = client.contract.new(client.data, function (err, clientContract) {
          if (!clientContract.address) { return } // if the address is not available yet, cb will be called more than once.
          if (err) { throw new Error('clientContract err:', err); }

          console.log('clientContract address: ' + clientContract.address)
          console.log("lookupContract.address", lookupContract.address)

          var count = 1
          var send = function () {
            deployedClient.querySend("hello world" + count, { from: web3.eth.accounts[0] }, function (err, resp) {
              if (err) { throw new Error('deployedClient.search err:', err); }
              count++
              deployedClient.response.call({ from: web3.eth.accounts[0] }, function (err, resp) {
                if (err) { throw new Error('deployedClient.getResponse err:', err); }
                console.log('getResponse', resp.valueOf())
              })
            })
          }


          var filter = web3.eth.filter({ fromBlock: 0, toBlock: 'latest', address: dispatchContract.address }, (function (err, event) {
            if (err) { throw new Error("web3.eth.filter err:", err); }
            var data = abi.rawDecode(['uint256', 'address', 'string'], new Buffer(event.data.replace("0x", ""), 'hex'));
            var uuid = data[0]
            var sender = "0x" + data[1].toString('hex')
            var request = data[2] // do something with the request.

            var a = abi.methodID('__titeOracleCallback', ['uint256', 'string']).toString('hex')
            var b = abi.rawEncode(['uint256', 'string'], [uuid, request]).toString('hex')

            var tx = {
              from: web3.eth.accounts[0],
              to: sender,
              data: a + b
            };

            web3.eth.sendTransaction(tx, function (err, txHash) {
              if (err) { throw new Error("sendTransaction err:", err); }
            })
          }));

          setInterval(send, 100);
          send();

          setTimeout(function () {
            console.log('Blah blah blah blah extra-blah');
            filter.stopWatching();
            process.exit(0)
          }, 30000);
        })
      })
    })
  })
})