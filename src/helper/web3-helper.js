import Web3 from "web3";
import ERC20ABI from "../ABI/ERC20ABI.json";

const web3 = new Web3(window.ethereum);

export const BalanceOf=(async(address,tokenaddress)=>{
    let contract =new web3.eth.Contract(ERC20ABI,tokenaddress);
    let balanceOf = await contract.methods.balanceOf(address).call();
    let name = await contract.methods.name().call();
    let covert =await web3.utils.fromWei(balanceOf, 'ether');
    return {
        "balanceOf":covert,
        "name":name,
        "address": tokenaddress
    };
})

export const Transfer=(async(toaccount,tokenaddress,account)=>{
    try{
    let toaddress = toaccount.address;
    let toamount = toaccount.amount * 1e18;
    toamount = toamount.toString();
    let contract =new web3.eth.Contract(ERC20ABI,tokenaddress);
    let balance = await web3.eth.getBalance(account);
    let tokenbalance = await contract.methods.balanceOf(account).call();
    if(tokenbalance < toamount){
        return { success: false,message:"Low Token balance",trnx:""}
    }
    let Estimate = await contract.methods.transfer(toaddress,toamount).estimateGas({from: account})
    if(balance<=Estimate){
        return { success: false,message:"Low Eth balance",trnx:""}
    }
    let transaction = await contract.methods.transfer(toaddress,toamount).send({from: account});
    console.log(transaction,"transaction")
    return {
        success: true,
        message: "token transfer successfully!!!",
        "trnx":transaction.transactionHash,
    };
}catch(error){
    console.log(error.code,"transfererror")
    if(error.code === 4001){
        return {
            success: false, message: error.message, trnx: ""
        }
    }
    return {
        success: false, message: "Error on transfer", trnx: ""
    }
}
})