import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);

const calculateNeededFuel = (crabs: number[], i: number): number =>
(crabs.reduce((sum: number, crab) => {
    const numberOfMoves = Math.abs(crab - i);

    // Gauss sum ftw
    const costForMove = numberOfMoves * (numberOfMoves + 1) / 2;
    
    return sum + costForMove;
},
    0));

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');

    const crabs: number[] = inputTxT.split(',').map(Number);

    crabs.sort();

    const furthestCrab = crabs[crabs.length - 1];
    const closestCrab = crabs[0];

    let lowestFuelAmount: number = 0;
    for (let i = closestCrab; i <= furthestCrab; i++) {
        const neededFuel = calculateNeededFuel(crabs, i);
        if (i === closestCrab) {
            lowestFuelAmount = neededFuel;
        } else {
            lowestFuelAmount = neededFuel < lowestFuelAmount ? neededFuel : lowestFuelAmount;
        }
    }

    console.log(lowestFuelAmount);
})();