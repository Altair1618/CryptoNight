import { Block } from "@/model/Block";
import { BLOCK_SIZE_BYTE } from "./constants";

function shiftArray(arr: string[], shift: number): string[] {
  return arr.slice(shift).concat(arr.slice(0, shift));
}

export function shiftBlock(block: Block, shift: number): Block {
  const hexData: string = block.getHexData();

  // Split the hex data into an array of 2 character strings (32 )
  const hexArray: string[] = [];
  for (let i = 0; i < hexData.length; i += 2) {
    hexArray.push(hexData.slice(i, i + 2));
  }

  // Shift the array and join it back into a string
  const result: string = shiftArray(hexArray, shift).join("");
  return new Block(result);
}

export function unshiftBlock(block: Block, shift: number): Block {
  return shiftBlock(block, BLOCK_SIZE_BYTE - shift);
}
