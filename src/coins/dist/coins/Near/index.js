"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const near_api_js_1 = require("near-api-js");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.config = {
    coins: ['near'],
    isInternalTx: true,
};
const ten24 = new bignumber_js_1.default(10).pow(24);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten24));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten24));
};
exports.formatValue = formatValue;
const getAddress = (publicKey) => {
    // @ts-ignore
    return near_api_js_1.utils.PublicKey.fromString(publicKey).data.toString('hex');
};
const generateAddress = async () => {
    const generate = near_api_js_1.KeyPair.fromRandom('ed25519');
    const privateKey = generate.toString();
    const address = getAddress(generate.getPublicKey().toString());
    return {
        privateKey,
        address,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    const fromString = near_api_js_1.KeyPair.fromString(privateKey);
    return getAddress(fromString.getPublicKey().toString());
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://explorer.near.org/accounts/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.near.org/transactions/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('(^[a-z0-9_-]{2,64}\\.near$)|(^[0-9a-f]{64}$)').test(address);
};
exports.validateAddress = validateAddress;
const getStandingFee = () => {
    return 0.00008;
};
exports.getStandingFee = getStandingFee;
const createInternalTx = async (props) => {
    const { addressFrom, amount, privateKey, addressTo } = props;
    if (!privateKey) {
        return null;
    }
    const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
    const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
    await keyStore.setKey('mainnet', addressFrom, keyPair);
    const config = {
        networkId: 'mainnet',
        keyStore,
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
    };
    const near = await (0, near_api_js_1.connect)(config);
    const senderAccount = await near.account(addressFrom);
    const { transaction } = await senderAccount.sendMoney(addressTo, 
    // @ts-ignore
    near_api_js_1.utils.format.parseNearAmount(amount));
    return (transaction === null || transaction === void 0 ? void 0 : transaction.hash) || null;
};
exports.createInternalTx = createInternalTx;
