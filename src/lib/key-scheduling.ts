import { Block } from "@/model/Block";
import { fisherYatesShuffler } from "./fisher-yates";

export function generateRoundKeys(key: Block, rounds: number): Block[] {
  const keys = new Array<Block>(rounds);

  let currentKey = key.getHexData();
  for (let i = 0; i < rounds; i++) {
    currentKey = fisherYatesShuffler(
      new Block(currentKey, true),
      key,
      true
    ).getHexData();
    keys[i] = new Block(currentKey, true);
  }

  return keys;
}
