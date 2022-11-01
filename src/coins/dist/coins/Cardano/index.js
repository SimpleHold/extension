"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importRecoveryPhrase = exports.generateAddress = exports.formatValue = exports.config = void 0;
const cardano_crypto_js_1 = require("cardano-crypto.js");
const bip39_1 = require("bip39");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const utils_1 = require("./utils");
const getNetworkFee_1 = __importDefault(require("./getNetworkFee"));
const createCardanoTx_1 = __importDefault(require("./createCardanoTx"));
const api_1 = require("../../utils/api");
// Config
const config_1 = require("./config");
exports.config = {
    coins: ['ada'],
    isWithOutputs: true,
    isWithPhrase: true,
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
    const mnemonic = (0, bip39_1.generateMnemonic)(256);
    const address = await getAddressFromMnemonic(mnemonic);
    return {
        address,
        privateKey: '',
        mnemonic,
    };
};
exports.generateAddress = generateAddress;
const importRecoveryPhrase = async (mnemonic) => {
    const address = await getAddressFromMnemonic(mnemonic);
    return {
        address,
        privateKey: '',
        mnemonic,
    };
};
exports.importRecoveryPhrase = importRecoveryPhrase;
const getAddressFromMnemonic = async (mnemonic) => {
    const rootSecret = await (0, cardano_crypto_js_1.mnemonicToRootKeypair)(mnemonic, 2);
    const cryptoProvider = await (0, utils_1.getCryptoProvider)(rootSecret);
    const spendXpub = await cryptoProvider.deriveXpub(config_1.shelleyPath);
    const stakeXpub = await cryptoProvider.deriveXpub(config_1.shelleyStakeAccountPath);
    return (0, utils_1.baseAddressFromXpub)(spendXpub, stakeXpub);
};
const getExplorerLink = (address) => {
    return `https://cardanoscan.io/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://cardanoscan.io/transaction/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^((addr)([1-9A-HJ-NP-Za-km-z]{59})|([0-9A-Za-z]{100,104}))$|^(addr)[0-9A-Za-z]{45,65}$').test(address);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    try {
        const { outputs, amount, addressFrom } = props;
        const getFeeRequest = await (0, getNetworkFee_1.default)(+(0, exports.formatValue)(amount, 'to'), addressFrom, addressFrom, outputs);
        if (getFeeRequest === null || getFeeRequest === void 0 ? void 0 : getFeeRequest.success) {
            const { baseFee } = getFeeRequest.txPlan;
            return {
                networkFee: (0, exports.formatValue)(baseFee, 'from'),
                utxos: getFeeRequest.txPlan.inputs,
            };
        }
        return {
            networkFee: 0,
        };
    }
    catch (_a) {
        return {
            networkFee: 0,
        };
    }
};
exports.getNetworkFee = getNetworkFee;
const createTx = async (props) => {
    const txParams = await (0, api_1.getTxParams)('cardano');
    if (txParams) {
        const { ttl } = txParams;
        return await (0, createCardanoTx_1.default)(props, ttl);
    }
    return null;
};
exports.createTx = createTx;
