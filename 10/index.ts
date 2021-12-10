import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);

const openingChars = ['(', '[', '{', '<'];
const closingChars = [')', ']', '}', '>'];

const getFirstInvalidChar = (line: string): string | undefined => {
    const buffer: string[] = [];
    return line.split('').find(char => {
        if (openingChars.includes(char)) {
            buffer.push(char);

            return false;
        }
        const closingCharIndex = closingChars.findIndex(c => c === char);
        // The closing char matches the last opening char
        if (buffer[buffer.length - 1] === openingChars[closingCharIndex]) {
            buffer.pop();
            return false;
        }
        return true
    });
};

const getCorruptedScore = (lines: string[]): number => lines.reduce((acc: string[], line) => {
    const firstInvalidChar = getFirstInvalidChar(line);

    if (firstInvalidChar) {
        acc.push(firstInvalidChar);
    }

    return acc;
}, []).reduce((acc: number, char) => {
    if (char === closingChars[0]) return acc + 3;
    if (char === closingChars[1]) return acc + 57;
    if (char === closingChars[2]) return acc + 1197;
    return acc + 25137;
}, 0);

const getAllIncompleteScores = (lines: string[]): number[] => lines.filter(line => {
    const firstInvalidChar = getFirstInvalidChar(line);

    if (firstInvalidChar) {
        return false;
    }

    return true;
}).map(line => 
    line
    .split('')
    .reduce((acc: string[], char) => {
        if (openingChars.includes(char)) {
            acc.push(char);

            return acc;
        }
        const closingCharIndex = closingChars.findIndex(c => c === char);
        // The closing char matches the last opening char
        if (acc[acc.length - 1] === openingChars[closingCharIndex]) {
            acc.pop();
            return acc;
        }
        return acc;
    }, [])
    .reverse()
    .reduce((acc: number, char) => {
        if (char === openingChars[0]) return acc * 5 + 1;
        if (char === openingChars[1]) return acc * 5 + 2;
        if (char === openingChars[2]) return acc * 5 + 3;
        return acc * 5 + 4;
    }, 0));

const getIncompleteScore = (lines: string[]): number => {
    const scores = getAllIncompleteScores(lines);
    scores.sort((a, b) => a - b);

    return scores[Math.ceil((scores.length - 1) / 2)];
}

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const lines: string[] = inputTxT.split('\n');

    console.log(`Part 1: ${getCorruptedScore(lines)}`)
    console.log(`Part 2: ${getIncompleteScore(lines)}`)
})();