export type TFeeResponse = any

export type TProvider = {
  generateAddress: (
    symbol: string,
    chain: string,
    tokenChain?: string
  ) => Promise<TGenerateAddress | null>
  importPrivateKey?: (privateKey: string, symbol: string) => Promise<string | null>
  getExplorerLink: (
    address: string,
    chain: string,
    tokenChain?: string,
    contractAddress?: string,
    symbol?: string
  ) => string
  getTransactionLink: (hash: string, chain: string) => string
  getStandingFee?: (symbol: string, chain: string, tokenChain?: string) => number
  createInternalTx?: (props: TInternalTxProps) => Promise<string | null>
  validateAddress: (address: string, symbol: string, chain: string) => boolean
  createTx?: (props: TCreateTxProps) => Promise<string | null>
  formatValue: (value: string | number, type: 'from' | 'to', symbol: string) => number
  importRecoveryPhrase?: (
    recoveryPhrase: string,
    symbol: string,
    chain: string
  ) => Promise<TGenerateAddress | null>
  generateExtraId?: () => string
  config: TCurrencyConfig
  getNetworkFee?: (props: TFeeProps) => Promise<TFeeResponse | null>
}

export type TGenerateAddress = {
  address: string
  privateKey: string
  mnemonic?: string
  isNotActivated?: boolean
}

export type TUnspentOutput = {
  txId: string
  outputIndex: number
  script: string
  satoshis: number
  address: string
}

export type TInternalTxProps = {
  symbol: string
  addressFrom: string
  addressTo: string
  amount: string
  privateKey?: string
  networkFee: number
  outputs?: TUnspentOutput[]
  extraId?: string
  mnemonic?: string
  tokenChain?: string
  contractAddress?: string
  decimals?: number
  chain: string
}

export type TFeeProps = {
  symbol: string
  amount: string
  from: string
  chain: string
  outputs: TUnspentOutput[]
  addressFrom: string
  tokenChain?: string
  contractAddress?: string
  decimals?: number
  extraId?: string
}

export type TCreateTxProps = {
  symbol: string
  chain: string
  addressFrom: string
  addressTo: string
  amount: string
  privateKey?: string | null
  utxos: TUnspentOutput[]
  fee: number
  tokenChain?: string
  contractAddress?: string
  extraId?: string
  decimals?: number
  mnemonic?: string
  minCurrencyAmount?: number
}

export type TCurrencyConfig = {
  coins: string[]
  isInternalTx?: boolean
  isWithOutputs?: boolean
  isZeroFee?: boolean
  extraIdName?: string
  isWithPhrase?: boolean
  wordsSize?: number[]
  isGenerateExtraId?: boolean
  isFeeApproximate?: boolean
}

export type TCardanoOutput = {
  ctaAmount: TCardanoOutputAmount[]
  ctaTxHash: string
  ctaTxIndex: number
}

export type TCardanoOutputAmount = {
  unit: string
  quantity: string
}

export type BIP32Path = number[]

export type _THdNode = THdNode & {
  extendedPublicKey: Buffer
  toBuffer: () => Buffer
  toString: () => string
}

export type THdNode = {
  secretKey: Buffer
  publicKey: Buffer
  chainCode: Buffer
}

export type TokenBundle = Token[]

export type UTxO = {
  txHash: string
  address: string
  coins: number
  tokenBundle: TokenBundle
  outputIndex: number
}

export type TxInput = UTxO

export type TxOutput =
  | {
      isChange: false
      address: string
      coins: number
      tokenBundle: TokenBundle
    }
  | {
      isChange: true
      address: string
      coins: number
      tokenBundle: TokenBundle
      spendingPath: BIP32Path
      stakingPath: BIP32Path
    }

export type TxAux = {
  getId: () => string
  inputs: TxInput[]
  outputs: TxOutput[]
  fee: number
  ttl: number
  certificates: any[]
  withdrawals: any[]
  auxiliaryData: any | null
  auxiliaryDataHash: any | null
  validityIntervalStart: number | null
  encodeCBOR: any
}

export type TxSigned = {
  txBody: string
  txHash: string
}

export type CborizedTxSignedStructured = {
  getId: () => string
  encodeCBOR: any
}

export type TxShelleyWitness = {
  publicKey: Buffer
  signature: Buffer
}

export type AddressToPathMapper = (address: string) => BIP32Path

export type CborizedTxWitnesses = Map<
  TxWitnessKey,
  Array<CborizedTxWitnessByron | CborizedTxWitnessShelley>
>

export type CborizedTxWitnessShelley = [Buffer, Buffer]

export type CborizedTxWitnessByron = [Buffer, Buffer, Buffer, Buffer]

export const enum TxWitnessKey {
  SHELLEY = 0,
  BYRON = 2,
}

export interface TxPlan {
  inputs: Array<TxInput>
  outputs: Array<TxOutput>
  change: Array<TxOutput>
  certificates: Array<TxCertificate>
  deposit: number
  additionalLovelaceAmount: number
  fee: number
  baseFee: number
  withdrawals: Array<TxWithdrawal>
  auxiliaryData: TxPlanAuxiliaryData | null
}

export type TxPlanDraft = {
  outputs: TxOutput[]
  certificates: any[]
  withdrawals: any[]
  auxiliaryData: TxPlanAuxiliaryData | null
}

export enum CertificateType {
  STAKING_KEY_REGISTRATION = 0,
  STAKING_KEY_DEREGISTRATION = 1,
  DELEGATION = 2,
  STAKEPOOL_REGISTRATION = 3,
}

export type TxCertificate =
  | TxStakingKeyRegistrationCert
  | TxStakingKeyDeregistrationCert
  | TxDelegationCert
  | TxStakepoolRegistrationCert

export type TxStakingKeyRegistrationCert = {
  type: CertificateType.STAKING_KEY_REGISTRATION
  stakingAddress: string
}

export type TxStakingKeyDeregistrationCert = {
  type: CertificateType.STAKING_KEY_DEREGISTRATION
  stakingAddress: string
}

export type TxDelegationCert = {
  type: CertificateType.DELEGATION
  stakingAddress: string
  poolHash: string
}

export type TxStakepoolRegistrationCert = {
  type: CertificateType.STAKEPOOL_REGISTRATION
  stakingAddress: string
  poolRegistrationParams: any
}

export type TxWithdrawal = {
  stakingAddress: string
  rewards: number
}

export type TxPlanAuxiliaryData = TxPlanVotingAuxiliaryData

export type TxAuxiliaryDataTypes = 'CATALYST_VOTING'

export type TxPlanVotingAuxiliaryData = {
  type: TxAuxiliaryDataTypes
  votingPubKey: string
  stakePubKey: string
  nonce: BigInt
  rewardDestinationAddress: {
    address: string
  }
}

export type TokenObject = {
  policyId: string
  assetName: string
  quantity: string
}

export type Token = Omit<TokenObject, 'quantity'> & {
  quantity: number
}

export type OrderedTokenBundle = {
  policyId: string
  assets: {
    assetName: string
    quantity: number
  }[]
}[]

export type CborizedTxTokenBundle = Map<Buffer, Map<Buffer, number>>

export type CborizedTxAmount = number | [number, CborizedTxTokenBundle]

export type CborizedTxOutput = [Buffer, CborizedTxAmount]

export type TxPlanResult =
  | {
      success: true
      txPlan: TxPlan
    }
  | {
      success: false
      error: any
      estimatedFee: number
      deposit: number
      minimalLovelaceAmount: number
    }

export type CborizedVotingRegistrationMetadata = [Map<number, Map<number, Buffer | BigInt>>, []]

export const enum TxCertificateKey {
  STAKING_KEY_REGISTRATION = 0,
  STAKING_KEY_DEREGISTRATION = 1,
  DELEGATION = 2,
  STAKEPOOL_REGISTRATION = 3,
}

export enum TxStakeCredentialType {
  ADDR_KEYHASH = 0,
}

export type CborizedTxStakeCredential = [TxStakeCredentialType, Buffer]

export type CborizedTxStakingKeyRegistrationCert = [
  TxCertificateKey.STAKING_KEY_REGISTRATION,
  CborizedTxStakeCredential
]

export type CborizedTxDelegationCert = [
  TxCertificateKey.DELEGATION,
  CborizedTxStakeCredential,
  Buffer
]

export type CborizedTxStakepoolRegistrationCert = [
  TxCertificateKey.STAKEPOOL_REGISTRATION,
  Buffer,
  Buffer,
  number,
  number,
  {
    value: {
      0: number
      1: number
    }
  },
  Buffer,
  Array<Buffer>,
  any,
  [string, Buffer] | null
]

export type CborizedTxStakingKeyDeregistrationCert = [
  TxCertificateKey.STAKING_KEY_DEREGISTRATION,
  CborizedTxStakeCredential
]

export type CborizedTxCertificate =
  | CborizedTxDelegationCert
  | CborizedTxStakepoolRegistrationCert
  | CborizedTxStakingKeyDeregistrationCert
  | CborizedTxStakingKeyRegistrationCert

export type CborizedTxInput = [Buffer, number]

export const enum TxRelayType {
  SINGLE_HOST_IP = 0,
  SINGLE_HOST_NAME = 1,
  MULTI_HOST_NAME = 2,
}

export type CborizedTxWithdrawals = Map<Buffer, number>

export type SendTransactionSummary = {
  type: string
  coins: number
  token: Token | null
  address: string
  minimalLovelaceAmount: number
}

export type TransactionSummary = {
  type: string
  fee: number
  plan: TxPlan
} & SendTransactionSummary

export type TxAuxiliaryData = TxVotingAuxiliaryData

export type TxVotingAuxiliaryData = TxPlanVotingAuxiliaryData & {
  rewardDestinationAddress: {
    address: string
    stakingPath: BIP32Path
  }
}

export const enum TxBodyKey {
  INPUTS = 0,
  OUTPUTS = 1,
  FEE = 2,
  TTL = 3,
  CERTIFICATES = 4,
  WITHDRAWALS = 5,
  AUXILIARY_DATA_HASH = 7,
  VALIDITY_INTERVAL_START = 8,
}

export type AddressWithMeta = {
  address: string
  bip32StringPath: string
  isUsed: boolean
}

export type AddressToPathMapping = {
  [key: string]: BIP32Path
}

export type MyAddressesParams = {
  accountIndex: number
  cryptoProvider: CryptoProvider
  gapLimit: number
}

export type CborizedCliWitness = [TxWitnessKey, CborizedTxWitnessShelley | CborizedTxWitnessByron]

export enum CryptoProviderType {
  BITBOX02 = 'BITBOX02',
  LEDGER = 'LEDGER',
  TREZOR = 'TREZOR',
  WALLET_SECRET = 'WALLET_SECRET',
}

export type DerivationScheme = {
  type: 'v1' | 'v2'
  ed25519Mode: number
  keyfileVersion: string
}

export enum CryptoProviderFeature {
  MINIMAL = 'MINIMAL',
  WITHDRAWAL = 'WITHDRAWAL',
  BULK_EXPORT = 'BULK_EXPORT',
  POOL_OWNER = 'POOL_OWNER',
  MULTI_ASSET = 'MULTI_ASSET',
  VOTING = 'VOTING',
  BYRON = 'BYRON',
}

export interface CryptoProvider {
  network: Network
  signTx: (unsignedTx: TxAux, addressToPathMapper: AddressToPathMapper) => Promise<TxSigned>
  witnessPoolRegTx: (
    unsignedTx: TxAux,
    addressToPathMapper: AddressToPathMapper
  ) => Promise<CborizedCliWitness>
  getWalletSecret: () => Buffer | void
  getType: () => CryptoProviderType
  getDerivationScheme: () => DerivationScheme
  deriveXpub: (derivationPath: BIP32Path) => Promise<Buffer>
  getHdPassphrase: () => Buffer | void
  _sign: (message: string, absDerivationPath: BIP32Path) => void
  ensureFeatureIsSupported: (feature: CryptoProviderFeature) => void
  isFeatureSupported: (feature: CryptoProviderFeature) => boolean
  displayAddressForPath: (absDerivationPath: BIP32Path, stakingPath: BIP32Path) => void
  getVersion: () => string | null
}

export const enum NetworkId {
  MAINNET = 1,
  TESTNET = 0,
}

export const enum ProtocolMagic {
  MAINNET = 764824073,
  TESTNET = 1097911063,
}

export type Network = {
  name: string
  networkId: NetworkId
  protocolMagic: ProtocolMagic
  eraStartSlot: number
  eraStartDateTime: number
  epochsToRewardDistribution: number
  minimalOutput: number
}

export type AddressProvider = (i: number) => Promise<{
  path: BIP32Path
  address: string
}>

export type AddressManagerParams = {
  addressProvider: AddressProvider
  gapLimit: number
}

export type BulkAddressesSummary = {
  caAddresses: Array<string>
  caTxNum: number
  caBalance: CoinObject
  caTxList: Array<CaTxEntry>
}

export type CoinObject = {
  getCoin: string
  getTokens: TokenObject[]
}

export type CaTxEntry = {
  ctbId: string
  ctbTimeIssued: number
  ctbInputs: Array<AddressCoinTuple>
  ctbOutputs: Array<AddressCoinTuple>
  ctbInputSum: CoinObject
  ctbOutputSum: CoinObject
  fee: string
  isValid: boolean
  scriptSize: number
}

export type AddressCoinTuple = [string, CoinObject]

export type BulkAddressesSummaryResponse = {
  Right: BulkAddressesSummary
}

export type SuccessResponse<T> = {
  Right: T
}

export type FailureResponse = { Left: string }

export type TxSummaryEntry = Omit<CaTxEntry, 'fee'> & {
  fee: number
  effect: number
  tokenEffects: TokenBundle
}

export type TWalletBalanceRequestPayload = {
  address: string
  symbol: string
  chain?: string
  contractAddress?: string
  tokenSymbol?: string
  isFullBalance?: boolean
}
