import { Block } from "@/model/Block";
import { BLOCK_SIZE_BYTE } from "./constants";

export function blockParser(data: string): Block[] {
  // If the length of the data is not a multiple of BLOCK_SIZE_BYTE, pad the data with 0s in the end
  if (data.length % (2 * BLOCK_SIZE_BYTE) !== 0) {
    const remaining = (2 * BLOCK_SIZE_BYTE) - (data.length % (2 * BLOCK_SIZE_BYTE));
    data += '0'.repeat(remaining);
  }

  const blocks: Block[] = [];

  for (let i = 0; i < data.length; i += 2 * BLOCK_SIZE_BYTE) {
    const block = new Block(data.slice(i, i + 2 * BLOCK_SIZE_BYTE));
    blocks.push(block);
  }

  return blocks;
}