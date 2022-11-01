"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.validateAddress = exports.getNetworkFee = exports.getTransactionLink = exports.getExplorerLink = exports.formatValueString = exports.formatValue = exports.importPrivateKey = exports.generateAddress = exports.config = void 0;
const xdc3_1 = __importDefault(require("xdc3"));
const xdc3 = new xdc3_1.default();
const chainId = 50;
const provider = new xdc3_1.default(new xdc3_1.default.providers.HttpProvider('https://rpc.xinfin.network'));
exports.config = {
    coins: ['xdc'],
    isInternalTx: true,
};
const generateAddress = async () => {
    const wallet = xdc3.eth.accounts.create();
    return {
        privateKey: wallet.privateKey,
        address: wallet.address,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    return xdc3.eth.accounts.privateKeyToAccount(privateKey).address;
};
exports.importPrivateKey = importPrivateKey;
const formatValue = (value, type) => {
    if (type === 'from') {
        return +xdc3.utils.fromWei(`${value}`, 'ether');
    }
    return +xdc3.utils.toWei(`${value}`, 'ether');
};
exports.formatValue = formatValue;
const formatValueString = (value, type) => {
    if (type === 'from') {
        return xdc3.utils.fromWei(`${value}`, 'ether');
    }
    return xdc3.utils.toWei(`${value}`, 'ether');
};
exports.formatValueString = formatValueString;
const getExplorerLink = (address) => {
    return `https://explorer.xinfin.network/addr/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.xinfin.network/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const getNetworkFee = async () => {
    try {
        const gasPrice = await provider.eth.getGasPrice();
        const fee = Number(gasPrice) * 21000;
        return {
            networkFee: (0, exports.formatValue)(fee, 'from'),
        };
    }
    catch (_a) {
        return null;
    }
};
exports.getNetworkFee = getNetworkFee;
const validateAddress = (address) => {
    return xdc3.utils.isAddress(address);
};
exports.validateAddress = validateAddress;
const createInternalTx = async ({ addressFrom, addressTo, amount, privateKey, }) => {
    if (!privateKey) {
        return null;
    }
    const nonce = await provider.eth.getTransactionCount(addressFrom);
    const gasPrice = await provider.eth.getGasPrice();
    const { rawTransaction } = await xdc3.eth.accounts.signTransaction({
        to: addressTo,
        value: (0, exports.formatValueString)(amount, 'to'),
        gas: 21000,
        chainId,
        gasPrice,
        nonce,
    }, privateKey);
    if (rawTransaction) {
        const sendSignedTransaction = await provider.eth.sendSignedTransaction(rawTransaction);
        if (sendSignedTransaction) {
            return sendSignedTransaction.transactionHash;
        }
    }
    return null;
};
exports.createInternalTx = createInternalTx;
