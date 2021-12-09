import { readFile } from 'fs';
import { promisify } from 'util';

type Point = {
    x: number;
    y: number;
}

const readFileP = promisify(readFile);

const getBasin = (area: number[][], lowPoint: Point): Point[] => {
    const basin = [lowPoint];

    const { x, y } = lowPoint;

    if (x !== 0 && area[x - 1][y] > area[x][y] && area[x - 1][y] !== 9) {
        const basinBottom = getBasin(area, { x: x -1, y});
        basin.push(...basinBottom.filter(p => !basin.find(bp => bp.x === p.x && bp.y === p.y)));
    }
    if (x !== area.length - 1 && area[x + 1][y] > area[x][y] && area[x + 1][y] !== 9) {
        const basinTop = getBasin(area, { x: x + 1, y});
        basin.push(...basinTop.filter(p => !basin.find(bp => bp.x === p.x && bp.y === p.y)));
    }
    if (y !== 0 && area[x][y - 1] > area[x][y] && area[x][y - 1] !== 9) {
        const basinLeft = getBasin(area, { x, y: y -1});
        basin.push(...basinLeft.filter(p => !basin.find(bp => bp.x === p.x && bp.y === p.y)));
    }
    if (y !== area[x].length - 1 && area[x][y + 1] > area[x][y] && area[x][y + 1] !== 9) {
        const basinRight = getBasin(area, { x, y: y  + 1});
        basin.push(...basinRight.filter(p => !basin.find(bp => bp.x === p.x && bp.y === p.y)));
    }

    return basin;
};

(async () => {
    const inputTxT = await readFileP(`${__dirname}/input.txt`, 'utf-8');
    const points: number[][] = inputTxT.split('\n').map(s => s.split('').map(Number));

    

    const lowPoints: Point[] = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[i].length ; j++) {
            const point = points[i][j];

            if (
                (i === 0 || points[i - 1][j] > point) &&
                (i === points.length - 1 || points[i + 1][j] > point) &&
                (j === 0 || points[i][j - 1] > point) &&
                (j === points[i].length - 1 || points[i][j + 1] > point)
            ) {
                lowPoints.push({ x: i, y: j});
            }
        }
    }
    const basins = lowPoints.map(point => getBasin(points, point));
    basins.sort((b1, b2) => b2.length - b1.length);

    console.log(basins[0].length * basins[1].length * basins[2].length)
})();