export function generateRandomBox(size: number): number[] {
    const box = Array.from({length: size}, (_, index) => index);
    for(let i=size-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [box[i], box[j]] = [box[j], box[i]];
    }
    return box;
}

export function shiftArray(array: number[], shift: number): number[] {
    return array.map((_, index, arr) => arr[(index + shift) % arr.length]);
}

export function applyPermutation(input: string, sBox: number[], pBox: number[], iteration: number): string {
    // Implement S-box substitution
    let substitute = Array.from(input).map(char => String.fromCharCode(sBox[char.charCodeAt(0)]));

    // Implement P-box permutation
    let permute = substitute.map((_, index) => substitute[pBox[index % pBox.length]]);

    // Implement Shift Counter
    let shift = shiftArray(permute.map(char => char.charCodeAt(0)), iteration);
    return String.fromCharCode(...shift);
}