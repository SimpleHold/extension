import { wallet } from '@cityofzion/neon-js';
export declare type SendEntryType = {
    amount: number | string;
    address: string;
    symbol: string;
};
export declare type TokenBalanceType = {
    scriptHash: string;
};
export declare type TTxConfig = {
    account: wallet.Account;
    address: string;
    fees: number;
    net: string;
    privateKey: string;
    publicKey: string;
    url: string;
    intents: any[];
    script?: string;
    gas?: number;
};
