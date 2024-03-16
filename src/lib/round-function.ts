import { Block } from "@/model/Block";
import { fisherYatesShuffler } from "./fisher-yates";
import * as crypto from "crypto";

function hmacSha256(data: string, key: string): string {
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(data);
  return hmac.digest("hex");
}

export function roundFunction(data: Block, key: Block): Block {
  // Round Function for Feistel Network
  // Uses Fisher-Yates Shuffler to Permute the Data Bits initially
  // Then, it uses the SHA-256 HMAC to generate the result

  data = fisherYatesShuffler(data, key, false);
  const hashResult: string = hmacSha256(data.getHexData(), key.getHexData());

  // For each 4 bytes of hashResult, XOR all of it to compress the result to 64-bit
  let result: string = "";
  for (let i = 0; i < hashResult.length / 4; i++) {
    const first_byte = parseInt(hashResult.slice(i * 4, i * 4 + 1), 16);
    const second_byte = parseInt(hashResult.slice(i * 4 + 1, i * 4 + 2), 16);
    const third_byte = parseInt(hashResult.slice(i * 4 + 2, i * 4 + 3), 16);
    const fourth_byte = parseInt(hashResult.slice(i * 4 + 3, i * 4 + 4), 16);

    const xor_result = first_byte ^ second_byte ^ third_byte ^ fourth_byte;
    result += xor_result.toString(16);
  }

  return new Block(result, true);
}