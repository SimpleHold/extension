"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTx = exports.getPubKeyFromPriv = exports.getStandingFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const nerve_sdk_js_1 = __importDefault(require("nerve-sdk-js"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const api_1 = require("../../utils/api");
exports.config = {
    coins: ['nvt'],
    isZeroFee: true,
};
const chainId = 9;
const ten8 = new bignumber_js_1.default(10).pow(8);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten8));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten8));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const { address, pri: privateKey } = nerve_sdk_js_1.default.newAddress(chainId, '', '');
    if (address && privateKey) {
        return {
            address,
            privateKey,
        };
    }
    return null;
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    const importByKey = nerve_sdk_js_1.default.importByKey(chainId, privateKey, '', '');
    if (importByKey === null || importByKey === void 0 ? void 0 : importByKey.address) {
        return importByKey.address;
    }
    return null;
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://scan.nerve.network/address/info?address=${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://scan.nerve.network/transaction/info?hash=${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    try {
        const verify = nerve_sdk_js_1.default.verifyAddress(address);
        return verify.chainId === chainId && verify.right;
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
const getStandingFee = () => {
    return 0;
};
exports.getStandingFee = getStandingFee;
const getPubKeyFromPriv = (privateKey) => {
    try {
        const importByKey = nerve_sdk_js_1.default.importByKey(chainId, privateKey, '', '');
        if (importByKey === null || importByKey === void 0 ? void 0 : importByKey.pub) {
            return importByKey.pub;
        }
        return null;
    }
    catch (_a) {
        return null;
    }
};
exports.getPubKeyFromPriv = getPubKeyFromPriv;
const getInputsOutputs = (transferInfo, balanceInfo) => {
    const inputs = [
        {
            address: transferInfo.fromAddress,
            assetsChainId: 9,
            assetsId: 1,
            amount: transferInfo.amount,
            locked: 0,
            nonce: balanceInfo.nonce,
        },
    ];
    const outputs = [
        {
            address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
            assetsChainId: 9,
            assetsId: 1,
            amount: transferInfo.amount,
            lockTime: 0,
        },
    ];
    return {
        inputs,
        outputs,
    };
};
const createTx = async (props) => {
    const { addressFrom, addressTo, privateKey, amount } = props;
    if (!privateKey) {
        return null;
    }
    const getPubKey = (0, exports.getPubKeyFromPriv)(privateKey);
    if (getPubKey) {
        const params = await (0, api_1.getTxParams)('nerve', addressFrom);
        const { inputs, outputs } = getInputsOutputs({
            fromAddress: addressFrom,
            toAddress: addressTo,
            amount: (0, exports.formatValue)(amount, 'to'),
        }, params);
        const assembleTx = nerve_sdk_js_1.default.transactionAssemble(inputs, outputs, '', 2);
        return nerve_sdk_js_1.default.transactionSerialize(privateKey, getPubKey, assembleTx);
    }
    return null;
};
exports.createTx = createTx;
