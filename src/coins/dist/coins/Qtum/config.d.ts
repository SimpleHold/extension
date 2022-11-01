export interface INetworkInfo {
    name: string;
    messagePrefix: string;
    bech32: string;
    bip32: {
        public: number;
        private: number;
    };
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
}
export declare const mainnet: INetworkInfo;
