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
