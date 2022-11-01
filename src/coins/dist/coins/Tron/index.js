"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddress = exports.createInternalTx = exports.getStandingFee = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const tronweb_1 = __importDefault(require("tronweb"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const tronWeb = new tronweb_1.default({
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
});
const ten6 = new bignumber_js_1.default(10).pow(6);
exports.config = {
    coins: ['trx'],
    isInternalTx: true,
};
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten6));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten6));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    try {
        const account = await tronWeb.createAccount();
        return {
            privateKey: account.privateKey,
            address: account.address.base58,
        };
    }
    catch (_a) {
        return null;
    }
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    try {
        return tronWeb.address.fromPrivateKey(privateKey);
    }
    catch (_a) {
        return null;
    }
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://tronscan.org/#/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://tronscan.org/#/transaction/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const getStandingFee = (symbol, chain, tokenChain) => {
    if (tokenChain) {
        return 10;
    }
    return 1.1;
};
exports.getStandingFee = getStandingFee;
const createInternalTx = async ({ addressFrom, addressTo, amount, privateKey, tokenChain, contractAddress, }) => {
    const value = (0, exports.formatValue)(amount, 'to');
    let sendTrx = null;
    if (tokenChain && contractAddress) {
        try {
            const transactionObject = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(contractAddress), 'transfer(address,uint256)', {}, [
                { type: 'address', value: addressTo },
                { type: 'uint256', value: value },
            ], tronWeb.address.toHex(addressFrom));
            sendTrx = transactionObject.transaction;
        }
        catch (_a) {
            //
        }
    }
    else {
        sendTrx = await tronWeb.transactionBuilder.sendTrx(addressTo, value, addressFrom, 1);
    }
    if (sendTrx) {
        const signedtxn = await tronWeb.trx.sign(sendTrx, privateKey);
        const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
        if (receipt === null || receipt === void 0 ? void 0 : receipt.result) {
            return receipt.txid;
        }
    }
    return null;
};
exports.createInternalTx = createInternalTx;
const validateAddress = (address) => {
    try {
        return tronWeb.isAddress(address);
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
