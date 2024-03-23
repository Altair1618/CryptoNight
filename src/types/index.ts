// For Block Cipher Request
export type CipherRequest = {
    input: string;
    key: string;
    initialVector: string;
    mode: string;
    encrypt: boolean;
}

// For Block Cipher Response
export type CipherResponse = {
    success: boolean;
    output: string;
}

// For Block Cipher Binary File Request
export type CipherBinRequest = {
    input: Uint8Array;
    key: string;
    initialVector: string;
    mode: string;
    encrypt: boolean;
}

// For Block Cipher Binary File Response
export type CipherBinResponse = {
    success: boolean;
    output: Uint8Array;
}