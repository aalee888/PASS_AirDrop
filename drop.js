require('dotenv').config()
const fs = require('fs');
const Web3 = require('web3');

var web3 = new Web3(process.env.WEB3_PROVIDER);
var contractAbi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
var contractAddress = process.env.CONTRACT;
var sender = process.env.SENDER;
var private = process.env.PRIVATEKEY
var amountInDecimal = 1

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


async function main() {
    let rawdata = fs.readFileSync('grant2679_round11_test.json');
    let droplist = JSON.parse(rawdata);
    droplist = droplist.addresses;
    for (var key in droplist) {
        let count = await web3.eth.getTransactionCount(sender)
        let gasprice = await web3.eth.getGasPrice()
        let receiver = droplist[key][0]
        const token = new web3.eth.Contract(contractAbi, contractAddress);
        var privateKey = new Buffer(private, 'hex')
        let txObject = {
            from: sender,
            nonce: "0x" + count.toString(16),
            to: contractAddress,
            gas: 100000,
            value:"0x0",
            data:token.methods.transfer(receiver, 
            web3.utils.toHex(web3.utils.toWei(amountInDecimal.toString(), "ether"))).encodeABI(),
            gasPrice:gasprice
          }
        console.log(txObject)
        web3.eth.accounts.signTransaction(txObject, private, (err, res) => {
            if (err) {
              console.log('err',err)
            }
            else {
              console.log('res', res)
            }
            const raw = res.rawTransaction
            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
              if (err) {
                console.log(err)
              }
              else {
                console.log("txHash:", txHash)
              }
            })
          })
        sleep(5000);
    }
}

main();
