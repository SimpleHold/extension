"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.fromSat = exports.toSat = exports.config = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const neblio_lib_1 = __importDefault(require("neblio-lib"));
// Utils
const api_1 = require("../../utils/api");
exports.config = {
    coins: ['nebl'],
    isWithOutputs: true,
    isInternalTx: true,
};
const ten8 = new bignumber_js_1.default(10).pow(8);
const toSat = (value) => {
    return new bignumber_js_1.default(value).multipliedBy(ten8).toString();
};
exports.toSat = toSat;
const fromSat = (value) => {
    return new bignumber_js_1.default(value).div(ten8).toString();
};
exports.fromSat = fromSat;
const formatValue = (value, type) => {
    if (type === 'from') {
        return +(0, exports.fromSat)(value);
    }
    return +(0, exports.toSat)(value);
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const privateKey = new neblio_lib_1.default.PrivateKey();
    return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    return new neblio_lib_1.default.PrivateKey(privateKey).toAddress().toString();
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://explorer.nebl.io/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.nebl.io/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^N[A-Za-z0-9]{33}$').test(address);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    const { outputs, amount } = props;
    const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis);
    const utxos = [];
    for (const output of sortOutputs) {
        const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0);
        const transactionFeeBytes = (0, exports.formatValue)(0.0002, 'to');
        if (getUtxosValue >= (0, exports.formatValue)(amount, 'to') + transactionFeeBytes) {
            break;
        }
        utxos.push(output);
    }
    return {
        networkFee: 0.0002,
        utxos,
    };
};
exports.getNetworkFee = getNetworkFee;
const createInternalTx = async (props) => {
    const { privateKey, amount, networkFee, outputs, addressTo, addressFrom } = props;
    if (!privateKey || !outputs) {
        return null;
    }
    const formatAmount = +(0, exports.formatValue)(amount, 'to');
    const formatFee = +(0, exports.formatValue)(networkFee, 'to');
    const rawTx = neblio_lib_1.default
        .Transaction()
        .from(outputs)
        .to(addressTo, formatAmount)
        .fee(formatFee)
        .change(addressFrom)
        .sign(privateKey)
        .toString();
    return await (0, api_1.sendRawTransaction)(rawTx, 'neblio');
};
exports.createInternalTx = createInternalTx;
