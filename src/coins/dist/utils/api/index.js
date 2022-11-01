"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressNonce = exports.sendRawTransaction = exports.getBalance = exports.getNetworkFeeRequest = exports.getCardanoAsset = exports.getTxParams = exports.getTxHex = exports.getFeeRate = exports.sendRequest = void 0;
const axios_1 = __importDefault(require("axios"));
// Data
const data_1 = require("./data");
const sendRequest = async ({ url, method = 'GET', data, params, skipNestedData, }) => {
    try {
        const { data: responseData } = await (0, axios_1.default)({
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            data,
            params,
        });
        if (skipNestedData) {
            // @ts-ignore
            return responseData;
        }
        return responseData.data;
    }
    catch (_a) {
        return null;
    }
};
exports.sendRequest = sendRequest;
const getFeeRate = async (chain) => {
    try {
        const request = await (0, exports.sendRequest)({
            url: `https://simplehold.io/api/fee/${chain}`,
        });
        return request || data_1.defaultFeeRate;
    }
    catch (_a) {
        return data_1.defaultFeeRate;
    }
};
exports.getFeeRate = getFeeRate;
const getTxHex = async (chain, txId) => {
    try {
        const request = await (0, exports.sendRequest)({
            url: `https://simplehold.io/api/transaction/tx-hex/${chain}/${txId}`,
        });
        return request;
    }
    catch (_a) {
        return null;
    }
};
exports.getTxHex = getTxHex;
const getTxParams = async (type, from, to, value, chain, contractAddress) => {
    return await (0, exports.sendRequest)({
        url: `https://simplehold.io/api/transaction/${type}/params`,
        params: {
            from,
            to,
            chain,
            value,
            contractAddress,
        },
        skipNestedData: type !== 'eth-like',
    });
};
exports.getTxParams = getTxParams;
const getCardanoAsset = async (asset) => {
    try {
        return await (0, exports.sendRequest)({
            url: `https://simplehold.io/api/wallet/cardano/assetInfo`,
            params: {
                asset,
            },
        });
    }
    catch (_a) {
        return null;
    }
};
exports.getCardanoAsset = getCardanoAsset;
const getNetworkFeeRequest = async (chain, address, value, extraId) => {
    try {
        return await (0, exports.sendRequest)({
            url: `https://simplehold.io/api/transaction/${chain}/network-fee`,
            params: {
                address,
                value,
                extraId,
            },
        });
    }
    catch (_a) {
        return {
            networkFee: 0.3,
        };
    }
};
exports.getNetworkFeeRequest = getNetworkFeeRequest;
const getBalance = async (address, chain, tokenSymbol, contractAddress, isFullBalance) => {
    try {
        return await (0, exports.sendRequest)({
            url: `https://simplehold.io/api/wallet/balance/${chain}/${address}`,
            params: {
                tokenSymbol,
                contractAddress,
                isFullBalance,
            },
        });
    }
    catch (_a) {
        return null;
    }
};
exports.getBalance = getBalance;
const sendRawTransaction = async (transaction, currency, data) => {
    return await (0, exports.sendRequest)({
        url: 'https://simplehold.io/api/transaction/send',
        method: 'POST',
        data: {
            currency,
            transaction,
            data,
        },
    });
};
exports.sendRawTransaction = sendRawTransaction;
const getAddressNonce = async (chain, address) => {
    const request = await (0, exports.sendRequest)({
        url: `https://simplehold.io/api/wallet/nonce/${chain}`,
        method: 'GET',
        params: {
            address,
        },
    });
    return request || '0';
};
exports.getAddressNonce = getAddressNonce;
