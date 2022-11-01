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
exports.getStandingFee = exports.createTx = exports.getNetworkFee = exports.getUtxos = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.fromSat = exports.toSat = exports.config = void 0;
const bitcoin = __importStar(require("bitcoinjs-lib"));
const bitcore_lib_cash_1 = __importDefault(require("bitcore-lib-cash"));
const bsv_1 = __importDefault(require("bsv"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const buffer_1 = require("buffer");
// Utils
const format_1 = require("../../utils/format");
const api_1 = require("../../utils/api");
const getByteCount_1 = __importDefault(require("./getByteCount"));
const bn_1 = require("../../utils/bn");
// Config
const networks_1 = require("./networks");
const validation_1 = __importDefault(require("./validation"));
exports.config = {
    coins: ['btc', 'ltc', 'doge', 'dash', 'bch', 'bsv'],
    isWithOutputs: true,
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
const getNetwork = (symbol) => {
    if (symbol === 'ltc') {
        return networks_1.LITECOIN;
    }
    if (symbol === 'doge') {
        return networks_1.DOGECOIN;
    }
    if (symbol === 'dash') {
        return networks_1.DASH;
    }
    return bitcoin.networks.bitcoin;
};
const getModule = (symbol) => {
    if (symbol === 'bch') {
        return bitcore_lib_cash_1.default;
    }
    return bsv_1.default;
};
const isNotBitcoinLib = (symbol) => {
    return ['bch', 'bsv'].indexOf(symbol) !== -1;
};
const generateAddress = async (symbol) => {
    var _a;
    try {
        if (isNotBitcoinLib(symbol)) {
            const module = getModule(symbol);
            const privateKey = new module.PrivateKey();
            return {
                address: privateKey.toAddress().toString(),
                privateKey: privateKey.toWIF(),
            };
        }
        const network = getNetwork(symbol);
        const keyPair = bitcoin.ECPair.makeRandom({ network });
        const privateKey = (_a = keyPair.privateKey) === null || _a === void 0 ? void 0 : _a.toString('hex');
        const { address } = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network,
        });
        if (privateKey && address) {
            return {
                privateKey,
                address,
            };
        }
        return null;
    }
    catch (_b) {
        return null;
    }
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey, symbol) => {
    try {
        if (isNotBitcoinLib(symbol)) {
            const module = getModule(symbol);
            return new module.PrivateKey(privateKey).toAddress().toString();
        }
        const network = getNetwork(symbol);
        const keyPair = getKeyPair(privateKey, network);
        if (!keyPair) {
            return null;
        }
        const { address } = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network,
        });
        return address || null;
    }
    catch (_a) {
        return null;
    }
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address, chain) => {
    return `https://blockchair.com/${chain}/address/${address}?from=simplehold`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash, chain) => {
    return `https://blockchair.com/${chain}/transaction/${hash}?from=simplehold`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address, symbol) => {
    const findRegex = validation_1.default.find((i) => (0, format_1.toLower)(i.symbol) === (0, format_1.toLower)(symbol));
    if (findRegex === null || findRegex === void 0 ? void 0 : findRegex.pattern) {
        return new RegExp(findRegex.pattern).test(address);
    }
    return false;
};
exports.validateAddress = validateAddress;
const getFeeType = (type) => {
    if (type === 'slow') {
        return 'slow';
    }
    if (type === 'average') {
        return 'average';
    }
    return 'fast';
};
const getFee = (utxos, value) => {
    return (0, getByteCount_1.default)({ P2PKH: utxos.length }, { P2WSH: 2 }) * value;
};
const getUtxos = (symbol, outputs, amount) => {
    const utxos = [];
    if (symbol === 'doge') {
        const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis);
        for (const output of sortOutputs) {
            const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0);
            const transactionFeeBytes = getFee(utxos, 1);
            if (getUtxosValue >= +(0, exports.toSat)(amount) + transactionFeeBytes) {
                break;
            }
            utxos.push(output);
        }
    }
    return utxos;
};
exports.getUtxos = getUtxos;
const getNetworkFee = async (props) => {
    const { chain, outputs, amount } = props;
    const fees = [];
    const feeRate = await (0, api_1.getFeeRate)(chain);
    for (const type in feeRate) {
        const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis);
        const utxos = [];
        const feeType = getFeeType(type);
        const getTypeValue = feeRate[feeType];
        for (const output of sortOutputs) {
            const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0);
            const transactionFeeBytes = getFee(utxos, getTypeValue);
            if (getUtxosValue >= Number((0, exports.toSat)(amount)) + transactionFeeBytes) {
                break;
            }
            utxos.push(output);
        }
        const value = +(0, exports.fromSat)(getFee(utxos, getTypeValue));
        fees.push({
            type: feeType,
            utxos,
            value,
        });
    }
    return {
        fees,
    };
};
exports.getNetworkFee = getNetworkFee;
const getKeyPair = (privateKey, network) => {
    try {
        return bitcoin.ECPair.fromWIF(privateKey, network);
    }
    catch (_a) {
        try {
            return bitcoin.ECPair.fromPrivateKey(buffer_1.Buffer.from(privateKey, 'hex'), {
                network,
            });
        }
        catch (_b) {
            return null;
        }
    }
};
const createTx = async ({ chain, addressFrom, addressTo, amount, privateKey, utxos, symbol, fee, }) => {
    if (!privateKey) {
        return null;
    }
    const formatAmount = +(0, exports.toSat)(amount);
    const formatFee = +(0, exports.toSat)(fee);
    if (isNotBitcoinLib(symbol)) {
        const module = getModule(symbol);
        const transaction = new module.Transaction()
            .from(utxos)
            .to(addressTo, formatAmount)
            .fee(formatFee)
            .change(addressFrom)
            .sign(privateKey);
        return transaction.toString();
    }
    const network = getNetwork(symbol);
    const psbt = new bitcoin.Psbt({ network });
    const keyPair = getKeyPair(privateKey, network);
    if (!keyPair) {
        return null;
    }
    for (const output of utxos) {
        const { txId, outputIndex } = output;
        const txHex = await (0, api_1.getTxHex)(chain, txId);
        if (!txHex) {
            return null;
        }
        psbt.addInput({
            hash: txId,
            index: outputIndex,
            nonWitnessUtxo: buffer_1.Buffer.from(txHex, 'hex'),
        });
    }
    psbt.setMaximumFeeRate(9999999);
    psbt.addOutput({
        address: addressTo,
        value: formatAmount,
    });
    const totalOutputsAmount = utxos.reduce((a, b) => a + b.satoshis, 0);
    const opReturnAmount = (0, bn_1.minus)(totalOutputsAmount, (0, bn_1.plus)(formatAmount, formatFee));
    if (opReturnAmount !== 0) {
        psbt.addOutput({
            address: addressFrom,
            value: opReturnAmount,
        });
    }
    psbt.signAllInputs(keyPair);
    psbt.validateSignaturesOfAllInputs();
    psbt.finalizeAllInputs();
    const transaction = psbt.extractTransaction();
    const signedTransaction = transaction.toHex();
    return signedTransaction;
};
exports.createTx = createTx;
const getStandingFee = (symbol) => {
    if (symbol === 'doge') {
        return 1;
    }
    return 0;
};
exports.getStandingFee = getStandingFee;
