import { Block } from "@/model/Block";
import seedrandom from "seedrandom";

function getBit(data: Block, i: number): number {
  const temp = data.getData()[Math.floor(i / 8)];
  return (temp >> (8 - (i % 8) - 1)) & 1;
}

function swapBit(data: Block, i: number, j: number): void {
  const bitI = getBit(data, i);
  const bitJ = getBit(data, j);
  
  if (bitI !== bitJ) {
    data.getData()[Math.floor(i / 8)] ^= 1 << (8 - (i % 8) - 1);
    data.getData()[Math.floor(j / 8)] ^= 1 << (8 - (j % 8) - 1);
  }

  return;
}

export function fisherYatesShuffler(
  data: Block,
  seed: Block,
  isDeshuffle: boolean
): Block {
  // Fisher-Yates Shuffler to Permute the Data Bits
  const rng = seedrandom(seed.getHexData());
  const length = data.getData().length;
  const result = new Block(data.getHexData(), length === 8);

  // Generate pseudo-random list to shuffle the data
  const randomList = new Array<number>(8 * length);
  
  randomList[0] = 0; // Should not be used in the shuffle process
  for (let i = 8 * length - 1; i > 0; i--) {
    randomList[i] = Math.floor(rng() * (i + 1));
  }

  if (isDeshuffle) {
    for (let i = 1; i < 8 * length; i++) {
      swapBit(result, i, randomList[i]);
    }
  } else {
    for (let i = 8 * length - 1; i > 0; i--) {
      swapBit(result, i, randomList[i]);
    }
  }

  return result;
}
