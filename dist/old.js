"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
readline.emitKeypressEvents(process.stdin);
const x = 55;
const y = 20;
let grid = [];
const main = () => {
    init();
    printGame();
    drawCell(1, 2, " ");
};
const init = () => {
    for (let a = 0; a < y; a++) {
        const rowArr = [];
        for (let b = 0; b < x; b++) {
            rowArr.push("#");
        }
        grid.push(rowArr);
    }
};
const drawCell = (posX, posY, display) => {
    grid[posY - 1 >= 0 ? posY - 1 : 0][posX - 1 >= 0 ? posX - 1 : 0] = display;
    printGame();
};
const printGame = () => {
    console.clear();
    let mainGameStr = "";
    for (let a = 0; a < y; a++) {
        let rowStr = grid[a].join("");
        mainGameStr += "\n" + rowStr;
    }
    console.log(mainGameStr);
};
const between = (toCheck, min, max) => {
    return (toCheck > min && toCheck < max);
};
between(0, 1, 2);
main();
//# sourceMappingURL=old.js.map