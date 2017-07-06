pragma solidity ^ 0.4.0;

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
}
