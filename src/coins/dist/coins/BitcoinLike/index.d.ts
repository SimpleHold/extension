import { TGenerateAddress, TUnspentOutput, TCreateTxProps, TCurrencyConfig, TFeeProps } from '../types';
import { TFeeResponse } from '../../utils/api/types';
export declare const config: TCurrencyConfig;
export declare const toSat: (value: string | number) => string;
export declare const fromSat: (value: string | number) => string;
export declare const formatValue: (value: string | number, type: 'from' | 'to') => number;
export declare const generateAddress: (symbol: string) => Promise<TGenerateAddress | null>;
export declare const importPrivateKey: (privateKey: string, symbol: string) => Promise<string | null>;
export declare const getExplorerLink: (address: string, chain: string) => string;
export declare const getTransactionLink: (hash: string, chain: string) => string;
export declare const validateAddress: (address: string, symbol: string) => boolean;
export declare const getUtxos: (symbol: string, outputs: TUnspentOutput[], amount: string) => TUnspentOutput[];
export declare const getNetworkFee: (props: TFeeProps) => Promise<TFeeResponse | null>;
export declare const createTx: ({ chain, addressFrom, addressTo, amount, privateKey, utxos, symbol, fee, }: TCreateTxProps) => Promise<string | null>;
export declare const getStandingFee: (symbol: string) => number;
