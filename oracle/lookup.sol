pragma solidity ^ 0.4.0;

//
// The lookup contract for storing both the query and responder addresses
//

contract TiteOracleLookup {
  address owner;
  address query;
  address response;

  function TiteOracleLookup() {
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
