"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.validateAddress = exports.getExplorerLink = exports.getTransactionLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const iotex_antenna_1 = __importDefault(require("iotex-antenna"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("iotex-antenna/lib/account/utils");
exports.config = {
    coins: ['iotx'],
    isInternalTx: true,
};
const antenna = new iotex_antenna_1.default('https://api.mainnet.iotex.one:443');
const ten18 = new bignumber_js_1.default(10).pow(18);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten18));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten18));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const { address, privateKey } = antenna.iotx.accounts.create();
    return {
        address,
        privateKey,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    const { address } = antenna.iotx.accounts.privateKeyToAccount(privateKey);
    return address;
};
exports.importPrivateKey = importPrivateKey;
const getTransactionLink = (hash) => {
    return `https://iotexscout.io/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const getExplorerLink = (address) => {
    return `https://iotexscout.io/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const validateAddress = (address) => {
    return new RegExp('^(io)[0-9A-Za-z]{30,70}$').test(address);
};
exports.validateAddress = validateAddress;
const getStandingFee = () => {
    return 0.01;
};
exports.getStandingFee = getStandingFee;
const createInternalTx = async ({ addressFrom, addressTo, amount, privateKey, }) => {
    if (privateKey) {
        antenna.iotx.accounts.privateKeyToAccount(privateKey);
        return await antenna.iotx.sendTransfer({
            from: addressFrom,
            to: addressTo,
            value: (0, utils_1.toRau)(amount, 'iotx'),
            gasLimit: '100000',
            gasPrice: (0, utils_1.toRau)('1', 'Qev'),
        });
    }
    return null;
};
exports.createInternalTx = createInternalTx;
