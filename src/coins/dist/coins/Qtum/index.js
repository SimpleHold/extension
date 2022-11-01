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
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
// Utils
const api_1 = require("../../utils/api");
const bn_1 = require("../../utils/bn");
const getByteCount_1 = __importDefault(require("./getByteCount"));
// Config
const config_1 = require("./config");
exports.config = {
    coins: ['qtum'],
    isWithOutputs: true,
    isInternalTx: true,
};
const ten8 = new bignumber_js_1.default(10).pow(8);
const feeRate = 600;
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten8));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten8));
};
exports.formatValue = formatValue;
const getAddress = (pubkey) => {
    const { address } = bitcoin.payments.p2pkh({ pubkey, network: config_1.mainnet });
    return address || null;
};
const generateAddress = async () => {
    var _a;
    const keyPair = bitcoin.ECPair.makeRandom({ network: config_1.mainnet });
    const privateKey = (_a = keyPair.privateKey) === null || _a === void 0 ? void 0 : _a.toString('hex');
    const address = getAddress(keyPair.publicKey);
    if (privateKey && address) {
        return {
            privateKey,
            address,
        };
    }
    return null;
};
exports.generateAddress = generateAddress;
const getKeyPair = (privateKey) => {
    try {
        return bitcoin.ECPair.fromWIF(privateKey, config_1.mainnet);
    }
    catch (_a) {
        try {
            return bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
                network: config_1.mainnet,
            });
        }
        catch (_b) {
            return null;
        }
    }
};
const importPrivateKey = async (privateKey) => {
    const keyPair = getKeyPair(privateKey);
    if (keyPair) {
        return getAddress(keyPair.publicKey);
    }
    return null;
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://qtum.info/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://qtum.info/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^[Q|M][A-Za-z0-9]{33}$').test(address);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    const { outputs, amount } = props;
    const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis);
    const utxos = [];
    for (const output of sortOutputs) {
        const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0);
        const transactionFeeBytes = (0, getByteCount_1.default)({ P2PKH: utxos.length }, { P2WSH: 2 }) * feeRate;
        if (getUtxosValue >= (0, exports.formatValue)(amount, 'to') + transactionFeeBytes) {
            break;
        }
        utxos.push(output);
    }
    return {
        networkFee: (0, exports.formatValue)((0, getByteCount_1.default)({ P2PKH: utxos.length }, { P2WSH: 2 }) * feeRate, 'from'),
        utxos,
    };
};
exports.getNetworkFee = getNetworkFee;
const createInternalTx = async (props) => {
    const { privateKey, amount, networkFee, outputs, addressTo, addressFrom } = props;
    if (!privateKey || !outputs) {
        return null;
    }
    const psbt = new bitcoin.Psbt({ network: config_1.mainnet });
    const keyPair = getKeyPair(privateKey);
    if (!keyPair) {
        return null;
    }
    const formatAmount = +(0, exports.formatValue)(amount, 'to');
    const formatFee = +(0, exports.formatValue)(networkFee, 'to');
    for (const output of outputs) {
        const { txId, outputIndex } = output;
        const txHex = await (0, api_1.getTxHex)('qtum', txId);
        if (!txHex) {
            return null;
        }
        psbt.addInput({
            hash: txId,
            index: outputIndex,
            nonWitnessUtxo: Buffer.from(txHex, 'hex'),
        });
    }
    psbt.setMaximumFeeRate(9999999);
    psbt.addOutput({
        address: addressTo,
        value: formatAmount,
    });
    const totalOutputsAmount = outputs.reduce((a, b) => a + b.satoshis, 0);
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
    return await (0, api_1.sendRawTransaction)(signedTransaction, 'qtum');
};
exports.createInternalTx = createInternalTx;
