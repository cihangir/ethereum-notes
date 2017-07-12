pragma solidity ^ 0.4.0;

////////////////////////////////////////////////////////////////////////////////////////////////
// This is the API file to be included by a user of this oracle
////////////////////////////////////////////////////////////////////////////////////////////////

contract TiteOracle {
  function querySend(string _query) returns (uint256 id);
}

contract TiteOracleLookup {
  function getQueryAddress() constant returns (address);
  function getResponseAddress() constant returns (address);
}

contract usingTiteOracle {
  address constant lookupContract = 0x0;

  function queryTiteOracle(string query) internal returns (uint256 id) {
    TiteOracleLookup lookup = TiteOracleLookup(lookupContract);
    TiteOracle titeOracle = TiteOracle(lookup.getQueryAddress());
    return titeOracle.querySend(query);
  }

  modifier onlyFromTiteOracle {
    TiteOracleLookup lookup = TiteOracleLookup(lookupContract);
    require(msg.sender == lookup.getResponseAddress());
    _;
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

contract SampleClient is usingTiteOracle {
  string public response;

  function __titeOracleCallback(uint256 id, string _response) onlyFromTiteOracle external {
    response = _response;
  }

  function querySend(string q) {
    queryTiteOracle(q);
  }
}
