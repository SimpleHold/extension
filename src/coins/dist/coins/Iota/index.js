"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importRecoveryPhrase = exports.generateAddress = exports.formatValue = exports.config = void 0;
const crypto_js_1 = require("@iota/crypto.js");
const iota_js_1 = require("@iota/iota.js");
const util_js_1 = require("@iota/util.js");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.config = {
    coins: ['miota'],
    wordsSize: [24],
    isWithPhrase: true,
    isInternalTx: true,
    isZeroFee: true,
};
const ten6 = new bignumber_js_1.default(10).pow(6);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten6));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten6));
};
exports.formatValue = formatValue;
const getAccount = (recoveryPhrase) => {
    const mnemonic = recoveryPhrase || crypto_js_1.Bip39.randomMnemonic();
    const baseSeed = iota_js_1.Ed25519Seed.fromMnemonic(mnemonic);
    const path = (0, iota_js_1.generateBip44Address)({
        accountIndex: 0,
        addressIndex: 0,
        isInternal: false,
    });
    const addressSeed = baseSeed.generateSeedFromPath(new crypto_js_1.Bip32Path(path));
    const addressKeyPair = addressSeed.keyPair();
    const indexEd25519Address = new iota_js_1.Ed25519Address(addressKeyPair.publicKey);
    const indexPublicKeyAddress = indexEd25519Address.toAddress();
    const address = iota_js_1.Bech32Helper.toBech32(iota_js_1.ED25519_ADDRESS_TYPE, indexPublicKeyAddress, 'iota');
    const privateKey = util_js_1.Converter.bytesToHex(addressKeyPair.privateKey);
    return {
        mnemonic,
        address,
        privateKey,
    };
};
const generateAddress = async () => {
    return getAccount();
};
exports.generateAddress = generateAddress;
const importRecoveryPhrase = async (recoveryPhrase) => {
    return getAccount(recoveryPhrase);
};
exports.importRecoveryPhrase = importRecoveryPhrase;
const getExplorerLink = (address) => {
    return `https://explorer.iota.org/mainnet/addr/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.iota.org/mainnet/message/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    return new RegExp('^(iota)[0-9a-z]{60}$').test(address);
};
exports.validateAddress = validateAddress;
const createInternalTx = async (props) => {
    const { mnemonic, addressTo, amount } = props;
    if (!mnemonic) {
        return null;
    }
    const client = new iota_js_1.SingleNodeClient('https://chrysalis-nodes.iota.org');
    const { messageId } = await (0, iota_js_1.send)(client, iota_js_1.Ed25519Seed.fromMnemonic(mnemonic), 0, addressTo, (0, exports.formatValue)(amount, 'to'));
    return messageId;
};
exports.createInternalTx = createInternalTx;
