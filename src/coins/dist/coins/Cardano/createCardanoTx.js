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
const axios_1 = __importDefault(require("axios"));
const cbor = __importStar(require("borc"));
const cardano_crypto_js_1 = require("cardano-crypto.js");
const buffer_1 = require("buffer");
// Config
const config_1 = require("./config");
// Utils
const getNetworkFee_1 = require("./getNetworkFee");
const index_1 = require("./index");
const utils_1 = require("./utils");
const bn_1 = require("../../utils/bn");
const ShelleyTxAux = ({ inputs, outputs, fee, ttl, certificates, withdrawals, auxiliaryDataHash, auxiliaryData, validityIntervalStart, }) => {
    function getId() {
        return (0, cardano_crypto_js_1.blake2b)(cbor.encode(ShelleyTxAux({
            inputs,
            outputs,
            fee,
            ttl,
            certificates,
            withdrawals,
            auxiliaryDataHash,
            auxiliaryData,
            validityIntervalStart,
        })), 32).toString('hex');
    }
    function encodeCBOR(encoder) {
        const txBody = new Map();
        txBody.set(0 /* TxBodyKey.INPUTS */, (0, getNetworkFee_1.cborizeTxInputs)(inputs));
        txBody.set(1 /* TxBodyKey.OUTPUTS */, (0, getNetworkFee_1.cborizeTxOutputs)(outputs));
        txBody.set(2 /* TxBodyKey.FEE */, fee);
        if (ttl !== null) {
            txBody.set(3 /* TxBodyKey.TTL */, ttl);
        }
        if (certificates.length) {
            txBody.set(4 /* TxBodyKey.CERTIFICATES */, (0, getNetworkFee_1.cborizeTxCertificates)(certificates));
        }
        if (withdrawals.length) {
            txBody.set(5 /* TxBodyKey.WITHDRAWALS */, (0, getNetworkFee_1.cborizeTxWithdrawals)(withdrawals));
        }
        if (auxiliaryDataHash) {
            txBody.set(7 /* TxBodyKey.AUXILIARY_DATA_HASH */, buffer_1.Buffer.from(auxiliaryDataHash, 'hex'));
        }
        if (validityIntervalStart !== null) {
            txBody.set(8 /* TxBodyKey.VALIDITY_INTERVAL_START */, validityIntervalStart);
        }
        return encoder.pushAny(txBody);
    }
    return {
        getId,
        inputs,
        outputs,
        fee,
        ttl,
        certificates,
        withdrawals,
        auxiliaryDataHash,
        auxiliaryData,
        validityIntervalStart,
        encodeCBOR,
    };
};
const prepareTxAux = async (txPlan, ttl) => {
    const { inputs, outputs, change, fee, certificates, withdrawals } = txPlan;
    const changeOutputs = change.map((output) => (Object.assign(Object.assign({}, output), { isChange: true, spendingPath: config_1.shelleyPath, stakingPath: config_1.shelleyStakeAccountPath })));
    return ShelleyTxAux({
        inputs,
        outputs: [...outputs, ...changeOutputs],
        fee,
        ttl,
        certificates,
        withdrawals,
        auxiliaryDataHash: '',
        auxiliaryData: null,
        validityIntervalStart: null,
    });
};
const DummyAddressManager = () => {
    return {
        discoverAddresses: () => Promise.resolve([]),
        discoverAddressesWithMeta: () => Promise.resolve([]),
        getAddressToAbsPathMapping: () => ({}),
        _deriveAddress: () => Promise.resolve(null),
    };
};
const toBip32StringPath = (derivationPath) => {
    return `m/${derivationPath
        .map((item) => (item % config_1.HARDENED_THRESHOLD) + (item >= config_1.HARDENED_THRESHOLD ? "'" : ''))
        .join('/')}`;
};
async function _fetchBulkAddressInfo(addresses) {
    const { data } = await (0, axios_1.default)('https://explorer2.adalite.io/api/bulk/addresses/summary', {
        method: 'POST',
        data: JSON.stringify(addresses),
    });
    return 'Right' in data ? data.Right : undefined;
}
const isSomeAddressUsed = async (addresses) => {
    const addressInfos = await _fetchBulkAddressInfo(addresses);
    if (addressInfos) {
        return addressInfos.caTxNum > 0;
    }
    return false;
};
const range = function range(start = 0, stop) {
    return Array.from({ length: stop - start }, (x, i) => start + i);
};
function prepareTxHistoryEntry(tx, addresses) {
    const outputTokenBundle = [];
    const inputTokenBundle = [];
    let effect = 0; //effect on wallet balance accumulated
    for (const [address, amount] of tx.ctbInputs || []) {
        if (addresses.includes(address)) {
            effect -= +amount.getCoin;
            const parsedInputTokenBundle = amount.getTokens.map((token) => (0, getNetworkFee_1.parseToken)(token));
            inputTokenBundle.push(parsedInputTokenBundle);
        }
    }
    for (const [address, amount] of tx.ctbOutputs || []) {
        if (addresses.includes(address)) {
            effect += +amount.getCoin;
            const parsedOutputTokenBundle = amount.getTokens.map((token) => (0, getNetworkFee_1.parseToken)(token));
            outputTokenBundle.push(parsedOutputTokenBundle);
        }
    }
    return Object.assign(Object.assign({}, tx), { fee: parseInt(tx.fee, 10), effect: effect, tokenEffects: (0, getNetworkFee_1.getTokenBundlesDifference)((0, getNetworkFee_1.aggregateTokenBundles)(outputTokenBundle), (0, getNetworkFee_1.aggregateTokenBundles)(inputTokenBundle)) });
}
function filterValidTransactions(txs) {
    return txs.filter((tx) => tx.isValid);
}
async function getTxHistory(addresses) {
    const chunks = range(0, Math.ceil(addresses.length / 20));
    // @ts-ignore
    const cachedAddressInfos = (await Promise.all(chunks.map(async (index) => {
        const beginIndex = index * 20;
        return await _fetchBulkAddressInfo(addresses.slice(beginIndex, beginIndex + 20));
    }))).reduce(
    // @ts-ignore
    (acc, elem) => {
        return {
            // @ts-ignore
            caTxList: [...acc.caTxList, ...elem.caTxList],
        };
    }, { caTxList: [] });
    const filteredTxs = {};
    cachedAddressInfos.caTxList.forEach((tx) => {
        filteredTxs[tx.ctbId] = tx;
    });
    const txHistoryEntries = Object.values(filteredTxs).map((tx) => {
        return prepareTxHistoryEntry(tx, addresses);
    });
    const validTransactions = filterValidTransactions(txHistoryEntries);
    return validTransactions.sort((a, b) => b.ctbTimeIssued - a.ctbTimeIssued);
}
const filterUsedAddresses = async (addresses) => {
    const txHistory = await getTxHistory(addresses);
    const usedAddresses = new Set();
    txHistory.forEach((trx) => {
        (trx.ctbOutputs || []).forEach((output) => {
            usedAddresses.add(output[0]);
        });
        (trx.ctbInputs || []).forEach((input) => {
            usedAddresses.add(input[0]);
        });
    });
    return usedAddresses;
};
const AddressManager = ({ addressProvider, gapLimit }) => {
    const deriveAddressMemo = {};
    async function cachedDeriveAddress(index) {
        const memoKey = index;
        if (!deriveAddressMemo[memoKey]) {
            deriveAddressMemo[memoKey] = await addressProvider(index);
        }
        return deriveAddressMemo[memoKey].address;
    }
    async function deriveAddressesBlock(beginIndex, endIndex) {
        const derivedAddresses = [];
        for (let i = beginIndex; i < endIndex; i += 1) {
            derivedAddresses.push(await cachedDeriveAddress(i));
        }
        return derivedAddresses;
    }
    async function discoverAddresses() {
        let addresses = [];
        let from = 0;
        let isGapBlock = false;
        while (!isGapBlock) {
            const currentAddressBlock = await deriveAddressesBlock(from, from + gapLimit);
            isGapBlock = !(await isSomeAddressUsed(currentAddressBlock));
            addresses =
                isGapBlock && addresses.length > 0 ? addresses : addresses.concat(currentAddressBlock);
            from += gapLimit;
        }
        return addresses;
    }
    async function discoverAddressesWithMeta() {
        const addresses = await discoverAddresses();
        const usedAddresses = await filterUsedAddresses(addresses);
        return addresses.map((address) => {
            return {
                address,
                bip32StringPath: toBip32StringPath(getAddressToAbsPathMapping()[address]),
                isUsed: usedAddresses.has(address),
            };
        });
    }
    function getAddressToAbsPathMapping() {
        const result = {};
        Object.values(deriveAddressMemo).map((value) => {
            result[value.address] = value.path;
        });
        return result;
    }
    return {
        discoverAddresses,
        discoverAddressesWithMeta,
        getAddressToAbsPathMapping,
        _deriveAddress: cachedDeriveAddress,
        _deriveAddresses: deriveAddressesBlock,
    };
};
const shelleyStakeAccountPathFnc = (account) => {
    return [config_1.HARDENED_THRESHOLD + 1852, config_1.HARDENED_THRESHOLD + 1815, config_1.HARDENED_THRESHOLD + account, 2, 0];
};
const shelleyPathFnc = (account, isChange, addrIdx) => {
    return [
        config_1.HARDENED_THRESHOLD + 1852,
        config_1.HARDENED_THRESHOLD + 1815,
        config_1.HARDENED_THRESHOLD + account,
        isChange ? 1 : 0,
        addrIdx,
    ];
};
const encodeAddress = (address) => {
    const addressType = (0, cardano_crypto_js_1.getAddressType)(address);
    if (addressType === cardano_crypto_js_1.AddressTypes.BOOTSTRAP) {
        return cardano_crypto_js_1.base58.encode(address);
    }
    const addressPrefixes = {
        [cardano_crypto_js_1.AddressTypes.BASE]: 'addr',
        [cardano_crypto_js_1.AddressTypes.POINTER]: 'addr',
        [cardano_crypto_js_1.AddressTypes.ENTERPRISE]: 'addr',
        [cardano_crypto_js_1.AddressTypes.REWARD]: 'stake',
    };
    const isTestnet = (0, cardano_crypto_js_1.getShelleyAddressNetworkId)(address) === 0 /* NetworkId.TESTNET */;
    const addressPrefix = `${addressPrefixes[addressType]}${isTestnet ? '_test' : ''}`;
    return cardano_crypto_js_1.bech32.encode(addressPrefix, address);
};
const xpub2blake2b224Hash = (xpub) => (0, cardano_crypto_js_1.getPubKeyBlake2b224Hash)((0, utils_1.xpub2pub)(xpub));
const stakingAddressFromXpub = (stakeXpub, networkId) => {
    const addrBuffer = (0, cardano_crypto_js_1.packRewardAddress)(xpub2blake2b224Hash(stakeXpub), networkId);
    return encodeAddress(addrBuffer);
};
const ShelleyStakingAccountProvider = (cryptoProvider, accountIndex) => async () => {
    const pathStake = shelleyStakeAccountPathFnc(accountIndex);
    const stakeXpub = await cryptoProvider.deriveXpub(pathStake);
    return {
        path: pathStake,
        address: stakingAddressFromXpub(stakeXpub, cryptoProvider.network.networkId),
    };
};
const ShelleyBaseAddressProvider = (cryptoProvider, accountIndex, isChange) => async (i) => {
    const pathSpend = shelleyPathFnc(accountIndex, isChange, i);
    const spendXpub = await cryptoProvider.deriveXpub(pathSpend);
    const pathStake = shelleyStakeAccountPathFnc(accountIndex);
    const stakeXpub = await cryptoProvider.deriveXpub(pathStake);
    return {
        path: pathSpend,
        address: (0, utils_1.baseAddressFromXpub)(spendXpub, stakeXpub),
    };
};
const MyAddresses = ({ accountIndex, cryptoProvider, gapLimit }) => {
    const legacyExtManager = DummyAddressManager();
    const legacyIntManager = DummyAddressManager();
    const accountAddrManager = AddressManager({
        addressProvider: ShelleyStakingAccountProvider(cryptoProvider, accountIndex),
        gapLimit: 1,
    });
    const baseExtAddrManager = AddressManager({
        addressProvider: ShelleyBaseAddressProvider(cryptoProvider, accountIndex, false),
        gapLimit,
    });
    const baseIntAddrManager = AddressManager({
        addressProvider: ShelleyBaseAddressProvider(cryptoProvider, accountIndex, true),
        gapLimit,
    });
    function fixedPathMapper() {
        const mappingLegacy = Object.assign(Object.assign({}, legacyIntManager.getAddressToAbsPathMapping()), legacyExtManager.getAddressToAbsPathMapping());
        const mappingShelley = Object.assign(Object.assign(Object.assign({}, baseIntAddrManager.getAddressToAbsPathMapping()), baseExtAddrManager.getAddressToAbsPathMapping()), accountAddrManager.getAddressToAbsPathMapping());
        const fixedShelley = {};
        for (const key in mappingShelley) {
            fixedShelley[(0, getNetworkFee_1.bechAddressToHex)(key)] = mappingShelley[key];
        }
        return (address) => {
            return mappingLegacy[address] || fixedShelley[address] || mappingShelley[address];
        };
    }
    return {
        fixedPathMapper,
    };
};
const checkChange = (addressFrom, utxos, amount, fee) => {
    const totalAmount = (0, bn_1.plus)((0, index_1.formatValue)(amount, 'to'), (0, index_1.formatValue)(fee, 'to'));
    const mapUtxosAmount = utxos.map((utxo) => utxo.coins).reduce((a, b) => a + b, 0);
    if ((0, bn_1.minus)(mapUtxosAmount, totalAmount) !== 0) {
        return [
            {
                address: addressFrom,
                coins: (0, bn_1.minus)(mapUtxosAmount, totalAmount),
                isChange: false,
                tokenBundle: [],
            },
        ];
    }
    return [];
};
const getOutputs = (addressFrom, addressTo, amount, change, utxos) => {
    const data = [];
    let tokenTransferAmount = 0;
    const getTokenBundleUtxos = utxos.filter((utxo) => utxo.tokenBundle.length > 0);
    if (!change.length && getTokenBundleUtxos.length) {
        tokenTransferAmount = 1444443;
        for (const utxo of getTokenBundleUtxos) {
            data.push({
                address: addressFrom,
                coins: 1444443,
                isChange: false,
                tokenBundle: utxo.tokenBundle,
            });
        }
    }
    data.push({
        address: addressTo,
        coins: (0, bn_1.minus)((0, index_1.formatValue)(amount, 'to'), tokenTransferAmount),
        isChange: false,
        tokenBundle: [],
    });
    return data;
};
const createCardanoTx = async (props, ttl) => {
    const { mnemonic, utxos, addressTo, amount, addressFrom, fee } = props;
    if (!mnemonic) {
        return null;
    }
    const change = checkChange(addressFrom, utxos, amount, fee);
    const outputs = getOutputs(addressFrom, addressTo, amount, change, utxos);
    const txSummary = {
        address: addressTo,
        coins: +(0, index_1.formatValue)(amount, 'to'),
        fee: +(0, index_1.formatValue)(fee, 'to'),
        minimalLovelaceAmount: 0,
        plan: {
            additionalLovelaceAmount: 0,
            auxiliaryData: null,
            baseFee: +(0, index_1.formatValue)(fee, 'to'),
            certificates: [],
            change,
            deposit: 0,
            fee: +(0, index_1.formatValue)(fee, 'to'),
            inputs: utxos,
            outputs,
            withdrawals: [],
        },
        token: null,
        type: 'send',
    };
    const txAux = await prepareTxAux(txSummary.plan, ttl);
    const rootSecret = await (0, cardano_crypto_js_1.mnemonicToRootKeypair)(mnemonic, 2);
    const cryptoProvider = await (0, utils_1.getCryptoProvider)(rootSecret);
    const myAddresses = MyAddresses({
        accountIndex: 0,
        cryptoProvider,
        gapLimit: 20,
    });
    const { txBody } = await cryptoProvider.signTx(txAux, myAddresses.fixedPathMapper());
    return txBody;
};
exports.default = createCardanoTx;
