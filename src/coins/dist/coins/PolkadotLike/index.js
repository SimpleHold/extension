"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getExplorerLink = exports.getTransactionLink = exports.importRecoveryPhrase = exports.generateAddress = exports.formatValue = exports.config = void 0;
const api_1 = require("@polkadot/api");
const util_crypto_1 = require("@polkadot/util-crypto");
const wasm_crypto_1 = require("@polkadot/wasm-crypto");
const keyring_1 = require("@polkadot/keyring");
const util_1 = require("@polkadot/util");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const api_2 = require("../../utils/api");
const format_1 = require("../../utils/format");
// Config
const chains_1 = __importDefault(require("./chains"));
exports.config = {
    coins: chains_1.default.map((item) => item.symbol),
    isWithPhrase: true,
    wordsSize: [12],
    isInternalTx: true,
};
const getDecimals = (symbol) => {
    var _a;
    return ((_a = chains_1.default.find((item) => (0, format_1.toLower)(item.symbol) === (0, format_1.toLower)(symbol))) === null || _a === void 0 ? void 0 : _a.decimals) || 10;
};
const formatValue = (value, type, symbol) => {
    const bnZeros = new bignumber_js_1.default(10).pow(getDecimals(symbol));
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(bnZeros));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(bnZeros));
};
exports.formatValue = formatValue;
const getChain = (chain) => {
    return chains_1.default.find((item) => item.chain === chain);
};
const generateAddress = async (symbol, chain) => {
    await (0, wasm_crypto_1.waitReady)();
    await (0, util_crypto_1.cryptoWaitReady)();
    const chainInfo = getChain(chain);
    if (!chainInfo) {
        return null;
    }
    const { ss58Format, keypairType, path } = chainInfo;
    const mnemonic = (0, util_crypto_1.mnemonicGenerate)();
    const keyring = new api_1.Keyring({ ss58Format });
    const suri = path ? `${mnemonic}/${path}` : mnemonic;
    const { address } = keyring.createFromUri(suri, undefined, keypairType);
    return {
        address,
        privateKey: '',
        mnemonic,
    };
};
exports.generateAddress = generateAddress;
const importRecoveryPhrase = async (recoveryPhrase, symbol, chain) => {
    if ((0, util_crypto_1.mnemonicValidate)(recoveryPhrase)) {
        await (0, wasm_crypto_1.waitReady)();
        await (0, util_crypto_1.cryptoWaitReady)();
        const chainInfo = getChain(chain);
        if (!chainInfo) {
            return null;
        }
        const { ss58Format, keypairType, path } = chainInfo;
        const keyring = new api_1.Keyring({ ss58Format });
        const suri = path ? `${recoveryPhrase}/${path}` : recoveryPhrase;
        const { address } = keyring.createFromUri(suri, undefined, keypairType);
        return {
            address,
            privateKey: '',
            mnemonic: recoveryPhrase,
        };
    }
    return null;
};
exports.importRecoveryPhrase = importRecoveryPhrase;
const getTransactionLink = (hash, chain) => {
    return `https://${chain}.subscan.io/extrinsic/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const getExplorerLink = (address, chain) => {
    return `https://${chain}.subscan.io/account/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const validateAddress = (address) => {
    try {
        (0, keyring_1.encodeAddress)((0, util_1.isHex)(address) ? (0, util_1.hexToU8a)(address) : (0, keyring_1.decodeAddress)(address));
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    const { addressFrom, amount, chain } = props;
    return await (0, api_2.getNetworkFeeRequest)(chain, addressFrom, amount);
};
exports.getNetworkFee = getNetworkFee;
const createInternalTx = async (props) => {
    const { amount, mnemonic, addressTo, chain, symbol } = props;
    const chainInfo = getChain(chain);
    if (mnemonic && chainInfo) {
        await (0, wasm_crypto_1.waitReady)();
        await (0, util_crypto_1.cryptoWaitReady)();
        const { keypairType, wsUrl, ss58Format, path } = chainInfo;
        const provider = new api_1.WsProvider(wsUrl);
        const api = await api_1.ApiPromise.create({
            provider,
            throwOnConnect: false,
            throwOnUnknown: false,
        });
        const keyring = new api_1.Keyring({ ss58Format });
        const suri = path ? `${mnemonic}/${path}` : mnemonic;
        const sender = keyring.createFromUri(suri, undefined, keypairType);
        const bnZeros = new bignumber_js_1.default(10).pow(getDecimals(symbol));
        const formatAmount = new util_1.BN(new bignumber_js_1.default(amount).multipliedBy(bnZeros).toString());
        const transfer = api.tx.balances.transfer(addressTo, formatAmount);
        const hash = await transfer.signAndSend(sender);
        return hash.toHex();
    }
    return null;
};
exports.createInternalTx = createInternalTx;
