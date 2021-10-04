import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";

import Web3 from "web3";
import Tether from "./truffle_abis/Tether.json";
import RWD from "./truffle_abis/RWD.json";
import DecentralBank from "./truffle_abis/DecentralBank.json";

function App() {
  const [account, setAccount] = React.useState();
  const [tether, setTether] = React.useState({});
  const [rwd, setRwd] = React.useState({});
  const [decentralBank, setDecentralBank] = React.useState({});
  const [tetherBalance, setTetherBalance] = React.useState(0);
  const [rwdBalance, setRwdBalance] = React.useState(0);
  const [stakingBalance, setStakingBalance] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadWeb3();
    loadBlockChainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("no ethereum browser detected checkout metamask!");
    }
  };

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    //load tether
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      setTether(tether);
      let tetherBalance = await tether.methods.balanceOf(accounts[0]).call();
      setTetherBalance(tetherBalance.toString());
    } else {
      window.alert("error tether contract not deployed no detected network!");
    }
    //load wrd
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      console.log(rwd);
      setRwd(rwd);
      let rwdBalance = await rwd.methods.balanceOf(accounts[0]).call();
      setRwdBalance(rwdBalance.toString());
    } else {
      window.alert("error rwd contract not deployed no detected network!");
    }

    //decentralbank wrd
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address,
      );
      setDecentralBank(decentralBank);
      let stakingBalance = await decentralBank.methods
        .stakingBalance(accounts[0])
        .call();
      setStakingBalance(stakingBalance.toString());
    } else {
      window.alert(
        "error decentralbank contract not deployed no detected network!",
      );
    }
    setLoading(false);
  };

  const [stakeInput, setStakeInput] = React.useState(0);

  async function stakeTokens(inputAmount) {
    if (!inputAmount) return;
    setLoading(true);
    const amount = window.web3.utils.toWei(inputAmount, "Ether");
    await tether.methods
      .approve(decentralBank._address, amount)
      .send({ from: account });
    await decentralBank.methods.depositTokens(amount).send({ from: account });
    loadBlockChainData();
    setLoading(false);
  }

  async function unStakeTokens() {
    setLoading(true);
    await decentralBank.methods.unstakeTokens().send({ from: account });
    loadBlockChainData();
    setLoading(false);
  }

  if (loading) return "loading";
  return (
    <div style={{ margin: "auto auto", width: "600px" }}>
      <h2>account</h2>
      {account}
      <hr />
      <h2>tetherBalance</h2>
      {window.web3.utils.fromWei(tetherBalance, "Ether")}
      <hr />
      <h2>rwdBalance</h2>
      {window.web3.utils.fromWei(rwdBalance, "Ether")}
      <hr />
      <h2>stakingBalance</h2>
      {window.web3.utils.fromWei(stakingBalance, "Ether")}
      <hr />
      <h2>stakeTokens</h2>
      <input onChange={e => setStakeInput(e.target.value)} value={stakeInput} />
      <button onClick={() => stakeTokens(stakeInput)}>stakeTokens</button>
      <hr />
      <h2>unStakeTokens</h2>
      <button onClick={() => unStakeTokens()}>unStakeTokens</button>
      <hr />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
