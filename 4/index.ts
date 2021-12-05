import { readFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);

type BoardValue = {
    value: number;
    marked: boolean;
}

type Board = {
    hasWon: boolean;
    values: BoardValue[][];
}

const checkRowsForWin = (board: BoardValue[][]): boolean => board.some(row => row.every(val => val.marked));
const checkColumnsForWin = (board: BoardValue[][]): boolean => {
    let hasWinningColumn = false;
    for (let i = 0; i < board[0].length; i++) {
        hasWinningColumn = board.every(row => row[i].marked);
        if (hasWinningColumn) {
            break;
        }
    }
    return hasWinningColumn;
}

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const rows: string[] = inputTxT.split('\n');

    const { boards, draw } = rows.reduce((acc: { boards: Board[], draw: number[] }, row, index) => {
        if (index === 0) {
            acc.draw = row.split(',').map(Number);

            return acc;
        }
        // Boards are separated by empty rows
        if (row.length !== 0) {
            const lastBoard = acc.boards.length ? (acc.boards[acc.boards.length - 1].values.length < 5 ? acc.boards[acc.boards.length - 1] : { hasWon: false, values: [] }) : { hasWon: false, values: [] };
            if (!lastBoard.values.length) {
                acc.boards.push(lastBoard);
            }

            lastBoard.values.push(row.split(' ').map(s => s.trim()).filter(s => s.length > 0).map(s => ({ value: Number(s), marked: false })));
        }

        return acc;
    }, {
        boards: [],
        draw: []
    });
    let drawCount = -1;
    let currentDraw: number | null = null;
    let winningBoard: Board | null = null;

    const numberOfBoards = boards.length;
    let numberOfWins = 0;
    while (numberOfBoards !== numberOfWins) {
        drawCount += 1;

        currentDraw = draw[drawCount];
        for (const board of boards) {
            if (board.hasWon) {
                continue;
            }
            let hadAMark = false;
            for (const row of board.values) {
                for (const val of row) {
                    if (val.value === currentDraw) {
                        val.marked = true;
                        hadAMark = true;
                    }
                }
            }
            // Saves checking boards that have not changed
            if (hadAMark) {
                const hasWinningRow = checkRowsForWin(board.values);
                const hasWinningColumn = checkColumnsForWin(board.values);
                if (hasWinningRow || hasWinningColumn) {
                    board.hasWon = true;
                    winningBoard = board;
                    numberOfWins += 1;
                }
            }

        }
    }
    if (!winningBoard || !currentDraw) {
        throw new Error('Something went wrong');
    }
    const sumOfUnmarked = winningBoard.values.reduce((sum: number, row) => {
        const rowSum = row.filter(val => !val.marked).reduce((rSum: number, val) => (rSum + val.value), 0);

        return sum + rowSum;
    }, 0);

    console.log(sumOfUnmarked * currentDraw);
})();