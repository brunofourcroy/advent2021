import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);

type Octopus = {
    energy: number;
    flashed: boolean;
}

const flash = (input: Octopus[][], flashBuffer = 0): { octopuses: Octopus[][], flashCount: number } => {
    let hasFlashed = false;
    let flashCount = flashBuffer;
    const output = input;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input.length; j++) {
            if (output[i][j].energy > 9 && !output[i][j].flashed) {
                output[i][j].flashed = true;
                flashCount++;
                hasFlashed = true;
                if (i > 0) {
                    if (j > 0){
                        output[i - 1][j - 1].energy += 1;
                    }
                    output[i - 1][j].energy += 1;
                    if (j < output[i].length - 1) {
                        output[i - 1][j + 1].energy += 1;
                    }
                }
                if (j > 0) {
                    output[i][j - 1].energy += 1;
                }
                if (j < output[i].length - 1) {
                    output[i][j + 1].energy += 1;
                }
                if (i < output.length - 1) {
                    if (j > 0) {
                        output[i + 1][j - 1].energy += 1;
                    }
                    output[i + 1][j].energy += 1;
                    if (j < output[i].length - 1) {
                        output[i + 1][j + 1].energy += 1;
                    }
                }
            }
        }
    }

    if (hasFlashed) {
        return flash(output, flashCount);
    }

    return { octopuses: output, flashCount };
};

const getFlashes = (input: Octopus[][]): { output: Octopus[][], flashCount: number } => {
    const { octopuses, flashCount } = flash(input.map(line => line.map(octopus => ({ ...octopus, energy: octopus.energy + 1 }))));

    return { output: octopuses.map(line => line.map(octopus => ({
        flashed: false,
        energy: octopus.energy > 9 ? 0 : octopus.energy
    }))), flashCount};
};
const countFlashes = (octopuses: Octopus[][], nbOfSteps: number | null): number => {
    let input = octopuses;
    let totalFlashCount = 0;
    let i = 0;
    while(nbOfSteps ? i < nbOfSteps : true) {
        const { output, flashCount } = getFlashes(input);
        totalFlashCount += flashCount;
        input = output;
        i++;
        const allFlashed = output.every(line => line.every(octopus => octopus.energy === 0));
        if (allFlashed && !nbOfSteps) {
            return i;
        }
    }

    return totalFlashCount;
};

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const octopuses: Octopus[][] = inputTxT.split('\n').map(line => line.split('').map(val => ({ energy: Number(val), flashed: false })));

    console.log(`Part 1: ${countFlashes(octopuses, 100)}`)
    console.log(`Part 2: ${countFlashes(octopuses, null)}`)
})();