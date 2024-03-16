import { Block } from "@/model/Block";
import seedrandom from "seedrandom";

export function fisherYatesShuffler(data: Block, seed: Block): Block {
  const rng = seedrandom(seed.getHexData());
  const length = data.getData().length;
  const result = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = data.getData()[i];
  }

  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return new Block(result, data.getData().length === 8);
}
