"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.getTransactionLink = exports.getExplorerLink = exports.validateAddress = exports.importRecoveryPhrase = exports.generateAddress = exports.formatValue = exports.config = void 0;
const sotez_1 = require("sotez");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const derivationPath = "44'/1729'/0'/0'";
const fee = 1420;
exports.config = {
    coins: ['xtz'],
    isWithPhrase: true,
    wordsSize: [12, 24],
    isInternalTx: true,
};
const formatValue = (value, type) => {
    const ten6 = new bignumber_js_1.default(10).pow(6);
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten6));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten6));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const mnemonic = sotez_1.cryptoUtils.generateMnemonic();
    const { pkh: address, sk: privateKey } = await sotez_1.cryptoUtils.generateKeys(mnemonic, undefined, derivationPath);
    return {
        mnemonic,
        address,
        privateKey,
    };
};
exports.generateAddress = generateAddress;
const importRecoveryPhrase = async (mnemonic) => {
    const { pkh: address, sk: privateKey } = await sotez_1.cryptoUtils.generateKeys(mnemonic, undefined, derivationPath);
    return {
        mnemonic,
        address,
        privateKey,
    };
};
exports.importRecoveryPhrase = importRecoveryPhrase;
const validateAddress = (address) => {
    return sotez_1.cryptoUtils.checkAddress(address);
};
exports.validateAddress = validateAddress;
const getExplorerLink = (address) => {
    return `https://tzstats.com/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://tzstats.com/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const getStandingFee = () => {
    return (0, exports.formatValue)(fee, 'from');
};
exports.getStandingFee = getStandingFee;
const createInternalTx = async (props) => {
    const { addressTo, privateKey, amount } = props;
    if (!privateKey) {
        return null;
    }
    const tezos = new sotez_1.Sotez('https://rpc.tzstats.com');
    await tezos.importKey(privateKey);
    const operation = {
        kind: 'transaction',
        fee,
        gas_limit: 10600,
        storage_limit: 300,
        amount: (0, exports.formatValue)(amount, 'to'),
        destination: addressTo,
    };
    const { hash } = await tezos.sendOperation({ operation });
    return hash;
};
exports.createInternalTx = createInternalTx;
