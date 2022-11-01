declare type TInput = {
    [type: string]: number;
};
declare const getByteCount: (inputs: TInput, outputs: TInput) => number;
export default getByteCount;
