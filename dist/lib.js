"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpose = void 0;
function transpose(matrix) {
    const transposed = [];
    for (const colIdx in matrix[0]) {
        const newRow = [];
        for (const row of matrix) {
            newRow.push(row[colIdx]);
        }
        transposed.push(newRow);
    }
    return transposed;
}
exports.transpose = transpose;
//# sourceMappingURL=lib.js.map