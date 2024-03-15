import { BLOCK_SIZE_BYTE } from "@/lib/constants";

export class Block {
  // Container for a block with Block Size of BLOCK_SIZE_BYTE
  private data: Uint8Array;

  constructor(data: Uint8Array | string) {
    if (data instanceof Uint8Array) {
      if (data.length !== BLOCK_SIZE_BYTE) throw new Error('Block size must be 16 bytes');
      this.data = data;
    } else if (typeof data === 'string') {
      if (data.length !== BLOCK_SIZE_BYTE * 2) throw new Error('Hex string must be 32 characters');
      this.data = Buffer.from(data, 'hex');
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

  setData(data: Uint8Array): void { 
    if (data.length !== BLOCK_SIZE_BYTE) {
      throw new Error('Block size must be 16 bytes');
    }

    this.data = data;
  }

  setHexData(hexData: string): void {
    this.data = Buffer.from(hexData, 'hex');
  }

  // Bitwise XOR operation
  xor(block: Block): Block {
    const result = new Uint8Array(BLOCK_SIZE_BYTE);
    
    for (let i = 0; i < BLOCK_SIZE_BYTE; i++) {
      result[i] = this.data[i] ^ block.getData()[i];
    }

    return new Block(result);
  }
}