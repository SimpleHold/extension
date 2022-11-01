/// <reference types="node" />
export declare type TCardanoOutput = {
    ctaAmount: TCardanoOutputAmount[];
    ctaTxHash: string;
    ctaTxIndex: number;
};
export declare type TCardanoOutputAmount = {
    unit: string;
    quantity: string;
};
export declare type BIP32Path = number[];
export declare type _THdNode = THdNode & {
    extendedPublicKey: Buffer;
    toBuffer: () => Buffer;
    toString: () => string;
};
export declare type THdNode = {
    secretKey: Buffer;
    publicKey: Buffer;
    chainCode: Buffer;
};
export declare type TokenBundle = Token[];
export declare type UTxO = {
    txHash: string;
    address: string;
    coins: number;
    tokenBundle: TokenBundle;
    outputIndex: number;
};
export declare type TxInput = UTxO;
export declare type TxOutput = {
    isChange: false;
    address: string;
    coins: number;
    tokenBundle: TokenBundle;
} | {
    isChange: true;
    address: string;
    coins: number;
    tokenBundle: TokenBundle;
    spendingPath: BIP32Path;
    stakingPath: BIP32Path;
};
export declare type TxAux = {
    getId: () => string;
    inputs: TxInput[];
    outputs: TxOutput[];
    fee: number;
    ttl: number;
    certificates: any[];
    withdrawals: any[];
    auxiliaryData: any | null;
    auxiliaryDataHash: any | null;
    validityIntervalStart: number | null;
    encodeCBOR: any;
};
export declare type TxSigned = {
    txBody: string;
    txHash: string;
};
export declare type CborizedTxSignedStructured = {
    getId: () => string;
    encodeCBOR: any;
};
export declare type TxShelleyWitness = {
    publicKey: Buffer;
    signature: Buffer;
};
export declare type AddressToPathMapper = (address: string) => BIP32Path;
export declare type CborizedTxWitnesses = Map<TxWitnessKey, Array<CborizedTxWitnessByron | CborizedTxWitnessShelley>>;
export declare type CborizedTxWitnessShelley = [Buffer, Buffer];
export declare type CborizedTxWitnessByron = [Buffer, Buffer, Buffer, Buffer];
export declare const enum TxWitnessKey {
    SHELLEY = 0,
    BYRON = 2
}
export interface TxPlan {
    inputs: Array<TxInput>;
    outputs: Array<TxOutput>;
    change: Array<TxOutput>;
    certificates: Array<TxCertificate>;
    deposit: number;
    additionalLovelaceAmount: number;
    fee: number;
    baseFee: number;
    withdrawals: Array<TxWithdrawal>;
    auxiliaryData: TxPlanAuxiliaryData | null;
}
export declare type TxPlanDraft = {
    outputs: TxOutput[];
    certificates: any[];
    withdrawals: any[];
    auxiliaryData: TxPlanAuxiliaryData | null;
};
export declare enum CertificateType {
    STAKING_KEY_REGISTRATION = 0,
    STAKING_KEY_DEREGISTRATION = 1,
    DELEGATION = 2,
    STAKEPOOL_REGISTRATION = 3
}
export declare type TxCertificate = TxStakingKeyRegistrationCert | TxStakingKeyDeregistrationCert | TxDelegationCert | TxStakepoolRegistrationCert;
export declare type TxStakingKeyRegistrationCert = {
    type: CertificateType.STAKING_KEY_REGISTRATION;
    stakingAddress: string;
};
export declare type TxStakingKeyDeregistrationCert = {
    type: CertificateType.STAKING_KEY_DEREGISTRATION;
    stakingAddress: string;
};
export declare type TxDelegationCert = {
    type: CertificateType.DELEGATION;
    stakingAddress: string;
    poolHash: string;
};
export declare type TxStakepoolRegistrationCert = {
    type: CertificateType.STAKEPOOL_REGISTRATION;
    stakingAddress: string;
    poolRegistrationParams: any;
};
export declare type TxWithdrawal = {
    stakingAddress: string;
    rewards: number;
};
export declare type TxPlanAuxiliaryData = TxPlanVotingAuxiliaryData;
export declare type TxAuxiliaryDataTypes = 'CATALYST_VOTING';
export declare type TxPlanVotingAuxiliaryData = {
    type: TxAuxiliaryDataTypes;
    votingPubKey: string;
    stakePubKey: string;
    nonce: BigInt;
    rewardDestinationAddress: {
        address: string;
    };
};
export declare type TokenObject = {
    policyId: string;
    assetName: string;
    quantity: string;
};
export declare type Token = Omit<TokenObject, 'quantity'> & {
    quantity: number;
};
export declare type OrderedTokenBundle = {
    policyId: string;
    assets: {
        assetName: string;
        quantity: number;
    }[];
}[];
export declare type CborizedTxTokenBundle = Map<Buffer, Map<Buffer, number>>;
export declare type CborizedTxAmount = number | [number, CborizedTxTokenBundle];
export declare type CborizedTxOutput = [Buffer, CborizedTxAmount];
export declare type TxPlanResult = {
    success: true;
    txPlan: TxPlan;
} | {
    success: false;
    error: any;
    estimatedFee: number;
    deposit: number;
    minimalLovelaceAmount: number;
};
export declare type CborizedVotingRegistrationMetadata = [
    Map<number, Map<number, Buffer | BigInt>>,
    [
    ]
];
export declare const enum TxCertificateKey {
    STAKING_KEY_REGISTRATION = 0,
    STAKING_KEY_DEREGISTRATION = 1,
    DELEGATION = 2,
    STAKEPOOL_REGISTRATION = 3
}
export declare enum TxStakeCredentialType {
    ADDR_KEYHASH = 0
}
export declare type CborizedTxStakeCredential = [TxStakeCredentialType, Buffer];
export declare type CborizedTxStakingKeyRegistrationCert = [
    TxCertificateKey.STAKING_KEY_REGISTRATION,
    CborizedTxStakeCredential
];
export declare type CborizedTxDelegationCert = [
    TxCertificateKey.DELEGATION,
    CborizedTxStakeCredential,
    Buffer
];
export declare type CborizedTxStakepoolRegistrationCert = [
    TxCertificateKey.STAKEPOOL_REGISTRATION,
    Buffer,
    Buffer,
    number,
    number,
    {
        value: {
            0: number;
            1: number;
        };
    },
    Buffer,
    Array<Buffer>,
    any,
    [
        string,
        Buffer
    ] | null
];
export declare type CborizedTxStakingKeyDeregistrationCert = [
    TxCertificateKey.STAKING_KEY_DEREGISTRATION,
    CborizedTxStakeCredential
];
export declare type CborizedTxCertificate = CborizedTxDelegationCert | CborizedTxStakepoolRegistrationCert | CborizedTxStakingKeyDeregistrationCert | CborizedTxStakingKeyRegistrationCert;
export declare type CborizedTxInput = [Buffer, number];
export declare const enum TxRelayType {
    SINGLE_HOST_IP = 0,
    SINGLE_HOST_NAME = 1,
    MULTI_HOST_NAME = 2
}
export declare type CborizedTxWithdrawals = Map<Buffer, number>;
export declare type SendTransactionSummary = {
    type: string;
    coins: number;
    token: Token | null;
    address: string;
    minimalLovelaceAmount: number;
};
export declare type TransactionSummary = {
    type: string;
    fee: number;
    plan: TxPlan;
} & SendTransactionSummary;
export declare type TxAuxiliaryData = TxVotingAuxiliaryData;
export declare type TxVotingAuxiliaryData = TxPlanVotingAuxiliaryData & {
    rewardDestinationAddress: {
        address: string;
        stakingPath: BIP32Path;
    };
};
export declare const enum TxBodyKey {
    INPUTS = 0,
    OUTPUTS = 1,
    FEE = 2,
    TTL = 3,
    CERTIFICATES = 4,
    WITHDRAWALS = 5,
    AUXILIARY_DATA_HASH = 7,
    VALIDITY_INTERVAL_START = 8
}
export declare type AddressWithMeta = {
    address: string;
    bip32StringPath: string;
    isUsed: boolean;
};
export declare type AddressToPathMapping = {
    [key: string]: BIP32Path;
};
export declare type MyAddressesParams = {
    accountIndex: number;
    cryptoProvider: CryptoProvider;
    gapLimit: number;
};
export declare type CborizedCliWitness = [
    TxWitnessKey,
    CborizedTxWitnessShelley | CborizedTxWitnessByron
];
export declare enum CryptoProviderType {
    BITBOX02 = "BITBOX02",
    LEDGER = "LEDGER",
    TREZOR = "TREZOR",
    WALLET_SECRET = "WALLET_SECRET"
}
export declare type DerivationScheme = {
    type: 'v1' | 'v2';
    ed25519Mode: number;
    keyfileVersion: string;
};
export declare enum CryptoProviderFeature {
    MINIMAL = "MINIMAL",
    WITHDRAWAL = "WITHDRAWAL",
    BULK_EXPORT = "BULK_EXPORT",
    POOL_OWNER = "POOL_OWNER",
    MULTI_ASSET = "MULTI_ASSET",
    VOTING = "VOTING",
    BYRON = "BYRON"
}
export interface CryptoProvider {
    network: Network;
    signTx: (unsignedTx: TxAux, addressToPathMapper: AddressToPathMapper) => Promise<TxSigned>;
    witnessPoolRegTx: (unsignedTx: TxAux, addressToPathMapper: AddressToPathMapper) => Promise<CborizedCliWitness>;
    getWalletSecret: () => Buffer | void;
    getType: () => CryptoProviderType;
    getDerivationScheme: () => DerivationScheme;
    deriveXpub: (derivationPath: BIP32Path) => Promise<Buffer>;
    getHdPassphrase: () => Buffer | void;
    _sign: (message: string, absDerivationPath: BIP32Path) => void;
    ensureFeatureIsSupported: (feature: CryptoProviderFeature) => void;
    isFeatureSupported: (feature: CryptoProviderFeature) => boolean;
    displayAddressForPath: (absDerivationPath: BIP32Path, stakingPath: BIP32Path) => void;
    getVersion: () => string | null;
}
export declare const enum NetworkId {
    MAINNET = 1,
    TESTNET = 0
}
export declare const enum ProtocolMagic {
    MAINNET = 764824073,
    TESTNET = 1097911063
}
export declare type Network = {
    name: string;
    networkId: NetworkId;
    protocolMagic: ProtocolMagic;
    eraStartSlot: number;
    eraStartDateTime: number;
    epochsToRewardDistribution: number;
    minimalOutput: number;
};
export declare type AddressProvider = (i: number) => Promise<{
    path: BIP32Path;
    address: string;
}>;
export declare type AddressManagerParams = {
    addressProvider: AddressProvider;
    gapLimit: number;
};
export declare type BulkAddressesSummary = {
    caAddresses: Array<string>;
    caTxNum: number;
    caBalance: CoinObject;
    caTxList: Array<CaTxEntry>;
};
export declare type CoinObject = {
    getCoin: string;
    getTokens: TokenObject[];
};
export declare type CaTxEntry = {
    ctbId: string;
    ctbTimeIssued: number;
    ctbInputs: Array<AddressCoinTuple>;
    ctbOutputs: Array<AddressCoinTuple>;
    ctbInputSum: CoinObject;
    ctbOutputSum: CoinObject;
    fee: string;
    isValid: boolean;
    scriptSize: number;
};
export declare type AddressCoinTuple = [string, CoinObject];
export declare type BulkAddressesSummaryResponse = {
    Right: BulkAddressesSummary;
};
export declare type SuccessResponse<T> = {
    Right: T;
};
export declare type FailureResponse = {
    Left: string;
};
export declare type TxSummaryEntry = Omit<CaTxEntry, 'fee'> & {
    fee: number;
    effect: number;
    tokenEffects: TokenBundle;
};
