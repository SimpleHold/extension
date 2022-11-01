"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.toNumber = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const flatMap_1 = __importDefault(require("lodash/flatMap"));
const api_1 = require("../../utils/api");
const format_1 = require("../../utils/format");
exports.config = {
    coins: ['neo'],
    isInternalTx: true,
};
const ten8 = new bignumber_js_1.default(10).pow(6);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten8));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten8));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const privateKey = neon_js_1.wallet.generatePrivateKey();
    const { address } = new neon_js_1.wallet.Account(privateKey);
    return {
        privateKey,
        address,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    const { address } = new neon_js_1.wallet.Account(privateKey);
    return address;
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://neoscan.io/address/${address}/1`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://neoscan.io/transaction/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return neon_js_1.wallet.isAddress(address);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    const { addressFrom, amount, symbol } = props;
    if (Number(amount) % 1 !== 0 && symbol === 'neo') {
        return {
            networkFee: 0,
        };
    }
    const currencyBalance = await (0, api_1.getBalance)(addressFrom, 'neo', 'gas');
    return {
        networkFee: 0.001,
        currencyBalance: (currencyBalance === null || currencyBalance === void 0 ? void 0 : currencyBalance.balance) || 0,
    };
};
exports.getNetworkFee = getNetworkFee;
const isToken = (symbol) => !['NEO', 'GAS'].includes(symbol);
const extractAssets = (sendEntries) => {
    return sendEntries.filter(({ symbol }) => !isToken(symbol));
};
const toNumber = (value) => {
    return new bignumber_js_1.default(String(value)).toNumber();
};
exports.toNumber = toNumber;
const buildIntents = (sendEntries) => {
    const assetEntries = extractAssets(sendEntries);
    return (0, flatMap_1.default)(assetEntries, ({ address, amount, symbol }) => neon_js_1.api.makeIntent({ [symbol]: (0, exports.toNumber)(amount) }, address));
};
const extractTokens = (sendEntries) => {
    return sendEntries.filter(({ symbol }) => isToken(symbol));
};
const buildTransferScript = (sendEntries, fromAddress, tokensBalanceMap) => {
    const tokenEntries = extractTokens(sendEntries);
    const fromAcct = new neon_js_1.wallet.Account(fromAddress);
    const scriptBuilder = new neon_js_1.sc.ScriptBuilder();
    tokenEntries.forEach(({ address, amount, symbol }) => {
        const toAcct = new neon_js_1.wallet.Account(address);
        const { scriptHash } = tokensBalanceMap[symbol];
        const args = [
            neon_js_1.u.reverseHex(fromAcct.scriptHash),
            neon_js_1.u.reverseHex(toAcct.scriptHash),
            neon_js_1.sc.ContractParam.byteArray((0, exports.toNumber)(amount), 'fixed8'),
        ];
        scriptBuilder.emitAppCall(scriptHash, 'transfer', args);
    });
    return scriptBuilder.str;
};
const createInternalTx = async (props) => {
    const { privateKey, addressTo, amount, addressFrom, symbol, contractAddress } = props;
    if (!privateKey) {
        return null;
    }
    const sendEntries = [
        {
            address: addressTo,
            amount,
            symbol: `${(0, format_1.toUpper)(symbol)}`,
        },
    ];
    const account = new neon_js_1.wallet.Account(privateKey);
    const tokensBalanceMap = {};
    const intents = buildIntents(sendEntries);
    if (!intents.length && contractAddress) {
        tokensBalanceMap[`${(0, format_1.toUpper)(symbol)}`] = {
            scriptHash: contractAddress,
        };
    }
    const script = buildTransferScript(sendEntries, addressFrom, tokensBalanceMap);
    const txConfig = {
        account,
        address: addressFrom,
        fees: 0.001,
        net: 'MainNet',
        privateKey,
        publicKey: account.publicKey,
        url: 'https://mainnet1.neo2.coz.io:443',
        intents,
    };
    if (!script.length) {
        const { response } = await neon_js_1.api.sendAsset(txConfig);
        // @ts-ignore
        return (response === null || response === void 0 ? void 0 : response.txid) || null;
    }
    txConfig.script = script;
    txConfig.gas = 0;
    const { response } = await neon_js_1.api.doInvoke(txConfig);
    // @ts-ignore
    return (response === null || response === void 0 ? void 0 : response.txid) || null;
};
exports.createInternalTx = createInternalTx;
