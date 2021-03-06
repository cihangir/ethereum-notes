//
// This is where the magic happens
//
// This contract will receive the actual query from the caller
// contract. Assign a unique (well, sort of) identifier to each
// incoming request, and emit an event our RPC client is listening
// for.
//
pragma solidity ^ 0.4.0;

contract TiteOracleDispatch {
  address owner;

  event Incoming(uint256 id, address recipient, string param0);

  // constructor
  function TiteOracleDispatch() {
    owner = msg.sender;
  }

  // provided oracle function
  function query(string param0) external returns (uint256 id) {
    id = uint256(sha3(block.number, now, param0, msg.sender));
    Incoming(id, msg.sender, param0);
  }
}