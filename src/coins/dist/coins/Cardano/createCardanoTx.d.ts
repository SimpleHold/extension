import { TCreateTxProps } from '../types';
declare const createCardanoTx: (props: TCreateTxProps, ttl: number) => Promise<string | null>;
export default createCardanoTx;
