"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const aptos_1 = require("aptos");
exports.config = {
    coins: ['apt'],
    isInternalTx: true,
    isFeeApproximate: true,
};
const ten8 = new bignumber_js_1.default(10).pow(8);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten8));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten8));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const account = new aptos_1.AptosAccount();
    const { address, privateKeyHex: privateKey } = account.toPrivateKeyObject();
    if (address) {
        return {
            address,
            privateKey,
        };
    }
    return null;
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    const account = aptos_1.AptosAccount.fromAptosAccountObject({
        privateKeyHex: privateKey,
    });
    return account.address().hex();
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://explorer.aptoslabs.com/account/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.aptoslabs.com/txn/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^(0x)[0-9A-Za-z]{64}$').test(address);
};
exports.validateAddress = validateAddress;
const getStandingFee = () => {
    return 0.005;
};
exports.getStandingFee = getStandingFee;
const getAddressBalance = async (address, coinClient) => {
    try {
        const checkBalance = await coinClient.checkBalance(new aptos_1.AptosAccount(undefined, address));
        return Number(checkBalance);
    }
    catch (_a) {
        return 0;
    }
};
const createInternalTx = async (props) => {
    const { amount, privateKey, addressTo, addressFrom } = props;
    if (!privateKey) {
        return null;
    }
    const aptosClient = new aptos_1.AptosClient('https://fullnode.mainnet.aptoslabs.com');
    const coinClient = new aptos_1.CoinClient(aptosClient);
    const from = aptos_1.AptosAccount.fromAptosAccountObject({
        privateKeyHex: privateKey,
    });
    const to = new aptos_1.AptosAccount(undefined, addressTo);
    const checkBalance = await getAddressBalance(addressTo, coinClient);
    if (Number(checkBalance) === 0) {
        const rawTx = await aptosClient.generateTransaction(addressFrom, {
            function: '0x1::aptos_account::transfer',
            type_arguments: [],
            arguments: [addressTo, (0, exports.formatValue)(amount, 'to')],
        });
        const signTx = await aptosClient.signTransaction(from, rawTx);
        const { hash } = await aptosClient.submitTransaction(signTx);
        return hash;
    }
    else {
        return await coinClient.transfer(from, to, (0, exports.formatValue)(amount, 'to'), {
            gasUnitPrice: BigInt(100),
        });
    }
};
exports.createInternalTx = createInternalTx;
