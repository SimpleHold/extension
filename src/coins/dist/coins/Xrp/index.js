"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkFee = exports.generateExtraId = exports.createTx = exports.getTransactionLink = exports.getExplorerLink = exports.validateAddress = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const ripple_lib_1 = require("ripple-lib");
const ripple_keypairs_1 = __importDefault(require("ripple-keypairs"));
// Utils
const api_1 = require("../../utils/api");
const api = new ripple_lib_1.RippleAPI();
exports.config = {
    coins: ['xrp'],
    extraIdName: 'Destination tag',
    isGenerateExtraId: true,
};
const formatValue = (value, type) => {
    if (type === 'from') {
        return +api.dropsToXrp(value);
    }
    return +api.xrpToDrops(value);
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const generate = api.generateAddress();
    if (generate === null || generate === void 0 ? void 0 : generate.address) {
        return {
            address: generate.address,
            privateKey: generate.secret,
        };
    }
    return null;
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    const keypair = ripple_keypairs_1.default.deriveKeypair(privateKey);
    return ripple_keypairs_1.default.deriveAddress(keypair.publicKey);
};
exports.importPrivateKey = importPrivateKey;
const validateAddress = (address) => {
    return api.isValidAddress(address);
};
exports.validateAddress = validateAddress;
const getExplorerLink = (address) => {
    return `https://xrpscan.com/account/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://xrpscan.com/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const createTx = async (props) => {
    const { addressFrom, addressTo, amount, extraId, privateKey } = props;
    if (!privateKey) {
        return null;
    }
    const params = await (0, api_1.getTxParams)('ripple', addressFrom);
    if (params) {
        const { fee, sequence, maxLedgerVersion } = params;
        const payment = {
            source: {
                address: addressFrom,
                maxAmount: {
                    value: amount,
                    currency: 'XRP',
                },
            },
            destination: {
                address: addressTo,
                amount: {
                    value: amount,
                    currency: 'XRP',
                },
            },
        };
        if (extraId === null || extraId === void 0 ? void 0 : extraId.length) {
            payment.destination.tag = Number(extraId);
        }
        const { txJSON } = await api.preparePayment(addressFrom, payment, {
            fee,
            sequence,
            maxLedgerVersion,
        });
        const sign = api.sign(txJSON, privateKey);
        return sign.signedTransaction;
    }
    return null;
};
exports.createTx = createTx;
const generateExtraId = () => {
    const num = (Date.now() * (1 + Math.random())).toFixed(0).slice(-9).split('');
    const firstSign = +num[0];
    if (firstSign === 0) {
        num[0] = Math.floor(1 + Math.random() * (9 + 1 - 1)).toString();
    }
    return num.join('');
};
exports.generateExtraId = generateExtraId;
const getNetworkFee = async () => {
    try {
        return await (0, api_1.getNetworkFeeRequest)('ripple');
    }
    catch (_a) {
        return null;
    }
};
exports.getNetworkFee = getNetworkFee;
