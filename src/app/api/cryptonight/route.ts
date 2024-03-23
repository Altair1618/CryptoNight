import { NextRequest, NextResponse } from "next/server";
import { CipherRequest, CipherResponse } from '@/types';
import { encrypt_ctr, decrypt_ctr, encrypt_ecb, decrypt_ecb, encrypt_cfb, decrypt_cfb, encrypt_ofb, decrypt_ofb, encrypt_cbc, decrypt_cbc } from '@/lib/cryptonight';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // Get the request body
        const requestBody = await req.json();
        const { input, key, initialVector, mode, encrypt }: CipherRequest = requestBody; // Use this vars

        // Initiate vars
        let successful = true;
        let output = input;

        // Process the request based on mode using switch statement
        if (mode == 'ECB')
            encrypt ? output = encrypt_ecb(input, key) : output = decrypt_ecb(input, key);
        if (mode == 'CBC')
            encrypt ? output = encrypt_cbc(input, key, initialVector) : output = decrypt_cbc(input, key, initialVector);
        if (mode == 'CFB')
            encrypt ? output = encrypt_cfb(input, key, initialVector) : output = decrypt_cfb(input, key, initialVector);
        if (mode == 'OFB')
            encrypt ? output = encrypt_ofb(input, key, initialVector) : output = decrypt_ofb(input, key, initialVector);
        if (mode == 'Counter')
            encrypt ? output = encrypt_ctr(input, key, initialVector) : output = decrypt_ctr(input, key, initialVector);

        // Prepare to send response
        const data: CipherResponse = {
            success: successful,
            output: output
        }

        return NextResponse.json(data, { status: 200 }); // sucess
    } catch (error) {
        return NextResponse.json({ message: "An error occurred" }, { status: 500 }); // fail
    }
}