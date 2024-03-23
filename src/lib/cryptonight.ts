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
  let temp: string[] = [];

  for (let i = 0; i < ascii.length; i++) {
    temp.push(ascii.charCodeAt(i).toString(16).padStart(2, "0"));
  }

  return temp.join("");
}

function hex_to_ascii(hex: string): string {
  let temp: string[] = [];

  for (let i = 0; i < hex.length; i += 2) {
    temp.push(String.fromCharCode(parseInt(hex.slice(i, i + 2), 16)));
  }

  return temp.join("");
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

function preprocess_iv(iv: string): Block {
  return new Block(ascii_to_hex(pad(iv)));
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

export function encrypt_cfb(data: string, key: string, iv: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);
  const ivBlock: Block = new Block(iv, true);

  let result = "";
  let previousCipherBlock = ivBlock;

  for (let block of processed_data) {
    let cipherBlock = encrypt_block_function(
      previousCipherBlock,
      processed_key
    );
    cipherBlock = block.xor(cipherBlock);
    previousCipherBlock = cipherBlock;
    result += cipherBlock.getHexData();
  }

  return hex_to_ascii(result);
}

export function decrypt_cfb(data: string, key: string, iv: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);
  const ivBlock: Block = new Block(iv, true);

  let result = "";
  let previousCipherBlock = ivBlock;

  for (let block of processed_data) {
    let cipherBlock = encrypt_block_function(
      previousCipherBlock,
      processed_key
    );
    let plainBlock = block.xor(cipherBlock);
    previousCipherBlock = block;
    result += plainBlock.getHexData();
  }

  return hex_to_ascii(result);
}

export function encrypt_ofb(data: string, key: string, iv: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);
  const ivBlock: Block = new Block(iv, true);

  let result = "";
  let feedback = ivBlock;

  for (let block of processed_data) {
    feedback = encrypt_block_function(feedback, processed_key);
    const cipherBlock = block.xor(feedback);
    result += cipherBlock.getHexData();
  }

  return hex_to_ascii(result);
}

export function decrypt_ofb(data: string, key: string, iv: string): string {
  return encrypt_ofb(data, key, iv);
}

export function encrypt_cbc(data: string, key: string, iv: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);
  const processed_iv: Block = preprocess_iv(iv);

  let result: string = "";
  let previousCipherBlock: Block = processed_iv;

  for (let block of processed_data) {
    let temp: Block = block.xor(previousCipherBlock);
    temp = temp.xor(processed_key);
    temp = encrypt_block_function(temp, processed_key);
    previousCipherBlock = temp;
    result += temp.getHexData();
  }

  return hex_to_ascii(result);
}

export function decrypt_cbc(data: string, key: string, iv: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);
  const processed_iv: Block = preprocess_iv(iv);

  let result = "";
  let previousCipherBlock = processed_iv;

  for (let block of processed_data) {
    let temp = decrypt_block_function(block, processed_key);
    temp = temp.xor(processed_key);
    temp = temp.xor(previousCipherBlock);
    previousCipherBlock = block;
    result += temp.getHexData();
  }

  return hex_to_ascii(result);
}

export function encrypt_ctr(data: string, key: string, iv: string): string {
  const processed_data: Block[] = preprocess_data(data);
  const processed_key: Block = preprocess_key(key);
  let counter: Block = preprocess_iv(iv); // Use IV
  counter.increment(); // Increment it first to make it hard to predict

  let result: string = "";

  // Encrypt each block
  for (let block of processed_data) {
    let encryptedCounter: Block = encrypt_block_function(
      counter,
      processed_key
    );
    let temp: Block = block.xor(encryptedCounter);
    result += temp.getHexData();
    counter.increment(); // Increment the counter
  }

  return hex_to_ascii(result);
}

export function decrypt_ctr(data: string, key: string, iv: string): string {
  // Decryption in CTR mode is identical to encryption
  return encrypt_ctr(data, key, iv);
}


// Handle All the binary functions
function padArray(data: Uint8Array, status: string): Uint8Array {
  const pad_length = BLOCK_SIZE_BYTE - (((data.length - 1) % BLOCK_SIZE_BYTE) + 1);
  const num_zeros_added = pad_length - 1; // Number of zeros added at the end
  const paddedArray = new Uint8Array(data.length + pad_length);
  paddedArray.set(data);

  if (status === "encrypt") {
    paddedArray[data.length + pad_length - 1] = num_zeros_added; // Store the count of zeros added at the end
  }

  return paddedArray;
}

function removeTrailingZeros(data: Uint8Array): Uint8Array {
  let num_zeros = data[data.length - 1]; // Get the count of zeros from the last element
  if (num_zeros >= 0 && num_zeros < BLOCK_SIZE_BYTE) {
    return data.subarray(0, data.length - num_zeros - 1); // Remove the trailing zeros
  } else {
    throw new Error("Invalid padding");
  }
}

function preprocess_data_bin(data: Uint8Array, status: string): Block[] {
  let processed_data: Block[] = [];

  const padded = padArray(data, status);
  for (let i = 0; i < padded.length; i += BLOCK_SIZE_BYTE) {
    processed_data.push(new Block(padded.slice(i, i + BLOCK_SIZE_BYTE)));
  }

  return processed_data;
}

function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

export function encrypt_ecb_bin(data: Uint8Array, key: string): Uint8Array {
  const processed_data: Block[] = preprocess_data_bin(data, "encrypt");
  const processed_key: Block = preprocess_key(key);

  const encryptedBlocks: Uint8Array[] = [];
  for (let i = 0; i < processed_data.length; i++) {
    let temp = processed_data[i].xor(processed_key);
    temp = encrypt_block_function(temp, processed_key);
    encryptedBlocks.push(temp.getData());
  }

  return concatUint8Arrays(encryptedBlocks);
}

export function decrypt_ecb_bin(data: Uint8Array, key: string): Uint8Array {
  const processed_data: Block[] = preprocess_data_bin(data, "decrypt");
  const processed_key: Block = preprocess_key(key);

  const decryptedBlocks: Uint8Array[] = [];
  for (let i = 0; i < processed_data.length; i++) {
    let temp = decrypt_block_function(processed_data[i], processed_key);
    temp = temp.xor(processed_key);
    decryptedBlocks.push(temp.getData());
  }

  let joined = concatUint8Arrays(decryptedBlocks)
  return removeTrailingZeros(joined);
}

export function encrypt_ctr_bin(data: Uint8Array, key: string, iv: string): Uint8Array {
  const processed_data: Block[] = preprocess_data_bin(data, "encrypt");
  const processed_key: Block = preprocess_key(key);
  let counter: Block = preprocess_iv(iv); // Use IV
  counter.increment(); // Increment it first to make it hard to predict

  const encryptedBlocks: Uint8Array[] = [];
  for (let block of processed_data) {
    let encryptedCounter: Block = encrypt_block_function(counter, processed_key);
    let temp: Block = block.xor(encryptedCounter);
    encryptedBlocks.push(temp.getData());
    counter.increment(); // Increment the counter
  }

  return concatUint8Arrays(encryptedBlocks);
}

export function decrypt_ctr_bin(data: Uint8Array, key: string, iv: string): Uint8Array {
  const processed_data: Block[] = preprocess_data_bin(data, "decrypt");
  const processed_key: Block = preprocess_key(key);
  let counter: Block = preprocess_iv(iv); // Use IV
  counter.increment(); // Increment it first to make it hard to predict

  const decryptedBlocks: Uint8Array[] = [];
  for (let block of processed_data) {
    let decryptedCounter: Block = encrypt_block_function(counter, processed_key);
    let temp: Block = block.xor(decryptedCounter);
    decryptedBlocks.push(temp.getData());
    counter.increment(); // Increment the counter
  }

  let joined = concatUint8Arrays(decryptedBlocks);
  return removeTrailingZeros(joined);
}