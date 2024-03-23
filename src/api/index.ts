import axios from "axios";
import { CipherBinRequest, CipherBinResponse, CipherRequest, CipherResponse } from '@/types';

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

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async cryptonightBinEncryption(payload: CipherBinRequest): Promise<CipherBinResponse> {
        try {
            const response = await this.axios.post<CipherBinResponse>('/cryptonightBin', JSON.stringify(payload));
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }    
}

export default CipherApi;