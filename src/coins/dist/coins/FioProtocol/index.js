"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const fiosdk_1 = require("@fioprotocol/fiosdk");
const node_fetch_1 = __importDefault(require("node-fetch"));
const Transactions_1 = require("@fioprotocol/fiosdk/lib/transactions/Transactions");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const api_1 = require("../../utils/api");
const format_1 = require("../../utils/format");
exports.config = {
    coins: ['fio'],
    isInternalTx: true,
};
const ten9 = new bignumber_js_1.default(10).pow(9);
const baseUrl = 'https://fio.blockpane.com/v1/';
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten9));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten9));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const privateKey = await fiojs_1.Ecc.randomKey();
    const address = fiojs_1.Ecc.PrivateKey.fromString(privateKey).toPublic().toString();
    return {
        address,
        privateKey,
    };
};
exports.generateAddress = generateAddress;
const importPrivateKey = async (privateKey) => {
    return fiojs_1.Ecc.PrivateKey.fromString(privateKey).toPublic().toString();
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://fio.bloks.io/key/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://fio.bloks.io/transaction/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const isFioAddress = (address) => {
    return new RegExp('^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))@[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))$)').test(address);
};
const validateAddress = (address) => {
    return fiojs_1.Ecc.PublicKey.isValid(address) || isFioAddress(`${(0, format_1.toLower)(address)}`);
};
exports.validateAddress = validateAddress;
const getNetworkFee = async (props) => {
    const { addressFrom, amount, chain } = props;
    return await (0, api_1.getNetworkFeeRequest)(chain, addressFrom, amount);
};
exports.getNetworkFee = getNetworkFee;
const fetchJson = async (uri, opts = {}) => {
    return (0, node_fetch_1.default)(uri, opts);
};
const getPubKey = async (fio_address) => {
    try {
        const request = await (0, api_1.sendRequest)({
            url: `${baseUrl}chain/get_pub_address`,
            method: 'POST',
            data: {
                chain_code: 'FIO',
                token_code: 'FIO',
                fio_address,
            },
            skipNestedData: true,
        });
        if (request === null || request === void 0 ? void 0 : request.public_address) {
            return request.public_address;
        }
        return null;
    }
    catch (_a) {
        return null;
    }
};
const createInternalTx = async (props) => {
    const { addressFrom, amount, privateKey, networkFee } = props;
    let addressTo = props.addressTo;
    if (privateKey) {
        if (isFioAddress(`${(0, format_1.toLower)(addressTo)}`)) {
            const fromPubKey = await getPubKey(addressTo);
            if (fromPubKey) {
                addressTo = fromPubKey;
            }
            else {
                return null;
            }
        }
        const data = {
            payee_public_key: addressTo,
            amount: (0, exports.formatValue)(amount, 'to'),
            max_fee: (0, exports.formatValue)(networkFee, 'to'),
            tpid: '',
        };
        const user = new fiosdk_1.FIOSDK('', '', baseUrl, fetchJson);
        const chainData = await user.transactions.getChainDataForTx();
        const transaction = await user.transactions.createRawTransaction({
            action: 'trnsfiopubky',
            account: 'fio.token',
            data: data,
            publicKey: addressFrom,
            chainData,
        });
        const { serializedContextFreeData, serializedTransaction } = await user.transactions.serialize({
            chainId: chainData.chain_id,
            transaction,
        });
        const transactions = new Transactions_1.Transactions();
        const signedTransaction = await transactions.sign({
            chainId: chainData.chain_id,
            privateKeys: [privateKey],
            transaction,
            serializedTransaction,
            serializedContextFreeData,
        });
        const { transaction_id } = await user.executePreparedTrx('transfer_tokens_pub_key', signedTransaction);
        return transaction_id;
    }
    return null;
};
exports.createInternalTx = createInternalTx;
