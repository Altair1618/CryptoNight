import { Block } from "@/model/Block";
import { fisherYatesShuffler } from "./fisher-yates";
import { roundFunction } from "./round-function";
import { generateRoundKeys } from "./key-scheduling";

export function feistel(
  data: Block,
  key: Block,
  rounds: number,
  isEncrypt: boolean
): Block {
  // TODO: Implement Key Scheduling
  const keys = generateRoundKeys(key, rounds);

  // Feistel Network
  let result: Block = data;
  for (let i = 0; i < rounds; i++) {
    result = isEncrypt
      ? feistelEncryptRound(result, keys[i])
      : feistelDecryptRound(result, keys[rounds - i - 1]);
  }

  return result;
}

function feistelEncryptRound(data: Block, key: Block): Block {
  let left = new Block(
    data.getHexData().slice(0, data.getHexData().length / 2),
    true
  );

  let right = new Block(
    data.getHexData().slice(data.getHexData().length / 2),
    true
  );

  left = fisherYatesShuffler(left, key, false);
  right = fisherYatesShuffler(right, key, false);

  let encLeft = right;
  let encRight = roundFunction(right, key);
  encRight = encRight.xor(left);

  return new Block(encLeft.getHexData() + encRight.getHexData());
}

function feistelDecryptRound(data: Block, key: Block): Block {
  let left = new Block(
    data.getHexData().slice(0, data.getHexData().length / 2),
    true
  );

  let right = new Block(
    data.getHexData().slice(data.getHexData().length / 2),
    true
  );

  let decRight = left;
  let decLeft = roundFunction(decRight, key);
  decLeft = decLeft.xor(right);
  
  decRight = fisherYatesShuffler(decRight, key, true);
  decLeft = fisherYatesShuffler(decLeft, key, true);

  return new Block(decLeft.getHexData() + decRight.getHexData());
}