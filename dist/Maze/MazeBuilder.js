"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MazeBuilder = void 0;
class MazeBuilder {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cols = 2 * this.width + 1;
        this.rows = 2 * this.height + 1;
        this.maze = this.initArray([]);
        this.maze.forEach((row, r) => {
            row.forEach((_, c) => {
                switch (r) {
                    case 0:
                    case this.rows - 1:
                        this.maze[r][c] = ["wall"];
                        break;
                    default:
                        if ((r % 2) == 1) {
                            if ((c == 0) || (c == this.cols - 1)) {
                                this.maze[r][c] = ["wall"];
                            }
                        }
                        else if (c % 2 == 0) {
                            this.maze[r][c] = ["wall"];
                        }
                }
            });
            if (r == 0) {
                let doorPos = this.posToSpace(this.rand(1, this.width));
                this.maze[r][doorPos] = ["door", "exit"];
            }
            if (r == this.rows - 1) {
                let doorPos = this.posToSpace(this.rand(1, this.width));
                this.maze[r][doorPos] = ["door", "entrance"];
            }
        });
        this.partition(1, this.height - 1, 1, this.width - 1);
    }
    initArray(value) {
        return new Array(this.rows).fill("").map(() => new Array(this.cols).fill(value));
    }
    rand(min, max) {
        return min + Math.floor(Math.random() * (1 + max - min));
    }
    posToSpace(x) {
        return 2 * (x - 1) + 1;
    }
    posToWall(x) {
        return 2 * x;
    }
    isWall(r, c) {
        return this.maze[r][c][0] === "wall";
    }
    isGoal(r, c) {
        return this.maze[r][c][0] === "door" && this.maze[r][c][1] === "exit";
    }
    inBounds(r, c) {
        if ((typeof this.maze[r] == "undefined") || (typeof this.maze[r][c] == "undefined")) {
            return false;
        }
        return true;
    }
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    partition(r1, r2, c1, c2) {
        let horiz, vert, x, y, start, end;
        if ((r2 < r1) || (c2 < c1)) {
            return false;
        }
        if (r1 == r2) {
            horiz = r1;
        }
        else {
            x = r1 + 1;
            y = r2 - 1;
            start = Math.round(x + (y - x) / 4);
            end = Math.round(x + 3 * (y - x) / 4);
            horiz = this.rand(start, end);
        }
        if (c1 == c2) {
            vert = c1;
        }
        else {
            x = c1 + 1;
            y = c2 - 1;
            start = Math.round(x + (y - x) / 3);
            end = Math.round(x + 2 * (y - x) / 3);
            vert = this.rand(start, end);
        }
        for (let i = this.posToWall(r1) - 1; i <= this.posToWall(r2) + 1; i++) {
            for (let j = this.posToWall(c1) - 1; j <= this.posToWall(c2) + 1; j++) {
                if ((i == this.posToWall(horiz)) || (j == this.posToWall(vert))) {
                    this.maze[i][j] = ["wall"];
                }
            }
        }
        let gaps = this.shuffle([true, true, true, false]);
        if (gaps[0]) {
            let gapPosition = this.rand(c1, vert);
            this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] = [];
        }
        if (gaps[1]) {
            let gapPosition = this.rand(vert + 1, c2 + 1);
            this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] = [];
        }
        if (gaps[2]) {
            let gapPosition = this.rand(r1, horiz);
            this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] = [];
        }
        if (gaps[3]) {
            let gapPosition = this.rand(horiz + 1, r2 + 1);
            this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] = [];
        }
        this.partition(r1, horiz - 1, c1, vert - 1);
        this.partition(horiz + 1, r2, c1, vert - 1);
        this.partition(r1, horiz - 1, vert + 1, c2);
        this.partition(horiz + 1, r2, vert + 1, c2);
    }
    isGap(...cells) {
        return cells.every((array) => {
            let row, col;
            [row, col] = array;
            if (this.maze[row][col].length > 0) {
                if (!this.maze[row][col].includes("door")) {
                    return false;
                }
            }
            return true;
        });
    }
    countSteps(array, r, c, val, stop) {
        if (!this.inBounds(r, c)) {
            return false;
        }
        if (array[r][c] <= val) {
            return false;
        }
        if (!this.isGap([r, c])) {
            return false;
        }
        array[r][c] = val;
        if (this.maze[r][c].includes(stop)) {
            return true;
        }
        this.countSteps(array, r - 1, c, val + 1, stop);
        this.countSteps(array, r, c + 1, val + 1, stop);
        this.countSteps(array, r + 1, c, val + 1, stop);
        this.countSteps(array, r, c - 1, val + 1, stop);
    }
    getKeyLocation() {
        let fromEntrance = this.initArray();
        let fromExit = this.initArray();
        this.totalSteps = -1;
        for (let j = 1; j < this.cols - 1; j++) {
            if (this.maze[this.rows - 1][j].includes("entrance")) {
                this.countSteps(fromEntrance, this.rows - 1, j, 0, "exit");
            }
            if (this.maze[0][j].includes("exit")) {
                this.countSteps(fromExit, 0, j, 0, "entrance");
            }
        }
        let fc = -1, fr = -1;
        this.maze.forEach((row, r) => {
            row.forEach((_, c) => {
                if (typeof fromEntrance[r][c] == "undefined") {
                    return;
                }
                let stepCount = fromEntrance[r][c] + fromExit[r][c];
                if (stepCount > this.totalSteps) {
                    fr = r;
                    fc = c;
                    this.totalSteps = stepCount;
                }
            });
        });
        return [fr, fc];
    }
    placeKey() {
        let fr, fc;
        [fr, fc] = this.getKeyLocation();
        this.maze[fr][fc] = ["key"];
    }
    display() {
        let mazeString = "";
        this.maze.forEach((row) => {
            row.forEach((cell) => {
                if (cell[0] == "wall") {
                    mazeString += "⬜";
                }
                else if (cell[0] == "door") {
                    mazeString += cell[1] == "entrance" ? "🟩" : "🚪";
                }
                else {
                    mazeString += "⬛";
                }
            });
            mazeString += "\n";
        });
        console.log(mazeString);
    }
    getEntryCoords() {
        for (let i = 0; i < this.maze.length; i++) {
            for (let j = 0; j < this.maze[0].length; j++) {
                if (this.maze[i][j][0] == "door" && this.maze[i][j][1] == "entrance") {
                    return [i, j];
                }
            }
        }
        return [0, 0];
    }
}
exports.MazeBuilder = MazeBuilder;
//# sourceMappingURL=MazeBuilder.js.map