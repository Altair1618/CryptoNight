import { Block } from "@/model/Block";
import { generateRoundKeys } from "./key-scheduling";
import { feistelDecryptRound, feistelEncryptRound } from "./feistel";
import { inverseSubstitute, substitute } from "./substitution";
import { shiftBlock, unshiftBlock } from "./shift";
import { BLOCK_SIZE_BYTE } from "./constants";
import { permutationString, inversePermutationString } from "./permutation";

function encrypt_block_function(data: Block, key: Block): Block {
  let result: Block = data;
  let scheduled_key: Block[] = generateRoundKeys(key, 16);

  for (let i = 0; i < 16; i++) {
    result = permutationString(result);
    result = feistelEncryptRound(result, scheduled_key[i]);
    result = substitute(result);
    result = shiftBlock(result, (i + 1) % BLOCK_SIZE_BYTE);
  }

  return result;
}

function decrypt_block_function(data: Block, key: Block): Block {
  let result: Block = data;
  let scheduled_key: Block[] = generateRoundKeys(key, 16);

  for (let i = 15; i >= 0; i--) {
    result = unshiftBlock(result, (i + 1) % BLOCK_SIZE_BYTE);
    result = inverseSubstitute(result);
    result = feistelDecryptRound(result, scheduled_key[i]);
    result = inversePermutationString(result);
  }

  return result;
}

function ascii_to_hex(ascii: string): string {
  return Buffer.from(ascii).toString("hex");
}

function hex_to_ascii(hex: string): string {
  return Buffer.from(hex, "hex").toString("utf8");
}

function pad(data: string): string {
  const pad_length =
    BLOCK_SIZE_BYTE - (((data.length - 1) % BLOCK_SIZE_BYTE) + 1);
  return data.padEnd(data.length + pad_length, "0");
}

function preprocess_data(data: string): Block[] {
  const hex_data: string = ascii_to_hex(pad(data));

  let processed_data: Block[] = [];
  for (let i = 0; i < hex_data.length; i += BLOCK_SIZE_BYTE * 2) {
    processed_data.push(new Block(hex_data.slice(i, i + BLOCK_SIZE_BYTE * 2)));
  }

  return processed_data;
}

function preprocess_key(key: string): Block {
  return new Block(ascii_to_hex(pad(key)));
}

export function encrypt_ecb(data: string, key: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);

  let result = "";
  for (let i = 0; i < processed_data.length; i++) {
    let temp = processed_data[i].xor(processed_key);
    temp = encrypt_block_function(temp, processed_key);
    result += temp.getHexData();
  }

  result = hex_to_ascii(result);
  return result;
}

export function decrypt_ecb(data: string, key: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);

  let result = "";
  for (let i = 0; i < processed_data.length; i++) {
    let temp = decrypt_block_function(processed_data[i], processed_key);
    temp = temp.xor(processed_key);
    result += temp.getHexData();
  }

  result = hex_to_ascii(result);
  return result;
}
