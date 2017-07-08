pragma solidity ^ 0.4.0;

////////////////////////////////////////////////////////////////////////////////////////////////
// This is the API file to be included by a user of this oracle
////////////////////////////////////////////////////////////////////////////////////////////////

contract TestOracle {
  function query(bytes _query) returns (uint256 id);
}

contract TestOracleLookup {
  function getQueryAddress() constant returns (address);
  function getResponseAddress() constant returns (address);
}

contract usingTestOracle {
  address constant lookupContract = 0x0;

  function queryTestOracle(bytes query) internal returns (uint256 id) {
    TestOracleLookup lookup = TestOracleLookup(lookupContract);
    TestOracle testOracle = TestOracle(lookup.getQueryAddress());
    return testOracle.query(query);
  }

  modifier onlyFromTestOracle {
    TestOracleLookup lookup = TestOracleLookup(lookupContract);
    require (msg.sender == lookup.getResponseAddress());
    _;
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

contract SampleClient is usingTestOracle {
  bytes public response;

  function __testOracleCallback(uint256 id, bytes _response) onlyFromTestOracle external {
    response = _response;
  }

  function query() {
    string memory tmp = "hello world";
    query(bytes(tmp));
  }

  function query(bytes query) {
    queryTestOracle(query);
  }
}
