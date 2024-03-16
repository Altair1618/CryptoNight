import { Block } from "@/model/Block";
import { fisherYatesShuffler } from "./fisher-yates";

export function feistel(
  data: Block,
  key: Block,
  rounds: number,
  isEncrypt: boolean
): Block {
  // TODO: Implement Key Scheduling
  const keys = new Array<Block>(rounds);
  keys.fill(key); // Temporary

  // Feistel Network
  let result: Block = data;
  for (let i = 0; i < rounds; i++) {
    const key = isEncrypt ? keys[i] : keys[rounds - i - 1];

    let left = new Block(
      result.getHexData().slice(0, result.getHexData().length / 2),
      true
    );

    let right = new Block(
      result.getHexData().slice(result.getHexData().length / 2),
      true
    );

    const temp = left;
    left = fisherYatesShuffler(left, key, !isEncrypt);
    left = left.xor(right);
    right = temp;

    result = new Block(left.getHexData() + right.getHexData());
  }

  return result;
}
