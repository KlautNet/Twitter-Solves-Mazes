"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
const main = () => {
    generateMaze();
    let mazeString = getSymbolicMaze();
    console.log(mazeString);
};
let stack = [];
let dimension = 25;
let maze = new Array(dimension);
for (let i = 0; i < maze.length; i++) {
    maze[i] = new Array(dimension);
}
const generateMaze = () => {
    stack.push(new Node_1.GridNode(0, 0));
    while (stack.length > 0) {
        const next = stack.pop();
        if (validNextNode(next)) {
            maze[next.y][next.x] = 1;
            let neighbors = findNeighbors(next);
            randomlyAddNodesToStack(neighbors);
        }
    }
};
const getSymbolicMaze = () => {
    let mazeString = "";
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            mazeString += maze[i][j] == 1 ? "⬜" : "⬛";
            mazeString += " ";
        }
        mazeString += "\n";
    }
    return mazeString;
};
const validNextNode = (node) => {
    let numNeighboringOnes = 0;
    for (let y = node.y - 1; y < node.y + 2; y++) {
        for (let x = node.x - 1; x < node.x + 2; x++) {
            if (pointOnGrid(x, y) && pointNotNode(node, x, y) && maze[y][x] == 1) {
                numNeighboringOnes++;
            }
        }
    }
    return (numNeighboringOnes < 3) && maze[node.y][node.x] != 1;
};
const findNeighbors = (node) => {
    let neighbors = [];
    for (let y = node.y - 1; y < node.y + 2; y++) {
        for (let x = node.x - 1; x < node.x + 2; x++) {
            if (pointOnGrid(x, y) && pointNotCorner(node, x, y)
                && pointNotNode(node, x, y)) {
                neighbors.push(new Node_1.GridNode(x, y));
            }
        }
    }
    return neighbors;
};
const randomlyAddNodesToStack = (nodes) => {
    let targetIndex;
    while (nodes.length > 0) {
        targetIndex = genRandomNumber(0, nodes.length - 1);
        const node = nodes[targetIndex];
        stack.push(node);
        nodes.splice(targetIndex, 1);
    }
};
const pointOnGrid = (x, y) => {
    return x >= 0 && y >= 0 && x < dimension && y < dimension;
};
const pointNotCorner = (node, x, y) => {
    return (x == node.x || y == node.y);
};
const pointNotNode = (node, x, y) => {
    return !(x == node.x && y == node.y);
};
const genRandomNumber = (min = 1, max) => {
    var vMin = +min;
    var vMax = +max;
    return Math.floor(Math.random() * (vMax - vMin + 1) + vMin);
};
main();
//# sourceMappingURL=old-2.js.map