import React, { useState,useRef } from "react"
import Web3 from "web3";
import config from "../config/config"
import WalletConnectProvider from "@walletconnect/web3-provider";
import MetamaskLogo from "../assets/images/metamask-icon.png";
import WalletLogo from "../assets/images/walletconnect_icon.png"
import { toast } from "react-toastify"
import { useDispatch } from 'react-redux'
import { adduser, removeuser } from "../reducer-store/reducer";



function Wallet_Popup({ setwallet, wallet }) {
  const timerRef = useRef();
  const [provider, setprovider] = useState()
  const dispatch = useDispatch();

  const connectMetamask = (async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      const getaccounts = await web3.eth.requestAccounts();
      let chainid = await web3.eth.net.getId();
      console.log(chainid, config.NETWORKVERSION, "datatattagt")
      if (chainid === config.NETWORKVERSION) {
        toast.success("Wallet connected 🦊 ", 'wallet');
        let walletdata = { ...wallet, ...{ address: getaccounts[0], Isconnect: true } }
        setwallet(walletdata)
        localStorage.setItem('walltype', 'metamask');
        localStorage.setItem('account', getaccounts[0]);
        dispatch(adduser({
          address: getaccounts[0],
          Isconnected: true
        }))
        window.$('#exampleModal').modal('hide')
      } else {
        toast.error("Connect ETH Testnet", 'wallet');
        try {
          await web3.currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(parseInt(config.NETWORKVERSION)) }],
          });
          toast.success("Wallet connected 🦊 ", 'wallet');
          window.$('#exampleModal').modal('hide')
          localStorage.setItem('walltype', 'metamask');
          localStorage.setItem('account', getaccounts[0]);
          dispatch(adduser({
            address: getaccounts[0],
            Isconnected: true
          }))
        } catch (switchError) {
          try {
             await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0xaa36a7",
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                chainName: "Sepolia test network",
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "SepoliaETH",
                  decimals: 18
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"]
              }]
            });
          } catch (error){
            toast.error("Connect Sepolia Eth Testnet", 'wallet');
          }
          console.log("some error on switching", switchError);
        }
      }
    } else {

      toast.error("please add metamask Extension", 'wallet');
      window.open("https://metamask.io/download/","_blank")
      return;
    }
  })

  async function connectTrustwallet() {
    var web3 = new Web3(config.RPCURL);
    var provider1 = new WalletConnectProvider({
      rpc: {
        [config.LIVECHAINID]: config.LIVEURL
      },
      chainId: config.LIVECHAINID
    });
    setprovider(provider1)
    provider1.on("connect", () => {
      setTimeout(() => window.$('#exampleModal').modal('hide'), 600);
    });
    await provider1.enable();
    web3 = new Web3(provider1);
    let chainid = await web3.eth.net.getId()
    if (chainid === 1) {
      var getaccounts = await web3.eth.getAccounts();
      localStorage.setItem('walltype', "trust");
      localStorage.setItem('account', getaccounts[0]);
      let walletdata = { ...wallet, ...{ address: getaccounts[0], Isconnect: true } }
      setwallet(walletdata)
      dispatch(adduser({
        address: getaccounts[0],
        provider: provider1,
        Isconnected: true
      }))
      toast.success("Wallet connected 🛡", 'wallet');
    } else {
      toast.error("Connect ETH network", 'wallet');
      return false;
    }
  }
  if (provider && wallet.Isconnect) {
    provider.on("disconnect", (reason) => {
      if (wallet.Isconnect) {
        localStorage.removeItem('walltype');
        localStorage.removeItem('account');
        dispatch(removeuser())
        toast.warn("wallet disconnected", 'wallet');
      }
      let walletdata = { ...wallet, ...{ address: "", Isconnect: false } }
      setwallet(walletdata)
    });

    provider.on("accountsChanged", (accounts) => {
      dispatch(adduser({
        address: accounts[0],
        Isconnected: true
      }))
    });

    provider.on("chainChanged", (chainId) => {
      console.log(chainId);
      connectMetamask()
    });
  }



  window.addEventListener("load", (event) => {
    event.preventDefault();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
        let walletdata = { ...wallet, ...{ address: accounts[0], Isconnect: true } }
        setwallet(walletdata)
        dispatch(adduser({
          address: accounts[0],
          Isconnected: true
        }))
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          connectMetamask();
        }, 1000);
      });

      window.ethereum.on("networkChanged", async function (networkId) {
        if (networkId !== config.NETWORKVERSION) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // chainId must be in hexadecimal numbers
          });
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            connectMetamask();
          }, 1000);
        } 
      });
    }
  });


  return (
    <div class="modal fade primary_modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Connect Wallet</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ul className="connectwallet_list">
              <li onClick={connectMetamask} >
                <img src={MetamaskLogo} alt="logo" width="40px" className="img-fluid" />
                <span>Metamask</span>
              </li>
              <li onClick={connectTrustwallet}>
                <img src={WalletLogo} alt="logo" width="40px" className="img-fluid" />
                <span>Wallet Connect</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Wallet_Popup;