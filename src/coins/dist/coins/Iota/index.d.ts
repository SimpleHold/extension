import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '../types';
export declare const config: TCurrencyConfig;
export declare const formatValue: (value: string | number, type: 'from' | 'to') => number;
export declare const generateAddress: () => Promise<TGenerateAddress | null>;
export declare const importRecoveryPhrase: (recoveryPhrase: string) => Promise<TGenerateAddress | null>;
export declare const getExplorerLink: (address: string) => string;
export declare const getTransactionLink: (hash: string) => string;
export declare const validateAddress: (address: string) => boolean;
export declare const createInternalTx: (props: TInternalTxProps) => Promise<string | null>;
