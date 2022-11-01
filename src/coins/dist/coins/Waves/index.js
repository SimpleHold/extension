"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importRecoveryPhrase = exports.generateAddress = exports.formatValue = exports.config = void 0;
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const waves_transactions_1 = require("@waves/waves-transactions");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.config = {
    coins: ['waves'],
    wordsSize: [15],
    isWithPhrase: true,
    isInternalTx: true,
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
    const mnemonic = (0, ts_lib_crypto_1.randomSeed)();
    return {
        mnemonic,
        address: (0, ts_lib_crypto_1.address)(mnemonic),
        privateKey: (0, ts_lib_crypto_1.privateKey)(mnemonic),
    };
};
exports.generateAddress = generateAddress;
const importRecoveryPhrase = async (mnemonic) => {
    return {
        mnemonic,
        address: (0, ts_lib_crypto_1.address)(mnemonic),
        privateKey: (0, ts_lib_crypto_1.privateKey)(mnemonic),
    };
};
exports.importRecoveryPhrase = importRecoveryPhrase;
const getExplorerLink = (address) => {
    return `https://wavesexplorer.com/addresses/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://wavesexplorer.com/transactions/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^(3P)[0-9A-Za-z]{33}$').test(address);
};
exports.validateAddress = validateAddress;
const getStandingFee = () => {
    return 0.001;
};
exports.getStandingFee = getStandingFee;
const createInternalTx = async (props) => {
    const { mnemonic, addressTo, amount } = props;
    if (!mnemonic) {
        return null;
    }
    const signedTx = (0, waves_transactions_1.transfer)({
        recipient: addressTo,
        amount: (0, exports.formatValue)(amount, 'to'),
    }, mnemonic);
    const { id } = await (0, waves_transactions_1.broadcast)(signedTx, 'https://nodes.wavesplatform.com');
    return id;
};
exports.createInternalTx = createInternalTx;
