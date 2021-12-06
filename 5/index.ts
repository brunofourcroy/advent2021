import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);

type Coordinates = {
    x: number;
    y: number;
}

type Line = {
    from: Coordinates
    to: Coordinates
}

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const rows: string[] = inputTxT.split('\n');

    const lines = rows.reduce((acc: Line[], row) => {
        acc.push({
            from: {
                x: Number(row.substring(0, row.indexOf(','))),
                y: Number(row.substring(row.indexOf(',') + 1, row.indexOf(' ')))
            },
            to: {
                x: Number(row.substring(row.lastIndexOf(' ') + 1, row.lastIndexOf(','))),
                y: Number(row.substring(row.lastIndexOf(',') + 1)),
            }
        });

        return acc;
    }, []);

    const board: number[][] = Array(1000);
    for (let i = 0; i < board.length; i++) {
        board[i] = Array(1000).fill(0);
    }

    for (const line of lines) {
        const { from: { x: x1, y: y1 }, to: { x: x2, y: y2 } } = line;
        if (x1 !== x2 && y1 !== y2) {
            // Going top-left
            if (x1 > x2 && y1 > y2) {
                let cursorX = x2;
                let cursorY = y2;
                while (cursorX <= x1) {
                    board[cursorY][cursorX] += 1;
                    cursorX += 1;
                    cursorY += 1;
                }
            }
            // Going bottom-left
            if (x1 > x2 && y1 < y2) {
                let cursorX = x2;
                let cursorY = y2;
                while (cursorX <= x1) {
                    board[cursorY][cursorX] += 1;
                    cursorX += 1;
                    cursorY -= 1;
                }
            }
            // Going top-right
            // 0, 10 -> 5,5
            if (x1 < x2 && y1 > y2) {
                let cursorX = x2;
                let cursorY = y2;
                while (cursorX >= x1) {
                    board[cursorY][cursorX] += 1;
                    cursorX -= 1;
                    cursorY += 1;
                }
            }
            // Going bottom-right
            if (x1 < x2 && y1 < y2) {
                let cursorX = x2;
                let cursorY = y2;
                while (cursorX >= x1) {
                    board[cursorY][cursorX] += 1;
                    cursorX -= 1;
                    cursorY -= 1;
                }
            }
            
        }
        // X is the same, going vertical
        if (x1 === x2) {
            if (y1 > y2) {
                let cursor = y2;
                while (cursor <= y1) {
                    board[cursor][x1] += 1;
                    cursor += 1;
                }
            } else {
                let cursor = y1;
                while (cursor <= y2) {
                    board[cursor][x1] += 1;
                    cursor += 1;
                }
            } 
        }
        // Y is the same, going horizontal
        if (y1 === y2) {
            if (x1 > x2) {
                let cursor = x2;
                while (cursor <= x1) {
                    board[y1][cursor] += 1;
                    cursor += 1;
                }
            } else {
                let cursor = x1;
                while (cursor <= x2) {
                    board[y1][cursor] += 1;
                    cursor += 1;
                }
            }
        }
    }
    const nbOfDangerZones = board.reduce((count: number, row) => {
        const rowCount = row.reduce((rCount: number, val) => {
            if (val > 1) {
                return rCount + 1;
            }
            return rCount;
        }, 0);

        return count + rowCount;
    }, 0);
    console.log(nbOfDangerZones);
})();