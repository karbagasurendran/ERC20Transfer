let key ={};

if(process.env.NODE_ENV === "production"){
    key={
        ETEHERSCANURL: "https://sepolia.etherscan.io/tx/",
        Tokens: ["0xb29804eD6AeBF4e9412F10294066f9299653eC58","0x4A908cc8a7d31F9263F64b31B6c1b16F8106733F","0xE99BFEe998e8963147C3664ddC54ADEb2d3fa0eA","0xFBf0B29f240E92895d318fb261e3bc34E6B5EC7e"],
        RPCURL: "https://sepolia.infura.io/v3/v2GrZHd-M_rqTPkjLDr58GFpU9PECw1L",
        NETWORKVERSION: 11155111,
        LIVEURL: "https://ethereum.publicnode.com",
        LIVECHAINID: 1,

    }
}else{
    key ={
        ETEHERSCANURL: "https://sepolia.etherscan.io/tx/",
        Tokens: ["0xb29804eD6AeBF4e9412F10294066f9299653eC58","0x4A908cc8a7d31F9263F64b31B6c1b16F8106733F","0xE99BFEe998e8963147C3664ddC54ADEb2d3fa0eA","0xFBf0B29f240E92895d318fb261e3bc34E6B5EC7e"],
        RPCURL: "https://sepolia.infura.io/v3/v2GrZHd-M_rqTPkjLDr58GFpU9PECw1L",
        NETWORKVERSION: 11155111,
        // LIVEURL: "https://mainnet.infura.io/v3/9RCMFDMCEDA1Y8M5FZP8I9V15HPQIH5TUX",
        LIVEURL: "https://ethereum.publicnode.com",
        LIVECHAINID: 1,
    }

}

export default key;