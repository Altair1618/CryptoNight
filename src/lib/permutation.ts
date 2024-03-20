// Shift Rows 
export function shiftRows(state: number[][]): number[][] {
    let tempState = [...state]; 
    for (let row = 1; row < 4; row++) {
        tempState[row] = shiftLeft(tempState[row], row);
    }
    return tempState;
}

export function shiftLeft(row: number[], shifts: number): number[] {
    // Copy the row
    let temp = row.slice();
    for (let i = 0; i < shifts; i++) {
        // Operate Shift Left
        temp.push(temp.shift()!);
    }
    return temp;
}

// Mix Columns
export function multiplyInGF(a: number, b: number): number {
    let p = 0;
    let hiBitSet;
    for (let i = 0; i < 8; i++) {
        if ((b & 1) === 1) {
            // IF lowest bit b = 1 -> add a to p
            p ^= a;
        }

        // Check if highest bit a = 1
        hiBitSet = (a & 0x80);

        // Shift a to left 1
        a <<= 1;
        if (hiBitSet === 0x80) {
            // If highest bit is 1 (before shifting), XOR a with 0x1b
            a ^= 0x1b; 
        }

        // Shift b to right 1
        b >>= 1;
    }
    return p & 0xFF;
}

export function mixColumns(state: number[][]): number[][] {
    let tempState = [...state.map(row => [...row])]; 
    for (let col = 0; col < 4; col++) {
        tempState[0][col] = multiplyInGF(0x02, state[0][col]) ^ multiplyInGF(0x03, state[1][col]) ^ state[2][col] ^ state[3][col];
        tempState[1][col] = state[0][col] ^ multiplyInGF(0x02, state[1][col]) ^ multiplyInGF(0x03, state[2][col]) ^ state[3][col];
        tempState[2][col] = state[0][col] ^ state[1][col] ^ multiplyInGF(0x02, state[2][col]) ^ multiplyInGF(0x03, state[3][col]);
        tempState[3][col] = multiplyInGF(0x03, state[0][col]) ^ state[1][col] ^ state[2][col] ^ multiplyInGF(0x02, state[3][col]);
    }
    return tempState;
}