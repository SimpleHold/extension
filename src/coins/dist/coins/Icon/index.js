"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const icon_sdk_js_1 = __importDefault(require("icon-sdk-js"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const api_1 = require("../../utils/api");
exports.config = {
    coins: ['icx'],
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
    const wallet = icon_sdk_js_1.default.IconWallet.create();
    return {
        address: wallet.getAddress(),
        privateKey: wallet.getPrivateKey(),
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    return icon_sdk_js_1.default.IconWallet.loadPrivateKey(privateKey).getAddress();
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://tracker.icon.community/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://tracker.icon.community/transaction/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^(hx)[A-Za-z0-9]{40}$').test(address);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    const { addressFrom, amount, chain } = props;
    return await (0, api_1.getNetworkFeeRequest)(chain, addressFrom, amount);
};
exports.getNetworkFee = getNetworkFee;
const createInternalTx = async (props) => {
    const { addressFrom, addressTo, amount, privateKey } = props;
    if (!privateKey) {
        return null;
    }
    const txObj = new icon_sdk_js_1.default.IconBuilder.IcxTransactionBuilder()
        .from(addressFrom)
        .to(addressTo)
        .value(icon_sdk_js_1.default.IconAmount.of(amount, icon_sdk_js_1.default.IconAmount.Unit.ICX).toLoop())
        .stepLimit(icon_sdk_js_1.default.IconConverter.toBigNumber(100000))
        .nid('0x1')
        .nonce(icon_sdk_js_1.default.IconConverter.toBigNumber(1))
        .version(icon_sdk_js_1.default.IconConverter.toBigNumber(3))
        .timestamp(+new Date() * 1000)
        .build();
    const wallet = icon_sdk_js_1.default.IconWallet.loadPrivateKey(privateKey);
    const signTx = new icon_sdk_js_1.default.SignedTransaction(txObj, wallet);
    return await (0, api_1.sendRawTransaction)('', 'icon', signTx.getProperties());
};
exports.createInternalTx = createInternalTx;
