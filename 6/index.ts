import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);


(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
        
    const fish: number[] = inputTxT.split(',').map(Number);
  
    const fishPopulation = fish.reduce((acc: number[], age) => {
        acc[age] += 1;
        return acc;
    }, Array(9).fill(0));


    for (let i = 0; i < 256; i++) {
        let fishToSpawn = 0;
        for (let j = 0; j < fishPopulation.length; j++) {
            if (j === 0) {
                fishToSpawn = fishPopulation[j];
            } else {
                fishPopulation[j - 1] = fishPopulation[j];
            }
            if (j === 8) {
                fishPopulation[j] = fishToSpawn;
            }
        }
        // Lucky fish parents go back to 6
        fishPopulation[6] += fishToSpawn;
    };
    const total = fishPopulation.reduce((sum, age) => (sum + age), 0);

    console.log(total)
})();