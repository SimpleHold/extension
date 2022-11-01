import { Method } from 'axios';
export declare type TRequestParams<D> = {
    url: string;
    method?: Method;
    data?: D;
    params?: any;
    skipNestedData?: boolean;
};
export declare type TResponse<RD> = {
    error: boolean;
    data: RD;
};
export declare type TFeeRate = {
    slow: number;
    average: number;
    fast: number;
};
export declare type TFeeResponse = {
    fees?: TFee[];
    networkFee?: number;
    utxos?: TUnspentOutput[];
    currencyBalance?: number;
    isZeroFee?: boolean;
    minCurrencyAmount?: number;
};
export declare type TFeeTypes = 'slow' | 'average' | 'fast';
export declare type TFee = {
    type: TFeeTypes;
    value: number;
    utxos?: TUnspentOutput[];
};
export declare type TUnspentOutput = {
    txId: string;
    outputIndex: number;
    script: string;
    satoshis: number;
    address: string;
};
export declare type TCardanoAsset = {
    asset: string;
    policy_id: string;
    asset_name: string;
    fingerprint: string;
    quantity: string;
    initial_mint_tx_hash: string;
    mint_or_burn_count: number;
    onchain_metadata: null | string;
    metadata: {
        name: string;
        description: string;
        ticker: string;
        url: string;
        logo: string;
        decimals: number;
    };
};
export declare type TBalanceResponse = {
    balance: number;
    balance_usd: number;
    balance_btc: number;
    pending: number;
    pending_btc: number;
    balance_string: string;
};
