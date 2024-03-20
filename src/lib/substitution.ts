import { Block } from "@/model/Block";
import { INVERSE_S_BOX, S_BOX } from "./constants";


export function substitute(block: Block): Block {
  const hexData: string = block.getHexData();
  const hexArray: string[] = [];

  for (let i = 0; i < hexData.length; i += 2) {
    hexArray.push(hexData.slice(i, i + 2));
  }

  const result: string = hexArray.map(hex => {
    const row = parseInt(hex[0], 16);
    const col = parseInt(hex[1], 16);
    return S_BOX[row][col].toString(16).padStart(2, "0");
  }).join("");
  
  return new Block(result);
}

export function inverseSubstitute(block: Block): Block {
  const hexData: string = block.getHexData();
  const hexArray: string[] = [];

  for (let i = 0; i < hexData.length; i += 2) {
    hexArray.push(hexData.slice(i, i + 2));
  }
  
  const result: string = hexArray.map(hex => {
    const row = parseInt(hex[0], 16);
    const col = parseInt(hex[1], 16);
    return INVERSE_S_BOX[row][col].toString(16).padStart(2, "0");
  }).join("");
  
  return new Block(result);
}
