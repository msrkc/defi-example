pragma solidity ^0.5.0;

contract Tether {
  string public name = "Mock Tether";
  string public symbol = 'mUSDT';
  uint256 public totalSupply = 1000000000000000000000000;
  uint8 public decimals = 18;

  event Transfer(address indexed _from, address indexed _to, uint _value);
  event Approval(address indexed _owner, address indexed _spender, uint _value);

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowence;

  constructor() public {
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    // require that the value is grater or equal for transfer
    require(balanceOf[msg.sender] >= _value);
    // transfer the amount and subtract the balance
    balanceOf[msg.sender] -= _value;
    // add the balance
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success){
    allowence[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    require(_value <= balanceOf[_from]);
    require(_value <= allowence[_from][msg.sender]);
    // add the balance
    balanceOf[_to] += _value;
    // subtract the balance for transferFrom
    balanceOf[_from] -= _value;
    allowence[msg.sender][_from] -= _value;

    emit Transfer(_from, _to, _value);
    return true;
  }
}