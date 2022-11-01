"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const casper_js_sdk_1 = require("casper-js-sdk");
exports.config = {
    coins: ['cspr'],
    isInternalTx: true,
    extraIdName: 'Transfer ID',
};
const ten9 = new bignumber_js_1.default(10).pow(9);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten9));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten9));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const newKeys = casper_js_sdk_1.Keys.Ed25519.new();
    const address = newKeys.publicKey.toHex();
    const privateKey = casper_js_sdk_1.Keys.Ed25519.parsePrivateKey(newKeys.privateKey).toString('hex');
    return {
        address,
        privateKey,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    const privateToPublicKey = casper_js_sdk_1.Keys.Ed25519.privateToPublicKey((0, casper_js_sdk_1.decodeBase16)(privateKey));
    const { publicKey } = casper_js_sdk_1.Keys.Ed25519.parseKeyPair(privateToPublicKey, (0, casper_js_sdk_1.decodeBase16)(privateKey));
    return publicKey.toHex();
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://cspr.live/account/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://cspr.live/deploy/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    try {
        casper_js_sdk_1.CLPublicKey.fromHex(address);
        return true;
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
const createInternalTx = async (props) => {
    const { amount, privateKey, addressTo, extraId } = props;
    if (!privateKey || !extraId) {
        return null;
    }
    const casperClient = new casper_js_sdk_1.CasperClient('https://node-clarity-mainnet.make.services/rpc');
    const privateToPublicKey = casper_js_sdk_1.Keys.Ed25519.privateToPublicKey((0, casper_js_sdk_1.decodeBase16)(privateKey));
    const signKeyPair = casper_js_sdk_1.Keys.Ed25519.parseKeyPair(privateToPublicKey, (0, casper_js_sdk_1.decodeBase16)(privateKey));
    const deployParams = new casper_js_sdk_1.DeployUtil.DeployParams(signKeyPair.publicKey, 'casper', 1, 1800000);
    const session = casper_js_sdk_1.DeployUtil.ExecutableDeployItem.newTransfer((0, exports.formatValue)(amount, 'to'), casper_js_sdk_1.CLPublicKey.fromHex(addressTo), null, extraId);
    const payment = casper_js_sdk_1.DeployUtil.standardPayment(100000000);
    const deploy = casper_js_sdk_1.DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = casper_js_sdk_1.DeployUtil.signDeploy(deploy, signKeyPair);
    return await casperClient.putDeploy(signedDeploy);
};
exports.createInternalTx = createInternalTx;
