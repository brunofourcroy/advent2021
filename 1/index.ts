import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const input: number[] = inputTxT.split('\n').map(Number);

    const res = input.reduce((acc: { count: number, windowSums: number[]}, prev, index, array) => {
        if (index < 2) {
            acc.windowSums.push(0);
            return acc;
        }
        const windowSum = prev + array[index - 1] + array[index - 2];
        acc.windowSums.push(windowSum);
        if (index === 2) {
            return acc;   
        }
        return acc.windowSums[index - 1] < windowSum ? {
            ...acc,
            count: acc.count + 1,
        } : acc;
    }, {
        count: 0,
        windowSums: []
    });

    console.log(res.count);
})();