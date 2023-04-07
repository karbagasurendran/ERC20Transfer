import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Card } from "react-bootstrap";
import Walletpopup from "../Model/Wallet-popup";
import Logo from "../assets/images/logo.svg"
import DAILogo from "../assets/images/Dai.png"
import TayLogo from "../assets/images/techalchemy.png"
import PancakeLogo from "../assets/images/pancake.png"
import AaveLogo from "../assets/images/aave.png"
import config from "../config/config"
import { BalanceOf } from "../helper/web3-helper"
import { useSelector, useDispatch } from 'react-redux'
import {  removeuser } from "../reducer-store/reducer";


import { toast } from "react-toastify"

const init = { address: "", Isconnect: false };
var inittoken = { Techalchemy: '', Dai: '', Pancake: '', Aave: '' }
function Home() {
    const [wallet, setwallet] = useState(init)
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const [Erc20tokens, setErc20tokens] = useState(inittoken)
    const user = useSelector((state) => state.user);

    const getdetails = (async () => {

        for (let token of config.Tokens) {
            let { name, address, balanceOf } = await BalanceOf(user.address, token)
            console.log(name,address, "sdfsdfsdfs");
            var tokendata = { ...inittoken, ...{ [name]: balanceOf } }
            inittoken = tokendata;
        }
        setErc20tokens(inittoken);
    })
    useEffect(() => {
        if (user &&user.Isconnected) {
            getdetails();
        }
    }, [user.address])

    const handlenavigate = ((data) => {
        Navigate(`/transfer/${data}`)
    })

    const handledisconnect = (() => {
        console.log(user.provider);
        if (localStorage.removeItem('walltype') === "metamask") {
            localStorage.removeItem('walltype');
            localStorage.removeItem('account');
            dispatch(removeuser())
            toast.warn("wallet disconnected", 'wallet');
        } else {
            if (user && user.provider) {
                user.provider.on("disconnect", () => {
                })
            }
            localStorage.removeItem("walletconnect");
            localStorage.removeItem('walltype');
            localStorage.removeItem('account');
            dispatch(removeuser())
            toast.warn("wallet disconnected", 'wallet');

        }
    })
    console.log(inittoken, "user redux")
    return (
        <>
            <Walletpopup setwallet={setwallet} wallet={wallet} />
            <div class="card mx-auto">
                <div class="card-body">
                    <Card>

                        <div class="fullwidth_box">
                            <div><img src={Logo} alt="logo" /></div>
                            {user && user.Isconnected&&<button onClick={handledisconnect}>disconnect</button>}
                            <div class="fullwidth_box"><h1>Connect your wallet to transfer the tokens</h1><p>To Transfer the your ERC20 token to any crypto wallet.</p>
                                {user && !user.Isconnected ? <button class="primary_btn" data-toggle="modal" data-target="#exampleModal">Connect Wallet</button> : <><button class="primary_btn" disabled>{user.address}</button></>}
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
            {user && user.Isconnected && <>
                <div class="cards">
                    <div class="outer">
                        <div class="card" style={{ "--delay": "-1" }}>
                            <div class="content">
                                <div class="img"><img src={TayLogo} alt='logo'/></div>
                                <div class="details">
                                    <span class="name">TechAlchemy</span>
                                    <p>Balance: {Erc20tokens && Erc20tokens.Techalchemy ? Erc20tokens.Techalchemy : 0}</p>
                                </div>
                            </div>
                            <button onClick={() => handlenavigate(config.Tokens[0])}>Transfer</button>
                        </div>
                        <div class="card" style={{ "--delay": "0" }}>
                            <div class="content">
                                <div class="img"><img src={DAILogo} alt="" /></div>
                                <div class="details">
                                    <span class="name">DAI</span>
                                    <p>Balance: {Erc20tokens && Erc20tokens.Dai ? Erc20tokens.Dai : 0}</p>
                                </div>
                            </div>
                            <button onClick={() => handlenavigate(config.Tokens[1])}>Transfer</button>
                        </div>
                        <div class="card" style={{ "--delay": "1" }}>
                            <div class="content">
                                <div class="img"><img src={PancakeLogo} alt="" /></div>
                                <div class="details">
                                    <span class="name">Cake</span>
                                    <p>Balance: {Erc20tokens && Erc20tokens.Pancake ? Erc20tokens.Pancake : 0}</p>

                                </div>
                            </div>
                            <button onClick={() => handlenavigate(config.Tokens[2])}>Transfer</button>
                        </div>
                        <div class="card" style={{ "--delay": "3" }}>
                            <div class="content">
                                <div class="img"><img src={AaveLogo} alt="" /></div>
                                <div class="details">
                                    <span class="name">AAVE</span>
                                    <p>Balance: {Erc20tokens && Erc20tokens.Aave ? Erc20tokens.Aave : 0}</p>
                                </div>
                            </div>
                            <button onClick={() => handlenavigate(config.Tokens[3])}>Transfer</button>
                        </div>
                    </div>
                </div></>}
        </>
    )
}

export default Home;