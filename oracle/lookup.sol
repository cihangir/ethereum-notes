pragma solidity ^ 0.4.0;

//
// This is where the magic happens
//
// This contract will receive the actual query from the caller
// contract. Assign a unique (well, sort of) identifier to each
// incoming request, and emit an event our RPC client is listening
// for.
//
//
// The lookup contract for storing both the query and responder addresses
//

contract TestOracleLookup {
  address owner;
  address query;
  address response;

  function TestOracleLookup() {
    owner = msg.sender;
  }

  function getQueryAddress() constant returns (address) {
    return query;
  }

  function getResponseAddress() constant returns (address) {
    return response;
  }

  function setQueryAddress(address addr) owneronly {
    query = addr;
  }

  function setResponseAddress(address addr) owneronly {
    response = addr;
  }

  modifier owneronly { 
    require(msg.sender == owner);
    _;
  }
}
