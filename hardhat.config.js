require("@nomiclabs/hardhat-waffle");
const config= require("dotenv").config
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
// const fs = require('fs')
// const privateKey = fs.readFileSync(".secret").toString().trim();
config()
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  
  // hardhat:{
    defaultNetwork: "mumbai",
    networks: {
      hardhat: {},
      mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/v1/918562820c91d677ba40c589ca01caddb7665ec7",
      accounts: [process.env.privateKey],
    },
    
  },
  etherscan: {
    apiKey: "QN77FNYT4JBUJ56JB15G86HY55SBMBEJ6P",
 }
  // },
};