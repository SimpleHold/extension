export declare type TTxParams = {
    nonce: number;
    gasPrice: number;
    gasLimit: number;
    gasPerByte: number;
};
export declare type TTxResponse = {
    receiver: string;
    receiverShard: number;
    sender: string;
    senderShard: number;
    status: string;
    txHash: string;
};
