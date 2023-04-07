import React, { useState } from "react";
import { useParams,useNavigate } from "react-router-dom"
import { Card, Button, Form,Spinner } from "react-bootstrap";
import Logo from "../assets/images/logo.svg"
import Web3 from "web3";
import config from "../config/config"
import { Transfer } from "../helper/web3-helper";
import { toast } from "react-toastify"
import {transfervalidation} from '../validation/transfer-validation'

const init = { address: "", amount: '' };
function TransferToken() {
    const { address } = useParams();
    const Navigate = useNavigate()
    const [Formdata, setFormdata] = useState(init)
    const [Formvalidation, setFormvalidation] = useState({})
    const [loading,setloading] = useState(false)
    const [hash,sethash] = useState()


    const back=(()=>{
        Navigate('/')
    })

    const Totransfer=(async()=>{
        try{
        let web3 = new Web3(window.ethereum)
        let {status,errors} = await transfervalidation(Formdata);
        if(!status){
            setFormvalidation(errors);
            return false;
        }
        setloading(true)
        let account = await web3.eth.getAccounts();
        setFormvalidation(errors)
        let {trnx,success,message} = await Transfer(Formdata,address,account[0]);
        if(success){
        setloading(false)
        sethash(trnx)
        toast.success("Token Transfer successfully!!!");
        }else{
            setloading(false);
            toast.warn(message);
        }
    }catch(err){
        console.log(err,"err");
        setloading(false);
        toast.warn("Error on transfer")
    }
    })

    const handlechange=((e)=>{
        let {id, value} = e.target;
        let transferdata = {...Formdata,...{[id]:value}}
        setFormdata(transferdata);
    })
    console.log(Formdata,"Formdata")
    return (
        <>
            <div class="card mx-auto">
                <div class="card-body">
                    <Card>
                        <div class="fullwidth_box">
                            <div><img src={Logo} alt="logo" /></div>
                            <div className="formclass">
                            <Form>
                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>Wallet address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter wallet address" onChange={handlechange} />
                                    {Formvalidation&&Formvalidation.address&&<Form.Text className="text-muted">{Formvalidation.address}</Form.Text>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="amount">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control type="text"  placeholder="Enter amount of tokens" onChange={handlechange} />
                                    {Formvalidation&&Formvalidation.amount&&<Form.Text className="text-muted">{Formvalidation.amount}</Form.Text>}
                                </Form.Group>
                                <Button variant="outline-danger" onClick={back} >
                                 Back 
                                </Button>{' '}
                                <Button variant="outline-warning" disabled={loading} onClick={Totransfer}>
                                {loading&&<Spinner animation="border" variant="success" size="sm" />} Transfer
                                </Button>
                            </Form>
                            </div>
                            <div style={{paddingTop:"34px"}}>
                            {hash&&<a href={`${config.ETEHERSCANURL}${hash}`} target="_blank" rel="noreferrer" >view on etherscan</a>}
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </>
    )
}

export default TransferToken;