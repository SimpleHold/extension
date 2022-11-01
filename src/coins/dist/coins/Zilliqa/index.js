"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const zilliqa_1 = require("@zilliqa-js/zilliqa");
const util_1 = require("@zilliqa-js/util");
const crypto_1 = require("@zilliqa-js/crypto");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.config = {
    coins: ['zil'],
    isInternalTx: true,
};
const ten12 = new bignumber_js_1.default(10).pow(12);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten12));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten12));
};
exports.formatValue = formatValue;
const pkToBech32 = (privateKey) => {
    const { with0x } = (0, crypto_1.getAccountFrom0xPrivateKey)(privateKey);
    return with0x.bech32;
};
const generateAddress = async () => {
    const privateKey = crypto_1.schnorr.generatePrivateKey();
    return {
        privateKey,
        address: pkToBech32(privateKey),
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    return pkToBech32(privateKey);
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://viewblock.io/zilliqa/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://viewblock.io/zilliqa/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    try {
        return util_1.validation.isBech32(address);
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
const getStandingFee = () => {
    return 0.1;
};
exports.getStandingFee = getStandingFee;
const createInternalTx = async ({ addressTo, amount, privateKey, }) => {
    if (!privateKey) {
        return null;
    }
    const zilliqa = new zilliqa_1.Zilliqa('https://api.zilliqa.com');
    const fromPublicKey = (0, crypto_1.getPubKeyFromPrivateKey)(privateKey);
    const fromAddress = (0, crypto_1.getAddressFromPrivateKey)(privateKey);
    const nextNonce = (await zilliqa.blockchain.getBalance(fromAddress)).result.nonce + 1;
    const getGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
    const formatAmount = new bignumber_js_1.default(amount).multipliedBy(new bignumber_js_1.default(10).pow(6)).toNumber();
    if (getGasPrice === null || getGasPrice === void 0 ? void 0 : getGasPrice.result) {
        const rawTx = zilliqa.transactions.new({
            version: util_1.bytes.pack(1, 1),
            amount: new util_1.BN(util_1.units.toQa(formatAmount, util_1.units.Units.Li)),
            nonce: nextNonce,
            gasLimit: util_1.Long.fromNumber(50),
            gasPrice: new util_1.BN(getGasPrice.result),
            toAddr: addressTo,
            pubKey: fromPublicKey,
        });
        zilliqa.wallet.addByPrivateKey(privateKey);
        const signedTx = await zilliqa.wallet.signWith(rawTx, fromAddress);
        const res = await zilliqa.provider.send('CreateTransaction', signedTx.txParams);
        if (res.result.TranID) {
            return `0x${res.result.TranID}`;
        }
    }
    return null;
};
exports.createInternalTx = createInternalTx;
