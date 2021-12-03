import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const instructions: string[] = inputTxT.split('\n');

    const res = instructions.reduce((acc: { horizontal: number, depth: number, aim: number }, prev) => {
        const [direction, valueS] = prev.split(' ');
        const value = Number(valueS);

        switch (direction) {
            case 'forward':
                return {
                    ...acc,
                    horizontal: acc.horizontal + value,
                    depth: acc.depth + acc.aim * value
                };
            case 'up':
                return {
                    ...acc,
                    aim: acc.aim - value
                }
            case 'down':
                return {
                    ...acc,
                    aim: acc.aim + value
                }
        }

        return acc;
    }, {
        horizontal: 0,
        depth: 0,
        aim: 0
    });

    console.log(res.horizontal * res.depth);
})();