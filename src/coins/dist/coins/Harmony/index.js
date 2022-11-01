"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkFee = exports.createInternalTx = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const core_1 = require("@harmony-js/core");
const crypto_1 = require("@harmony-js/crypto");
const utils_1 = require("@harmony-js/utils");
// Utils
const api_1 = require("../../utils/api");
exports.config = {
    coins: ['one'],
    isInternalTx: true,
};
const formatValue = (value, type) => {
    if (type === 'from') {
        return +(0, utils_1.fromWei)(`${value}`, utils_1.Units.one);
    }
    return +(0, utils_1.numToStr)((0, utils_1.toWei)(`${value}`, utils_1.Units.one));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const privateKey = (0, crypto_1.generatePrivateKey)();
    const address = (0, crypto_1.getAddressFromPrivateKey)(privateKey);
    return {
        privateKey,
        address: (0, crypto_1.getAddress)(address).bech32,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    return (0, crypto_1.getAddress)((0, crypto_1.getAddressFromPrivateKey)(privateKey)).bech32;
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://explorer.harmony.one/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.harmony.one/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    try {
        return (0, utils_1.isAddress)(address) || (0, utils_1.isBech32Address)(address);
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
const createInternalTx = async ({ addressTo, amount, privateKey, }) => {
    if (privateKey) {
        const hmy = new core_1.Harmony('https://api.harmony.one', {
            chainType: utils_1.ChainType.Harmony,
            chainId: utils_1.ChainID.HmyMainnet,
        });
        hmy.wallet.addByPrivateKey(privateKey);
        hmy.blockchain.getShardingStructure();
        const txn = hmy.transactions.newTx({
            to: addressTo,
            value: new utils_1.Unit(amount).asOne().toWei(),
            gasLimit: '21000',
            shardID: 0,
            toShardID: 0,
            gasPrice: new hmy.utils.Unit('100').asGwei().toWei(),
        });
        const signedTxn = await hmy.wallet.signTransaction(txn);
        const txnHash = await hmy.blockchain.sendTransaction(signedTxn);
        if (txnHash === null || txnHash === void 0 ? void 0 : txnHash.result) {
            return txnHash.result;
        }
    }
    return null;
};
exports.createInternalTx = createInternalTx;
const getNetworkFee = async () => {
    try {
        const request = await (0, api_1.getNetworkFeeRequest)('harmony');
        if (request) {
            return {
                networkFee: +Number(request.networkFee).toFixed(8),
            };
        }
        return null;
    }
    catch (_a) {
        return null;
    }
};
exports.getNetworkFee = getNetworkFee;
