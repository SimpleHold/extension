import { Buffer } from 'buffer';
export declare const getCryptoProvider: (rootSecret: Buffer) => Promise<any>;
export declare const xpub2pub: (xpub: Buffer) => Buffer;
export declare const baseAddressFromXpub: (spendXpub: Buffer, stakeXpub: Buffer) => any;
