"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importRecoveryPhrase = exports.generateAddress = exports.formatValue = exports.config = void 0;
const erdjs_walletcore_1 = require("@elrondnetwork/erdjs-walletcore");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const api_1 = require("../../utils/api");
const bn_1 = require("../../utils/bn");
exports.config = {
    coins: ['egld'],
    isInternalTx: true,
    wordsSize: [12, 24],
    isWithPhrase: true,
    extraIdName: 'Custom Data',
};
const ten18 = new bignumber_js_1.default(10).pow(18);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten18));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten18));
};
exports.formatValue = formatValue;
const getAddress = (mnemonic) => {
    return mnemonic.deriveKey().generatePublicKey().toAddress().toString();
};
const generateAddress = async () => {
    const core = require('@elrondnetwork/elrond-core-js');
    const account = new core.account();
    const mnemonic = erdjs_walletcore_1.Mnemonic.generate();
    const address = getAddress(mnemonic);
    const privateKey = account.privateKeyFromMnemonic(mnemonic.toString());
    return {
        mnemonic: mnemonic.toString(),
        address,
        privateKey,
    };
};
exports.generateAddress = generateAddress;
const importRecoveryPhrase = async (recoveryPhrase) => {
    const core = require('@elrondnetwork/elrond-core-js');
    const account = new core.account();
    const mnemonic = erdjs_walletcore_1.Mnemonic.fromString(recoveryPhrase);
    const address = getAddress(mnemonic);
    const privateKey = account.privateKeyFromMnemonic(mnemonic.toString());
    return {
        mnemonic: mnemonic.toString(),
        address,
        privateKey,
    };
};
exports.importRecoveryPhrase = importRecoveryPhrase;
const getExplorerLink = (address) => {
    return `https://explorer.elrond.com/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.elrond.com/transactions/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^(erd)[0-9A-Za-z]{30,70}$').test(address);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    const { addressFrom, amount, chain, extraId } = props;
    return await (0, api_1.getNetworkFeeRequest)(chain, addressFrom, amount, extraId);
};
exports.getNetworkFee = getNetworkFee;
const getGasLimit = (gasLimit, gasPerByte, extraId) => {
    const extraIdSize = (extraId === null || extraId === void 0 ? void 0 : extraId.length) ? (0, bn_1.multiplied)(extraId.length, gasPerByte) : 0;
    return (0, bn_1.plus)(gasLimit, extraIdSize);
};
const createInternalTx = async (props) => {
    const { addressFrom, amount, mnemonic, extraId, addressTo } = props;
    if (!mnemonic) {
        return null;
    }
    const txParams = await (0, api_1.getTxParams)('elrond', addressFrom);
    if (!txParams) {
        return null;
    }
    const core = require('@elrondnetwork/elrond-core-js');
    const transaction = new core.transaction({
        nonce: txParams.nonce,
        from: addressFrom,
        to: addressTo,
        senderUsername: '',
        receiverUsername: '',
        value: `${(0, exports.formatValue)(amount, 'to')}`,
        gasPrice: txParams.gasPrice,
        gasLimit: getGasLimit(txParams.gasLimit, txParams.gasPerByte, extraId),
        data: extraId || '',
        chainID: '1',
        version: 1,
    });
    const account = new core.account();
    account.loadFromMnemonic(mnemonic);
    const serializedTransaction = transaction.prepareForSigning();
    transaction.signature = account.sign(serializedTransaction);
    const request = await (0, api_1.sendRequest)({
        url: 'https://api.elrond.com/transactions',
        method: 'POST',
        data: transaction.prepareForNode(),
        skipNestedData: true,
    });
    if (request === null || request === void 0 ? void 0 : request.txHash) {
        return request.txHash;
    }
    return null;
};
exports.createInternalTx = createInternalTx;
