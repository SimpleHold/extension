"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoProviderFeature = exports.CryptoProviderType = exports.TxStakeCredentialType = exports.CertificateType = void 0;
var CertificateType;
(function (CertificateType) {
    CertificateType[CertificateType["STAKING_KEY_REGISTRATION"] = 0] = "STAKING_KEY_REGISTRATION";
    CertificateType[CertificateType["STAKING_KEY_DEREGISTRATION"] = 1] = "STAKING_KEY_DEREGISTRATION";
    CertificateType[CertificateType["DELEGATION"] = 2] = "DELEGATION";
    CertificateType[CertificateType["STAKEPOOL_REGISTRATION"] = 3] = "STAKEPOOL_REGISTRATION";
})(CertificateType = exports.CertificateType || (exports.CertificateType = {}));
var TxStakeCredentialType;
(function (TxStakeCredentialType) {
    TxStakeCredentialType[TxStakeCredentialType["ADDR_KEYHASH"] = 0] = "ADDR_KEYHASH";
})(TxStakeCredentialType = exports.TxStakeCredentialType || (exports.TxStakeCredentialType = {}));
var CryptoProviderType;
(function (CryptoProviderType) {
    CryptoProviderType["BITBOX02"] = "BITBOX02";
    CryptoProviderType["LEDGER"] = "LEDGER";
    CryptoProviderType["TREZOR"] = "TREZOR";
    CryptoProviderType["WALLET_SECRET"] = "WALLET_SECRET";
})(CryptoProviderType = exports.CryptoProviderType || (exports.CryptoProviderType = {}));
var CryptoProviderFeature;
(function (CryptoProviderFeature) {
    CryptoProviderFeature["MINIMAL"] = "MINIMAL";
    CryptoProviderFeature["WITHDRAWAL"] = "WITHDRAWAL";
    CryptoProviderFeature["BULK_EXPORT"] = "BULK_EXPORT";
    CryptoProviderFeature["POOL_OWNER"] = "POOL_OWNER";
    CryptoProviderFeature["MULTI_ASSET"] = "MULTI_ASSET";
    CryptoProviderFeature["VOTING"] = "VOTING";
    CryptoProviderFeature["BYRON"] = "BYRON";
})(CryptoProviderFeature = exports.CryptoProviderFeature || (exports.CryptoProviderFeature = {}));
