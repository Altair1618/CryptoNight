import axios from "axios";
import { CipherRequest, CipherResponse } from '@/types';

class CipherApi {
    private static axios = axios.create({
        baseURL: "/api",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    static async cryptonightEncryption(payload: CipherRequest): Promise<CipherResponse> {
        try {
            const response = await this.axios.post<CipherResponse>('/cryptonight', JSON.stringify(payload));

            console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default CipherApi;