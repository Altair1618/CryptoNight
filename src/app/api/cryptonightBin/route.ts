import { NextRequest, NextResponse } from "next/server";
import { Buffer } from 'buffer';
import { parse } from 'url';
import { CipherBinRequest, CipherBinResponse } from "@/types";
import { decrypt_ecb_bin, encrypt_ecb_bin } from "@/lib/cryptonight";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // Get the request body
        const requestBody = await req.json();
        const { input, key, initialVector, mode, encrypt }: CipherBinRequest = requestBody; // Use this vars

        // Create uint8array input
        const uint8Input = new Uint8Array(Object.values(input));
        console.log(uint8Input);

        // Initiate vars
        let successful = true;
        let output = input;

        // Process the request based on mode using switch statement
        if (mode == 'ECB')
            encrypt ? output = encrypt_ecb_bin(uint8Input, key) : output = decrypt_ecb_bin(uint8Input, key);

        // Prepare to send response
        const data: CipherBinResponse = {
            success: successful,
            output: output
        }

        return NextResponse.json(data, { status: 200 }); // sucess
    } catch (error) {
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}

