pragma solidity ^ 0.4.0;

////////////////////////////////////////////////////////////////////////////////////////////////
// This is the API file to be included by a user of this oracle
////////////////////////////////////////////////////////////////////////////////////////////////

contract TiteOracle {
  function query(string param0) returns (uint256 id);
}

contract TiteOracleLookup {
  function getQueryAddress() constant returns (address);
  function getResponseAddress() constant returns (address);
}

contract usingTiteOracle {
  // address constant lookupContract = 0x747075562918A0Fc5A83eE121160E7a7157994fb;
  // just to bypass err while compiling, do not use address as constant
  // err message: Initial value for constant variable has to be compile-time constant. This will fail to compile ...

  function queryTiteOracle(string param0) internal returns (uint256 id) {
    TiteOracleLookup lookup = TiteOracleLookup(0x747075562918A0Fc5A83eE121160E7a7157994fb);
    TiteOracle oracle = TiteOracle(lookup.getQueryAddress());
    return oracle.query(param0);
  }

  modifier onlyFromTiteOracle {
    TiteOracleLookup lookup = TiteOracleLookup(0x747075562918A0Fc5A83eE121160E7a7157994fb);
    require(msg.sender == lookup.getResponseAddress());
    _;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

contract SampleClient is usingTiteOracle {
  uint256 public id;
  string public response;

  function __callback(uint256 _id, string param0) onlyFromTiteOracle external {
    id = _id;
    response = param0;
  }

  function query(string param0) {
    queryTiteOracle(param0);
  }
}
