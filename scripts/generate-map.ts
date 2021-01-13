import { parse, unparse } from 'papaparse'
import fs from 'fs'
import { zip } from 'lodash'
import { transpose } from '../src/lib'

const NEWLINE = '\n'

const help = `How to use:\n
ts-node generate-map.ts path/to/input.csv path/to/output.csv
or
yarn generate-map path/to/input.csv path/to/output.csv
`

function exitWithMessage(message: string, code: number = 1) {
  console.log(message)
  process.exit(code)
}

function getLength(row: string): number {
  return globalThis['Blob'] ? new globalThis.Blob([row]).size : Buffer.byteLength(row, 'utf-8')
}

function main(path: string, output: string, outputMap: string) {
  try {
    const file = fs.readFileSync(path, 'utf-8')
    const csv = parse(file)
    const data = csv.data as string[][]
    const transposed = transpose(data)
    const final = unparse(transposed, { newline: NEWLINE })
    const columns = data[0]
    const lengths = final.split(NEWLINE).map(r => getLength(r) + getLength(NEWLINE))
    const mapFile = unparse(zip(columns, lengths), { newline: NEWLINE })
    fs.writeFileSync(output, final)
    fs.writeFileSync(outputMap, mapFile)
  } catch (err) {
    exitWithMessage(err.message)
  }
  exitWithMessage('Done!', 0)
}

const input = process.argv[2]
if (input === '--help') exitWithMessage(help, 0)
if (!input) exitWithMessage('Missing input file')
const output = process.argv[3]
if (!output) exitWithMessage('Missing output file')
const outputMap = process.argv[4] || `${output.slice(0, -4)}.map.csv`

main(input, output, outputMap)
