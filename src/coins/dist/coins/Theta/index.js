"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkFee = exports.validateAddress = exports.createInternalTx = exports.getExplorerLink = exports.getTransactionLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const thetajs = __importStar(require("@thetalabs/theta-js"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const api_1 = require("../../utils/api");
exports.config = {
    coins: ['theta', 'tfuel'],
    isInternalTx: true,
};
const ten18 = new bignumber_js_1.default(10).pow(18);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten18));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten18));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    try {
        const wallet = thetajs.Wallet.createRandom();
        return {
            address: wallet.address,
            privateKey: wallet._signingKey().privateKey,
        };
    }
    catch (_a) {
        return null;
    }
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    try {
        const wallet = new thetajs.Wallet(privateKey);
        return wallet.address;
    }
    catch (_a) {
        return null;
    }
};
exports.importPrivateKey = importPrivateKey;
const getTransactionLink = (hash) => {
    return `https://explorer.thetatoken.org/txs/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const getExplorerLink = (address) => {
    return `https://explorer.thetatoken.org/account/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const createInternalTx = async ({ symbol, addressFrom, addressTo, amount, privateKey, }) => {
    const thetaWeiToSend = symbol === 'theta' ? (0, exports.formatValue)(amount, 'to') : new bignumber_js_1.default(0);
    const tfuelWeiToSend = symbol === 'tfuel' ? (0, exports.formatValue)(amount, 'to') : new bignumber_js_1.default(0);
    const transaction = new thetajs.transactions.SendTransaction({
        from: addressFrom,
        outputs: [
            {
                address: addressTo,
                thetaWei: thetaWeiToSend,
                tfuelWei: tfuelWeiToSend,
            },
        ],
    });
    const provider = new thetajs.providers.HttpProvider(thetajs.networks.ChainIds.Mainnet);
    const wallet = new thetajs.Wallet(privateKey, provider);
    const result = await wallet.sendTransaction(transaction);
    if (result === null || result === void 0 ? void 0 : result.hash) {
        return result.hash;
    }
    return null;
};
exports.createInternalTx = createInternalTx;
const validateAddress = (address) => {
    return new RegExp('^(0x)[0-9A-Fa-f]{40}$').test(address);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async ({ addressFrom }) => {
    try {
        return await (0, api_1.getNetworkFeeRequest)('theta', addressFrom);
    }
    catch (_a) {
        return null;
    }
};
exports.getNetworkFee = getNetworkFee;
