import { BLOCK_SIZE_BYTE } from "@/lib/constants";

export class Block {
  // Container for a block with Block Size of BLOCK_SIZE_BYTE
  // Default is 16 bytes (128 bits)
  // Can be set to 8 bytes (64 bits) by passing isHalf = true for Feistel Network Processing
  private data: Uint8Array = new Uint8Array();

  constructor(data: Uint8Array | string, isHalf = false) {
    if (data instanceof Uint8Array) {
      this.setData(data, isHalf);
    } else if (typeof data === 'string') {
      this.setHexData(data, isHalf);
    } else {
      throw new Error('Data must be Uint8Array or hex string');
    }
  }

  getData(): Uint8Array {
    return this.data;
  }

  getHexData(): string {
    return Buffer.from(this.data).toString('hex');
  }

  toString(): string {
    return Buffer.from(this.data).toString('utf8');
  }

  setData(data: Uint8Array, isHalf = false): void { 
    if (isHalf) {
      if (data.length !== BLOCK_SIZE_BYTE / 2) throw new Error('Block size must be 8 bytes');
    } else {
      if (data.length !== BLOCK_SIZE_BYTE) throw new Error('Block size must be 16 bytes');
    }

    this.data = data;
  }

  setHexData(hexData: string, isHalf = false): void {
    if (isHalf) {
      if (hexData.length !== BLOCK_SIZE_BYTE) throw new Error('Hex string must be 16 characters');
    } else {
      if (hexData.length !== BLOCK_SIZE_BYTE * 2) throw new Error('Hex string must be 32 characters');
    }

    this.data = Buffer.from(hexData, 'hex');
  }

  // Bitwise XOR operation
  xor(block: Block): Block {
    const size = this.data.length;
    const result = new Uint8Array(size);

    for (let i = 0; i < size; i++) {
      result[i] = this.data[i] ^ block.getData()[i];
    }

    return new Block(result);
  }
}