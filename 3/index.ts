import { readFile } from 'fs';
import { promisify } from 'util';

enum RatingType {
    OXYGEN,
    CO2
};

const readFileP = promisify(readFile);

const getRating = (bits: string[][], cursor: number, ratingType: RatingType): string[] => {
    if (bits.length === 1) {
        return bits[0];
    }
    const bitSplit = bits.reduce((acc: { '0': string[][], '1': string[][]}, bitRow) => {
        if (bitRow[cursor] === '0') {
            acc['0'].push(bitRow);
        } else {
            acc['1'].push(bitRow);
        }
        return acc;
    }, { '0': [], '1': [] });

    if (ratingType === RatingType.OXYGEN) {
        if (bitSplit['0'].length > bitSplit['1'].length) {
            return getRating(bitSplit['0'], cursor + 1, RatingType.OXYGEN);
        }
        return getRating(bitSplit['1'], cursor + 1, RatingType.OXYGEN);
    }
    if (bitSplit['0'].length > bitSplit['1'].length) {
        return getRating(bitSplit['1'], cursor + 1, RatingType.CO2);
    }
    return getRating(bitSplit['0'], cursor + 1, RatingType.CO2);
};

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const bits: string[][] = inputTxT.split('\n').map(bits => bits.split(''));

    const oxygenRating = getRating(bits, 0, RatingType.OXYGEN).join('');
    const co2Rating = getRating(bits, 0, RatingType.CO2).join('');

    const oxygenDec = Number.parseInt(oxygenRating, 2);
    const co2Dec = Number.parseInt(co2Rating, 2);

    console.log(oxygenDec * co2Dec);
})();