import { NextRequest, NextResponse } from "next/server";
import { CipherRequest, CipherResponse } from '@/types';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // Get the request body
        const requestBody = await req.json();
        const { input, key, initialVector, mode, encrypt }: CipherRequest = requestBody; // Use this vars

        // TODO : Do something, change the stub below
        let successful = true;
        let output = input;



        const data: CipherResponse = {
            success: successful,
            output: output
        }

        return NextResponse.json(data, { status: 200 }); // sucess
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 }); // fail
    }
}