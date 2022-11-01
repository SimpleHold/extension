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
exports.getTokenBundlesDifference = exports.cborizeTxWithdrawals = exports.cborizeTxOutputs = exports.cborizeTxInputs = exports.cborizeTxCertificates = exports.aggregateTokenBundles = exports.parseToken = exports.arraySum = exports.addressToHex = exports.base58AddressToHex = exports.bechAddressToHex = void 0;
const cardano_crypto_js_1 = require("cardano-crypto.js");
const cbor = __importStar(require("borc"));
const lodash_1 = __importDefault(require("lodash"));
const buffer_1 = require("buffer");
// Utils
const api_1 = require("../../utils/api");
// Types
const types_1 = require("./types");
const TX_WITNESS_SIZES = {
    byronv2: 139,
    shelley: 139,
    byronV1: 170,
};
const MAX_TX_SIZE = 16384;
const MIN_UTXO_VALUE = 1000000;
const MAX_TX_OUTPUT_SIZE = 4000;
const CATALYST_SIGNATURE_BYTE_LENGTH = 64;
const MAX_OUTPUT_TOKENS = 50;
const METADATA_HASH_BYTE_LENGTH = 32;
const getTokenBundle = async (output) => {
    const data = [];
    const getOutputTokens = output.ctaAmount.filter((i) => i.unit !== 'lovelace');
    if (getOutputTokens.length) {
        for (const token of getOutputTokens) {
            const { quantity, unit } = token;
            const assetInfo = await (0, api_1.getCardanoAsset)(unit);
            if (assetInfo) {
                const { asset_name, policy_id } = assetInfo;
                data.push({
                    assetName: asset_name,
                    policyId: policy_id,
                    quantity: Number(quantity),
                });
            }
        }
    }
    return data;
};
const formatUtxos = async (outputs, addressFrom) => {
    const data = [];
    for (const output of outputs) {
        const getLovelace = output.ctaAmount.find((i) => i.unit === 'lovelace');
        const tokenBundle = await getTokenBundle(output);
        data.push({
            address: addressFrom,
            coins: getLovelace ? Number(getLovelace.quantity) : 0,
            outputIndex: output.ctaTxIndex,
            tokenBundle,
            txHash: output.ctaTxHash,
        });
    }
    return data;
};
const isBase = (address) => {
    return (0, cardano_crypto_js_1.getAddressType)(buffer_1.Buffer.from(address, 'hex')) === cardano_crypto_js_1.AddressTypes.BASE;
};
const isShelleyFormat = (address) => {
    return address.startsWith('addr') || address.startsWith('stake');
};
const bechAddressToHex = (address) => {
    const parsed = cardano_crypto_js_1.bech32.decode(address);
    return parsed.data.toString('hex');
};
exports.bechAddressToHex = bechAddressToHex;
const base58AddressToHex = (address) => {
    const parsed = cardano_crypto_js_1.base58.decode(address);
    return parsed.toString('hex');
};
exports.base58AddressToHex = base58AddressToHex;
const addressToHex = (address) => {
    return isShelleyFormat(address) ? (0, exports.bechAddressToHex)(address) : (0, exports.base58AddressToHex)(address);
};
exports.addressToHex = addressToHex;
const arrangeUtxos = (utxos) => {
    const sortedUtxos = utxos.sort((a, b) => a.txHash === b.txHash ? a.outputIndex - b.outputIndex : a.txHash.localeCompare(b.txHash));
    const nonStakingUtxos = sortedUtxos.filter(({ address }) => !isBase((0, exports.addressToHex)(address)));
    const baseAddressUtxos = sortedUtxos.filter(({ address }) => isBase((0, exports.addressToHex)(address)));
    const adaOnlyUtxos = baseAddressUtxos.filter(({ tokenBundle }) => (tokenBundle === null || tokenBundle === void 0 ? void 0 : tokenBundle.length) === 0);
    const tokenUtxos = baseAddressUtxos.filter(({ tokenBundle }) => tokenBundle.length > 0);
    return [...nonStakingUtxos, ...adaOnlyUtxos, ...tokenUtxos];
};
const arraySum = (numbers) => numbers.reduce((acc, val) => acc + val, 0);
exports.arraySum = arraySum;
const parseToken = (token) => (Object.assign(Object.assign({}, token), { quantity: parseInt(token.quantity, 10) }));
exports.parseToken = parseToken;
const orderTokenBundle = (tokenBundle) => {
    const compareStringsCanonically = (string1, string2) => string1.length - string2.length || string1.localeCompare(string2);
    return (0, lodash_1.default)(tokenBundle)
        .orderBy(['policyId', 'assetName'], ['asc', 'asc'])
        .groupBy(({ policyId }) => policyId)
        .mapValues((tokens) => tokens.map(({ assetName, quantity }) => ({ assetName, quantity })))
        .map((tokens, policyId) => ({
        policyId,
        assets: tokens.sort((token1, token2) => compareStringsCanonically(token1.assetName, token2.assetName)),
    }))
        .sort((token1, token2) => compareStringsCanonically(token1.policyId, token2.policyId))
        .value();
};
const cborizeTxOutputTokenBundle = (tokenBundle) => {
    const policyIdMap = new Map();
    const orderedTokenBundle = orderTokenBundle(tokenBundle);
    orderedTokenBundle.forEach(({ policyId, assets }) => {
        const assetMap = new Map();
        assets.forEach(({ assetName, quantity }) => {
            assetMap.set(buffer_1.Buffer.from(assetName, 'hex'), quantity);
        });
        policyIdMap.set(buffer_1.Buffer.from(policyId, 'hex'), assetMap);
    });
    return policyIdMap;
};
const cborizeSingleTxOutput = (output) => {
    const amount = output.tokenBundle.length > 0
        ? [output.coins, cborizeTxOutputTokenBundle(output.tokenBundle)]
        : output.coins;
    const addressBuff = isShelleyFormat(output.address)
        ? cardano_crypto_js_1.bech32.decode(output.address).data
        : cardano_crypto_js_1.base58.decode(output.address);
    return [addressBuff, amount];
};
const aggregateTokenBundlesForPolicy = (policyGroup, policyId) => {
    return (0, lodash_1.default)(policyGroup)
        .groupBy(({ assetName }) => assetName)
        .map((assetGroup, assetName) => (0, exports.parseToken)({
        policyId,
        assetName,
        quantity: `${(0, exports.arraySum)(assetGroup.map((asset) => asset.quantity))}`,
    }))
        .value();
};
const aggregateTokenBundles = (tokenBundle) => {
    return (0, lodash_1.default)(tokenBundle)
        .filter((token) => !!token.length)
        .flatten()
        .groupBy(({ policyId }) => policyId)
        .map(aggregateTokenBundlesForPolicy)
        .flatten()
        .value();
};
exports.aggregateTokenBundles = aggregateTokenBundles;
const distinct = (array) => Array.from(new Set(array));
const computeMinUTxOLovelaceAmount = (tokenBundle) => {
    const quot = (x, y) => Math.floor(x / y);
    const roundupBytesToWords = (x) => quot(x + 7, 8);
    const minUTxOValue = 1000000;
    const coinSize = 0;
    const txOutLenNoVal = 14;
    const txInLen = 7;
    const utxoEntrySizeWithoutVal = 6 + txOutLenNoVal + txInLen;
    const adaOnlyUtxoSize = utxoEntrySizeWithoutVal + coinSize;
    const aggregatedTokenBundle = (0, exports.aggregateTokenBundles)([tokenBundle]);
    const distinctAssets = aggregatedTokenBundle.map(({ assetName }) => assetName);
    const numAssets = distinctAssets.length;
    const numPIDs = distinct(aggregatedTokenBundle.map(({ policyId }) => policyId)).length;
    const sumAssetNameLengths = distinctAssets.reduce((acc, assetName) => acc + Math.max(buffer_1.Buffer.from(assetName, 'hex').byteLength, 1), 0);
    const policyIdSize = 28;
    const size = 6 + roundupBytesToWords(numAssets * 12 + sumAssetNameLengths + numPIDs * policyIdSize);
    if (aggregatedTokenBundle.length === 0) {
        return minUTxOValue;
    }
    else {
        return Math.max(minUTxOValue, quot(minUTxOValue, adaOnlyUtxoSize) * (utxoEntrySizeWithoutVal + size));
    }
};
const prepareTxPlanDraft = (address, coins) => {
    return {
        outputs: [
            {
                isChange: false,
                address,
                coins,
                tokenBundle: [],
            },
        ],
        certificates: [],
        withdrawals: [],
        auxiliaryData: null,
    };
};
const validateTxPlan = (txPlanResult) => {
    if (txPlanResult.success === false) {
        return txPlanResult;
    }
    const { txPlan } = txPlanResult;
    const { change, outputs, withdrawals, fee, additionalLovelaceAmount, certificates, deposit, baseFee, } = txPlan;
    const noTxPlan = {
        success: false,
        error: null,
        estimatedFee: fee,
        deposit,
        minimalLovelaceAmount: additionalLovelaceAmount,
    };
    const outputsWithChange = [...outputs, ...change];
    if (outputsWithChange.some(({ coins, tokenBundle }) => {
        coins > Number.MAX_SAFE_INTEGER ||
            tokenBundle.some(({ quantity }) => quantity > Number.MAX_SAFE_INTEGER);
    })) {
        throw new Error('');
    }
    if (change.some(({ coins, tokenBundle }) => coins < computeMinUTxOLovelaceAmount(tokenBundle))) {
        return Object.assign(Object.assign({}, noTxPlan), { error: { code: 1 } });
    }
    if (outputs.some(({ coins, tokenBundle }) => coins < computeMinUTxOLovelaceAmount(tokenBundle))) {
        return Object.assign(Object.assign({}, noTxPlan), { error: { code: 2 } });
    }
    if (outputsWithChange.some((output) => cbor.encode(cborizeSingleTxOutput(output)).length > MAX_TX_OUTPUT_SIZE)) {
        return noTxPlan;
    }
    const totalRewards = withdrawals.reduce((acc, { rewards }) => acc + rewards, 0);
    const isDeregisteringStakeKey = certificates.some((c) => c.type === types_1.CertificateType.STAKING_KEY_DEREGISTRATION);
    if (!isDeregisteringStakeKey &&
        ((totalRewards > 0 && totalRewards < fee) || (totalRewards > 0 && fee > baseFee))) {
        return Object.assign(Object.assign({}, noTxPlan), { error: true });
    }
    return txPlanResult;
};
const computeRequiredDeposit = (certificates) => {
    const CertificateDeposit = {
        [types_1.CertificateType.DELEGATION]: 0,
        [types_1.CertificateType.STAKEPOOL_REGISTRATION]: 500000000,
        [types_1.CertificateType.STAKING_KEY_REGISTRATION]: 2000000,
        [types_1.CertificateType.STAKING_KEY_DEREGISTRATION]: -2000000,
    };
    return certificates.reduce((acc, { type }) => acc + CertificateDeposit[type], 0);
};
const createTokenChangeOutputs = (changeAddress, changeTokenBundle, maxOutputTokens) => {
    const nOutputs = Math.ceil(changeTokenBundle.length / maxOutputTokens);
    const outputs = [];
    for (let i = 0; i < nOutputs; i++) {
        const tokenBundle = changeTokenBundle.slice(i * maxOutputTokens, (i + 1) * maxOutputTokens);
        outputs.push({
            isChange: false,
            address: changeAddress,
            coins: computeMinUTxOLovelaceAmount(tokenBundle),
            tokenBundle,
        });
    }
    return outputs;
};
const txFeeFunction = (txSizeInBytes) => {
    const a = 155381;
    const b = 43.946;
    return Math.ceil(a + txSizeInBytes * b);
};
const cborizeTxVotingRegistration = ({ votingPubKey, stakePubKey, rewardDestinationAddress, nonce, }) => [
    61284,
    new Map([
        [1, buffer_1.Buffer.from(votingPubKey, 'hex')],
        [2, buffer_1.Buffer.from(stakePubKey, 'hex')],
        [3, cardano_crypto_js_1.bech32.decode(rewardDestinationAddress.address).data],
        [4, Number(nonce)],
    ]),
];
const cborizeTxAuxiliaryVotingData = (txAuxiliaryData, signatureHex) => [
    new Map([
        cborizeTxVotingRegistration(txAuxiliaryData),
        [61285, new Map([[1, buffer_1.Buffer.from(signatureHex, 'hex')]])],
    ]),
    [],
];
const estimateAuxiliaryDataSize = (auxiliaryData) => {
    switch (auxiliaryData.type) {
        case 'CATALYST_VOTING': {
            const placeholderMetaSignature = 'x'.repeat(CATALYST_SIGNATURE_BYTE_LENGTH * 2);
            return cbor.encode(cborizeTxAuxiliaryVotingData(auxiliaryData, placeholderMetaSignature))
                .length;
        }
        default:
            return null;
    }
};
const cborizeStakingKeyRegistrationCert = (certificate) => {
    const stakingKeyHash = cardano_crypto_js_1.bech32.decode(certificate.stakingAddress).data.slice(1);
    const stakeCredential = [
        types_1.TxStakeCredentialType.ADDR_KEYHASH,
        stakingKeyHash,
    ];
    return [0 /* TxCertificateKey.STAKING_KEY_REGISTRATION */, stakeCredential];
};
const cborizeStakingKeyDeregistrationCert = (certificate) => {
    const stakingKeyHash = cardano_crypto_js_1.bech32.decode(certificate.stakingAddress).data.slice(1);
    const stakeCredential = [
        types_1.TxStakeCredentialType.ADDR_KEYHASH,
        stakingKeyHash,
    ];
    return [1 /* TxCertificateKey.STAKING_KEY_DEREGISTRATION */, stakeCredential];
};
const cborizeDelegationCert = (certificate) => {
    const stakingKeyHash = cardano_crypto_js_1.bech32.decode(certificate.stakingAddress).data.slice(1);
    const stakeCredential = [
        types_1.TxStakeCredentialType.ADDR_KEYHASH,
        stakingKeyHash,
    ];
    const poolHash = buffer_1.Buffer.from(certificate.poolHash, 'hex');
    return [2 /* TxCertificateKey.DELEGATION */, stakeCredential, poolHash];
};
const ipv4AddressToBuf = (ipv4Address) => {
    const splitAddressNumbers = ipv4Address.split('.').map((x) => +x);
    return buffer_1.Buffer.from(splitAddressNumbers);
};
const ipv6AddressToBuf = (ipv6Address) => {
    const ipv6NoSemicolons = ipv6Address.replace(/:/g, '');
    const ipv6Buf = buffer_1.Buffer.from(ipv6NoSemicolons, 'hex');
    const copy = buffer_1.Buffer.from(ipv6Buf);
    const endianSwappedBuf = copy.swap32();
    return endianSwappedBuf;
};
const cborizeStakepoolRegistrationCert = (certificate) => {
    const { poolRegistrationParams } = certificate;
    return [
        3 /* TxCertificateKey.STAKEPOOL_REGISTRATION */,
        buffer_1.Buffer.from(poolRegistrationParams.poolKeyHashHex, 'hex'),
        buffer_1.Buffer.from(poolRegistrationParams.vrfKeyHashHex, 'hex'),
        parseInt(poolRegistrationParams.pledgeStr, 10),
        parseInt(poolRegistrationParams.costStr, 10),
        new cbor.Tagged(30, [
            parseInt(poolRegistrationParams.margin.numeratorStr, 10),
            parseInt(poolRegistrationParams.margin.denominatorStr, 10),
        ], null),
        buffer_1.Buffer.from(poolRegistrationParams.rewardAccountHex, 'hex'),
        poolRegistrationParams.poolOwners.map((ownerObj) => {
            return buffer_1.Buffer.from(ownerObj.stakingKeyHashHex, 'hex');
        }),
        poolRegistrationParams.relays.map((relay) => {
            switch (relay.type) {
                case 0 /* TxRelayType.SINGLE_HOST_IP */:
                    return [
                        relay.type,
                        relay.params.portNumber,
                        relay.params.ipv4 ? ipv4AddressToBuf(relay.params.ipv4) : null,
                        relay.params.ipv6 ? ipv6AddressToBuf(relay.params.ipv6) : null,
                    ];
                case 1 /* TxRelayType.SINGLE_HOST_NAME */:
                    return [relay.type, relay.params.portNumber, relay.params.dnsName];
                case 2 /* TxRelayType.MULTI_HOST_NAME */:
                    return [relay.type, relay.params.dnsName];
                default:
                    return [];
            }
        }),
        poolRegistrationParams.metadata
            ? [
                poolRegistrationParams.metadata.metadataUrl,
                buffer_1.Buffer.from(poolRegistrationParams.metadata.metadataHashHex, 'hex'),
            ]
            : null,
    ];
};
const cborizeTxCertificates = (certificates) => {
    const txCertificates = certificates.map((certificate) => {
        switch (certificate.type) {
            case types_1.CertificateType.STAKING_KEY_REGISTRATION:
                return cborizeStakingKeyRegistrationCert(certificate);
            case types_1.CertificateType.STAKING_KEY_DEREGISTRATION:
                return cborizeStakingKeyDeregistrationCert(certificate);
            case types_1.CertificateType.DELEGATION:
                return cborizeDelegationCert(certificate);
            case types_1.CertificateType.STAKEPOOL_REGISTRATION:
                return cborizeStakepoolRegistrationCert(certificate);
            default:
                return cborizeStakingKeyRegistrationCert(certificate);
        }
    });
    return txCertificates;
};
exports.cborizeTxCertificates = cborizeTxCertificates;
const cborizeTxInputs = (inputs) => {
    const txInputs = inputs.map(({ txHash, outputIndex }) => {
        const txId = buffer_1.Buffer.from(txHash, 'hex');
        return [txId, outputIndex];
    });
    return txInputs;
};
exports.cborizeTxInputs = cborizeTxInputs;
const cborizeTxOutputs = (outputs) => {
    return outputs.map(cborizeSingleTxOutput);
};
exports.cborizeTxOutputs = cborizeTxOutputs;
const cborizeTxWithdrawals = (withdrawals) => {
    const txWithdrawals = new Map();
    withdrawals.forEach((withdrawal) => {
        const stakingAddress = cardano_crypto_js_1.bech32.decode(withdrawal.stakingAddress).data;
        txWithdrawals.set(stakingAddress, withdrawal.rewards);
    });
    return txWithdrawals;
};
exports.cborizeTxWithdrawals = cborizeTxWithdrawals;
const isV1Address = (address) => address.startsWith('D');
const estimateTxSize = (inputs, outputs, certificates, withdrawals, auxiliaryData) => {
    const txInputsSize = cbor.encode((0, exports.cborizeTxInputs)(inputs)).length + 1;
    const txOutputs = outputs.map((output) => ({
        isChange: false,
        address: output.address,
        coins: Number.MAX_SAFE_INTEGER,
        tokenBundle: output.tokenBundle,
    }));
    const txOutputsSize = cbor.encode((0, exports.cborizeTxOutputs)(txOutputs)).length + 1;
    const txCertificatesSize = cbor.encode((0, exports.cborizeTxCertificates)(certificates)).length + 1;
    const txWithdrawalsSize = cbor.encode((0, exports.cborizeTxWithdrawals)(withdrawals)).length + 1;
    const txTllSize = cbor.encode(Number.MAX_SAFE_INTEGER).length + 1;
    const txFeeSize = cbor.encode(Number.MAX_SAFE_INTEGER).length + 1;
    const txAuxiliaryDataHashSize = auxiliaryData
        ? cbor.encode('x'.repeat(METADATA_HASH_BYTE_LENGTH * 2)).length + 1
        : 0;
    const txAuxSize = txInputsSize +
        txOutputsSize +
        txCertificatesSize +
        txWithdrawalsSize +
        txFeeSize +
        txTllSize +
        txAuxiliaryDataHashSize;
    const shelleyInputs = inputs.filter(({ address }) => isShelleyFormat(address));
    const byronInputs = inputs.filter(({ address }) => !isShelleyFormat(address));
    const shelleyWitnessesSize = (withdrawals.length + certificates.length + shelleyInputs.length) * TX_WITNESS_SIZES.shelley;
    const byronWitnessesSize = byronInputs.reduce((acc, { address }) => {
        const witnessSize = isV1Address(address) ? TX_WITNESS_SIZES.byronV1 : TX_WITNESS_SIZES.byronv2;
        return acc + witnessSize;
    }, 0);
    const txWitnessesSize = shelleyWitnessesSize + byronWitnessesSize;
    const txAuxiliaryDataEstimate = auxiliaryData ? estimateAuxiliaryDataSize(auxiliaryData) + 1 : 0;
    const txAuxiliaryDataSize = txAuxiliaryDataEstimate + 1;
    const txSizeInBytes = 1 + txAuxSize + txWitnessesSize + txAuxiliaryDataSize;
    if (txSizeInBytes > MAX_TX_SIZE) {
        return null;
    }
    const slack = 1;
    return txSizeInBytes + slack;
};
const getTokenBundlesDifference = (tokenBundle1, tokenBundle2) => {
    const negativeTokenBundle = tokenBundle2.map((token) => (Object.assign(Object.assign({}, token), { quantity: -token.quantity })));
    return (0, exports.aggregateTokenBundles)([tokenBundle1, negativeTokenBundle]).filter((token) => token.quantity !== 0);
};
exports.getTokenBundlesDifference = getTokenBundlesDifference;
const computeRequiredTxFee = (inputs, outputs, certificates = [], withdrawals = [], auxiliaryData = null) => {
    return txFeeFunction(estimateTxSize(inputs, outputs, certificates, withdrawals, auxiliaryData));
};
const computeTxPlan = (inputs, outputs, possibleChange, certificates, withdrawals, auxiliaryData) => {
    const totalRewards = withdrawals.reduce((acc, { rewards }) => acc + rewards, 0);
    const totalInput = inputs.reduce((acc, input) => acc + input.coins, 0) + totalRewards;
    const totalInputTokens = (0, exports.aggregateTokenBundles)(
    // @ts-ignore
    inputs.map(({ tokenBundle }) => tokenBundle));
    const deposit = computeRequiredDeposit(certificates);
    const totalOutput = outputs.reduce((acc, { coins }) => acc + coins, 0) + deposit;
    const totalOutputTokens = (0, exports.aggregateTokenBundles)(outputs.map(({ tokenBundle }) => tokenBundle));
    const additionalLovelaceAmount = outputs.reduce((acc, { coins, tokenBundle }) => (tokenBundle.length > 0 ? acc + coins : acc), 0);
    const feeWithoutChange = computeRequiredTxFee(inputs, outputs, certificates, withdrawals, auxiliaryData);
    const tokenDifference = (0, exports.getTokenBundlesDifference)(totalInputTokens, totalOutputTokens);
    const isTokenDifferenceEmpty = tokenDifference.length === 0 || tokenDifference.every(({ quantity }) => quantity === 0);
    if (tokenDifference.some(({ quantity }) => quantity < 0)) {
        return {
            success: false,
            minimalLovelaceAmount: additionalLovelaceAmount,
            estimatedFee: feeWithoutChange,
            deposit,
            error: true,
        };
    }
    const remainingNoChangeLovelace = totalInput - totalOutput;
    if (inputs.length === 0 || remainingNoChangeLovelace < 0) {
        return {
            success: false,
            minimalLovelaceAmount: additionalLovelaceAmount,
            estimatedFee: feeWithoutChange,
            deposit,
            error: { code: 3 },
        };
    }
    if (isTokenDifferenceEmpty && remainingNoChangeLovelace === 0) {
        return {
            success: true,
            txPlan: {
                inputs,
                outputs,
                change: [],
                certificates,
                deposit,
                additionalLovelaceAmount,
                fee: feeWithoutChange,
                baseFee: feeWithoutChange,
                withdrawals,
                auxiliaryData,
            },
        };
    }
    const adaOnlyChangeOutput = {
        isChange: false,
        address: possibleChange.address,
        coins: 0,
        tokenBundle: [],
    };
    const feeWithAdaOnlyChange = computeRequiredTxFee(inputs, [...outputs, adaOnlyChangeOutput], certificates, withdrawals, auxiliaryData);
    const remainingAdaOnlyChangeLovelace = totalInput - totalOutput - feeWithAdaOnlyChange;
    if (isTokenDifferenceEmpty && remainingAdaOnlyChangeLovelace < MIN_UTXO_VALUE) {
        return {
            success: true,
            txPlan: {
                inputs,
                outputs,
                change: [],
                certificates,
                deposit,
                additionalLovelaceAmount,
                fee: totalInput - totalOutput,
                baseFee: feeWithoutChange,
                withdrawals,
                auxiliaryData,
            },
        };
    }
    if (isTokenDifferenceEmpty) {
        return {
            success: true,
            txPlan: {
                inputs,
                outputs,
                change: [Object.assign(Object.assign({}, adaOnlyChangeOutput), { coins: remainingAdaOnlyChangeLovelace })],
                certificates,
                deposit,
                additionalLovelaceAmount,
                fee: feeWithAdaOnlyChange,
                baseFee: feeWithAdaOnlyChange,
                withdrawals,
                auxiliaryData,
            },
        };
    }
    const tokenChangeOutputs = createTokenChangeOutputs(possibleChange.address, tokenDifference, MAX_OUTPUT_TOKENS);
    const feeWithTokenChange = computeRequiredTxFee(inputs, [...outputs, ...tokenChangeOutputs], certificates, withdrawals, auxiliaryData);
    const remainingTokenChangeLovelace = totalInput - totalOutput;
    if (remainingTokenChangeLovelace < 0) {
        return {
            success: false,
            minimalLovelaceAmount: additionalLovelaceAmount,
            estimatedFee: feeWithTokenChange,
            deposit,
            error: true,
        };
    }
    if (remainingTokenChangeLovelace > MIN_UTXO_VALUE) {
        const feeWithAdaAndTokenChange = computeRequiredTxFee(inputs, [...outputs, ...tokenChangeOutputs, adaOnlyChangeOutput], certificates, withdrawals, auxiliaryData);
        const adaOnlyChangeOutputLovelace = remainingTokenChangeLovelace - (feeWithAdaAndTokenChange - feeWithTokenChange);
        return {
            success: true,
            txPlan: {
                inputs,
                outputs,
                change: [
                    Object.assign(Object.assign({}, adaOnlyChangeOutput), { coins: adaOnlyChangeOutputLovelace }),
                    ...tokenChangeOutputs,
                ],
                certificates,
                deposit,
                additionalLovelaceAmount,
                fee: feeWithAdaAndTokenChange,
                baseFee: feeWithAdaAndTokenChange,
                withdrawals,
                auxiliaryData,
            },
        };
    }
    const firstChangeOutput = Object.assign(Object.assign({}, tokenChangeOutputs[0]), { coins: tokenChangeOutputs[0].coins + remainingTokenChangeLovelace });
    return {
        success: true,
        txPlan: {
            inputs,
            outputs,
            change: tokenChangeOutputs.map((output, i) => (i === 0 ? firstChangeOutput : output)),
            certificates,
            deposit,
            additionalLovelaceAmount,
            fee: feeWithTokenChange,
            baseFee: feeWithTokenChange,
            withdrawals,
            auxiliaryData,
        },
    };
};
const selectMinimalTxPlan = (utxos, changeAddress, address, coins) => {
    const { outputs, certificates, withdrawals, auxiliaryData } = prepareTxPlanDraft(address, coins);
    const change = {
        isChange: false,
        address: changeAddress,
        coins: 0,
        tokenBundle: [],
    };
    let txPlanResult = null;
    let numInputs = 0;
    while (numInputs <= utxos.length) {
        const inputs = utxos.slice(0, numInputs);
        txPlanResult = validateTxPlan(computeTxPlan(inputs, outputs, change, certificates, withdrawals, auxiliaryData));
        if (txPlanResult.success === true) {
            if (txPlanResult.txPlan.baseFee === txPlanResult.txPlan.fee || numInputs === utxos.length) {
                return txPlanResult;
            }
        }
        numInputs += 1;
    }
    return txPlanResult;
};
const getNetworkFee = async (amount, addressFrom, addressTo, outputs) => {
    const utxos = await formatUtxos(outputs, addressFrom);
    const arrangedUtxos = arrangeUtxos(utxos);
    return selectMinimalTxPlan(arrangedUtxos, addressFrom, addressTo, amount);
};
exports.default = getNetworkFee;
