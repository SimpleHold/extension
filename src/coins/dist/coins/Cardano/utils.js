"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseAddressFromXpub = exports.xpub2pub = exports.getCryptoProvider = void 0;
const cardano_crypto_js_1 = require("cardano-crypto.js");
const buffer_1 = require("buffer");
const borc_1 = require("borc");
// Config
const config_1 = require("./config");
const _HdNode = ({ secretKey, publicKey, chainCode }) => {
    const extendedPublicKey = buffer_1.Buffer.concat([publicKey, chainCode], 64);
    function toBuffer() {
        return buffer_1.Buffer.concat([secretKey, extendedPublicKey]);
    }
    function toString() {
        return toBuffer().toString('hex');
    }
    return {
        secretKey,
        publicKey,
        chainCode,
        extendedPublicKey,
        toBuffer,
        toString,
    };
};
const HdNode = (secret) => {
    const secretKey = secret.slice(0, 64);
    const publicKey = secret.slice(64, 96);
    const chainCode = secret.slice(96, 128);
    return _HdNode({ secretKey, publicKey, chainCode });
};
const indexIsHardened = (index) => {
    return index >= config_1.HARDENED_THRESHOLD;
};
const isShelleyPath = (path) => {
    return path[0] - config_1.HARDENED_THRESHOLD === 1852;
};
const CachedDeriveXpubFactory = (shouldExportPubKeyBulk, deriveXpubsHardenedFn) => {
    const derivedXpubs = {};
    async function deriveXpub(absDerivationPath) {
        const memoKey = JSON.stringify(absDerivationPath);
        if (!derivedXpubs[memoKey]) {
            const deriveHardened = absDerivationPath.length === 0 || indexIsHardened(absDerivationPath.slice(-1)[0]);
            if (deriveHardened) {
                const derivationPaths = shouldExportPubKeyBulk && isShelleyPath(absDerivationPath)
                    ? createPathBulk(absDerivationPath)
                    : [absDerivationPath];
                const pubKeys = await _deriveXpubsHardenedFn(derivationPaths);
                Object.assign(derivedXpubs, pubKeys);
            }
            else {
                derivedXpubs[memoKey] = await deriveXpubNonhardenedFn(absDerivationPath);
            }
        }
        return derivedXpubs[memoKey];
    }
    async function deriveXpubNonhardenedFn(derivationPath) {
        const lastIndex = derivationPath.slice(-1)[0];
        const parentXpub = await deriveXpub(derivationPath.slice(0, -1));
        return (0, cardano_crypto_js_1.derivePublic)(parentXpub, lastIndex, 2);
    }
    function* makeBulkAccountIndexIterator() {
        yield [0, 4];
        yield [5, 16];
        for (let i = 17; true; i += 18) {
            yield [i, i + 17];
        }
    }
    function getAccountIndexExportInterval(accountIndex) {
        const bulkAccountIndexIterator = makeBulkAccountIndexIterator();
        for (const [startIndex, endIndex] of bulkAccountIndexIterator) {
            if (accountIndex >= startIndex && accountIndex <= endIndex) {
                return [startIndex, endIndex];
            }
        }
        return [0, 0];
    }
    function createPathBulk(derivationPath) {
        const paths = [];
        const accountIndex = derivationPath[2] - config_1.HARDENED_THRESHOLD;
        const [startIndex, endIndex] = getAccountIndexExportInterval(accountIndex);
        for (let i = startIndex; i <= endIndex; i += 1) {
            const nextAccountIndex = i + config_1.HARDENED_THRESHOLD;
            const nextAccountPath = [...derivationPath.slice(0, -1), nextAccountIndex];
            paths.push(nextAccountPath);
        }
        return paths;
    }
    async function _deriveXpubsHardenedFn(derivationPaths) {
        const xPubBulk = await deriveXpubsHardenedFn(derivationPaths);
        const _derivedXpubs = {};
        xPubBulk.forEach((xpub, i) => {
            const memoKey = JSON.stringify(derivationPaths[i]);
            _derivedXpubs[memoKey] = xpub;
        });
        return _derivedXpubs;
    }
    return deriveXpub;
};
function ShelleySignedTransactionStructured(txAux, txWitnesses) {
    function getId() {
        return txAux.getId();
    }
    function encodeCBOR(encoder) {
        return encoder.pushAny([txAux, txWitnesses, null]);
    }
    return {
        getId,
        encodeCBOR,
    };
}
const getCryptoProvider = async (rootSecret) => {
    const masterHdNode = HdNode(rootSecret);
    function deriveHdNode(derivationPath) {
        return derivationPath.reduce(deriveChildHdNode, masterHdNode);
    }
    function deriveChildHdNode(hdNode, childIndex) {
        const result = (0, cardano_crypto_js_1.derivePrivate)(hdNode.toBuffer(), childIndex, 2);
        return HdNode(result);
    }
    const deriveXpub = CachedDeriveXpubFactory(true, (derivationPaths) => {
        return derivationPaths.map((path) => deriveHdNode(path).extendedPublicKey);
    });
    const sign = async (message, keyDerivationPath) => {
        const hdNode = deriveHdNode(keyDerivationPath);
        const messageToSign = buffer_1.Buffer.from(message, 'hex');
        return (0, cardano_crypto_js_1.sign)(messageToSign, hdNode.toBuffer());
    };
    const prepareShelleyWitness = async (txHash, path) => {
        const signature = await sign(txHash, path);
        const xpub = await deriveXpub(path);
        const publicKey = (0, exports.xpub2pub)(xpub);
        return { publicKey, signature };
    };
    const prepareWitnesses = async (txAux, addressToAbsPathMapper) => {
        const { inputs, certificates, withdrawals, getId } = txAux;
        const txHash = getId();
        const _shelleyWitnesses = [];
        inputs.forEach(() => {
            try {
                const spendingPath = config_1.shelleyPath;
                if (isShelleyPath(config_1.shelleyPath)) {
                    _shelleyWitnesses.push(prepareShelleyWitness(txHash, spendingPath));
                }
            }
            catch (_a) {
                //
            }
        });
        [...certificates, ...withdrawals].forEach(({ stakingAddress }) => {
            const stakingPath = addressToAbsPathMapper(stakingAddress);
            _shelleyWitnesses.push(prepareShelleyWitness(txHash, stakingPath));
        });
        const shelleyWitnesses = await Promise.all(_shelleyWitnesses);
        return shelleyWitnesses;
    };
    function cborizeTxWitnessesShelley(shelleyWitnesses) {
        const txWitnessesShelley = shelleyWitnesses.map(({ publicKey, signature }) => [publicKey, signature]);
        return txWitnessesShelley;
    }
    function cborizeTxWitnesses(shelleyWitnesses) {
        const txWitnesses = new Map();
        if (shelleyWitnesses.length > 0) {
            txWitnesses.set(0 /* TxWitnessKey.SHELLEY */, cborizeTxWitnessesShelley(shelleyWitnesses));
        }
        return txWitnesses;
    }
    const signTxGetStructured = async (txAux, addressToPathMapper) => {
        const shelleyWitnesses = await prepareWitnesses(txAux, addressToPathMapper);
        const txWitnesses = cborizeTxWitnesses(shelleyWitnesses);
        return ShelleySignedTransactionStructured(txAux, txWitnesses);
    };
    const signTx = async (txAux, addressToPathMapper) => {
        const structuredTx = await signTxGetStructured(txAux, addressToPathMapper);
        return {
            txBody: (0, borc_1.encode)(structuredTx).toString('hex'),
            txHash: structuredTx.getId(),
        };
    };
    return {
        deriveXpub,
        sign,
        signTx,
    };
};
exports.getCryptoProvider = getCryptoProvider;
const xpub2pub = (xpub) => {
    return xpub.slice(0, 32);
};
exports.xpub2pub = xpub2pub;
const baseAddressFromXpub = (spendXpub, stakeXpub) => {
    const addrBuffer = (0, cardano_crypto_js_1.packBaseAddress)((0, cardano_crypto_js_1.getPubKeyBlake2b224Hash)((0, exports.xpub2pub)(spendXpub)), (0, cardano_crypto_js_1.getPubKeyBlake2b224Hash)((0, exports.xpub2pub)(stakeXpub)), 1);
    return cardano_crypto_js_1.bech32.encode('addr', addrBuffer);
};
exports.baseAddressFromXpub = baseAddressFromXpub;
