import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);


type Input = {
    signals: string[]
    digits: string[]
}[];
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Mapping = Partial<Record<Digit, string>>;
type ReverseMapping = Partial<Record<string, Digit>>

const uniqueDigitLengths: {length: number; digit: Digit }[] = [{
    length: 2,
    digit: '1'
}, {
    length: 4,
    digit: '4'
}, {
    length: 3,
    digit: '7'
}, {
    length: 7,
    digit: '8'
}];

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const input = inputTxT.split('\n').reduce((acc: Input, row) => {
        const [signalsString, digitsString] = row.split('|');
        return [...acc, {
            signals: signalsString.split(' ').map(s => s.trim()).filter(s => s.length > 0),
            digits: digitsString.split(' ').map(s => s.trim()).filter(s => s.length > 0)
        }]
    }, []);;

    const sumOfOutputs = input.reduce((sum: number, row) => {
        const mapping: Mapping = {};
        const { signals } = row;
        // First, map the "easy" digits
        while (Object.keys(mapping).length < uniqueDigitLengths.length) {
            for (const signal of signals) {
                for (const uniqueDigitLength of uniqueDigitLengths) {
                    if (uniqueDigitLength.length === signal.length) {
                        mapping[uniqueDigitLength.digit] = signal;
                    }
                }
            }
        }
        
        // Now that we have the two segments for '1', we can deduce '2' 
        // because it is the only digit that will be missing one of the two segments of '1'.
        const one = mapping['1'];
        if (!one) {
            throw new Error('By then we should have worked out the signal for "1"');
        }
        let topRightSegment: string = '';
        for (const char of one) {
            let numberOfSegmentsMissingChar = 0;
            let signalMissingSegment: string = '';
            for (const signal of signals) {
                if (!signal.includes(char)) {
                    signalMissingSegment = signal;
                    numberOfSegmentsMissingChar += 1;
                }
            }
            if (numberOfSegmentsMissingChar === 1) {
                mapping['2'] = signalMissingSegment;
            } else {
                // The segment included in both 1 and 2 is the top-right segment, which we are going to use below.
                topRightSegment = char;
            }
        }
        for (const signal of signals) {
            // There are only two digits missing the top-right segment
            if (!signal.includes(topRightSegment)) {
                if (signal.length === 6) {
                    mapping['6'] = signal;
                } else {
                    mapping['5'] = signal;
                }
            }
        }

        // The missing segment in '5' compared with '6' is the bottom-left segment.
        let bottomLeftSegment = '';
        const six = mapping['6'];
        const five = mapping['5'];
        if (!five || !six) {
            throw new Error('By then we should have worked out the signal for "5" and "6" by now.');
        }
        for (const  char of six) {
            if (!five.includes(char)) {
                bottomLeftSegment = char;
            }
        }
        // '9' is the only digit missing the bottom left segment.
        for (const signal of signals) {
            if (!signal.includes(bottomLeftSegment) && signal.length === 6) {
                mapping['9'] = signal;
            }
        }

        // '0' is then the only 6-segment digit left
        for (const signal of signals) {
            if (signal.length === 6 && signal !== mapping['6'] && signal !== mapping['9']) {
                mapping['0'] = signal;
            }
        }

        // The last digit is then '3'
        for (const signal of signals) {
            if (!Object.values(mapping).includes(signal)) {
                mapping['3'] = signal;
            }
        }

        // Now that we have the full mapping, we can simply map the digits.
        const reverseMapping = Object.entries(mapping).reduce((acc: ReverseMapping, entry) => {
            const alphabeticalSignalComponents = entry[1].split('').sort();
            acc[alphabeticalSignalComponents.join('')] = entry[0] as Digit;
            
            return acc;
        }, {})
        const { digits } = row;
        const value = digits.reduce((val: string, digit) => {
            const alphabeticalDigitComponents = digit.split('').sort();
            return val += reverseMapping[alphabeticalDigitComponents.join('')] ;
        }, '');

        return sum + Number(value);
    }, 0);
    console.log(sumOfOutputs);

})();