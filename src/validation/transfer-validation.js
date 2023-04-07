import isEmpty from "is-empty";
import Web3 from "web3";


export const transfervalidation = async (data) => {
    let errors = {}, reqBody = data;
    var web3 = new Web3(window);

    if (isEmpty(reqBody.address)) {
        errors.address = "address Required";
    } else if (!(web3.utils.isAddress(reqBody.address))) {
        errors.address = "Invalid address";
    }
    if (isEmpty(reqBody.amount)) {
        errors.amount = "amount Required";
    }

    if (!isEmpty(errors)) {
        return {'status':false,'errors':errors}
    }else{
        return {'status':true,'errors':{}}
    }
  };