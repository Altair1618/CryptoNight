import { Block } from "@/model/Block";
import { fisherYatesShuffler } from "./fisher-yates";

export function generateRoundKeys(key: Block, rounds: number): Block[] {
  const keys = new Array<Block>(rounds);

  // Set initial key for 1st round
  keys[0] = key;

  // Iteration for key every round
  // Using seed from prev key to output newest key
  for (let i = 1; i < rounds; i++) {
    let seed = keys[i - 1];
    let currentKeyData = fisherYatesShuffler(
      new Block(seed.getHexData()),
      seed,
      true
    ).getHexData();
    keys[i] = new Block(currentKeyData);
  }
  return keys;
}
