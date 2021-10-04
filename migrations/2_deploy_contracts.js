const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function(deployer, network, accounts) {
  // deploy mock tether contract
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();

  await deployer.deploy(RWD);
  const rwd = await RWD.deployed();

  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  // transfer all rwd tokens to decentral bank
  await rwd.transfer(decentralBank.address, "1000000000000000000000000");

  // distribute 1000 tether tokens to investor
  await tether.transfer(accounts[1], "100000000000000000000");
};
