type Matrix = (string | number)[][]

export function transpose(matrix: Matrix): Matrix {
  const transposed = []
  for (const colIdx in matrix[0]) {
    const newRow = []
    for (const row of matrix) {
      newRow.push(row[colIdx])
    }
    transposed.push(newRow)
  }
  return transposed
}
