"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const StellarSdk = __importStar(require("stellar-sdk"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const api_1 = require("../../utils/api");
const ten7 = new bignumber_js_1.default(10).pow(7);
const server = new StellarSdk.Server('https://horizon.stellar.org/');
exports.config = {
    coins: ['xlm'],
    isInternalTx: true,
    extraIdName: 'Memo',
};
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten7));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten7));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const keypair = StellarSdk.Keypair.random();
    const address = keypair.publicKey();
    const privateKey = keypair.secret();
    return {
        address,
        privateKey,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    return StellarSdk.Keypair.fromSecret(privateKey).publicKey();
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://stellar.expert/explorer/public/account/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://stellar.expert/explorer/public/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    try {
        return StellarSdk.StrKey.isValidEd25519PublicKey(address);
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
const getNetworkFee = async () => {
    try {
        return {
            networkFee: (0, exports.formatValue)(StellarSdk.BASE_FEE, 'from'),
        };
    }
    catch (_a) {
        return {
            networkFee: 0,
        };
    }
};
exports.getNetworkFee = getNetworkFee;
const createInternalTx = async ({ addressTo, amount, privateKey, extraId, }) => {
    if (!privateKey) {
        return null;
    }
    const sourceKeypair = StellarSdk.Keypair.fromSecret(privateKey);
    const sourcePublicKey = sourceKeypair.publicKey();
    const account = await server.loadAccount(sourcePublicKey);
    const params = {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.PUBLIC,
    };
    if (extraId) {
        params.memo = new StellarSdk.Memo('text', extraId);
    }
    let operation = StellarSdk.Operation.payment({
        destination: addressTo,
        asset: StellarSdk.Asset.native(),
        amount: `${amount}`,
    });
    const getToBalance = await (0, api_1.getBalance)(addressTo, 'stellar', undefined, undefined, true);
    if (getToBalance && getToBalance.balance < 1.00001) {
        operation = StellarSdk.Operation.createAccount({
            startingBalance: `${amount}`,
            destination: addressTo,
        });
    }
    const transaction = new StellarSdk.TransactionBuilder(account, params)
        .addOperation(operation)
        .setTimeout(30)
        .build();
    transaction.sign(sourceKeypair);
    const transactionResult = await server.submitTransaction(transaction);
    if (transactionResult) {
        return transactionResult.hash;
    }
    return null;
};
exports.createInternalTx = createInternalTx;
