import fetch from 'isomorphic-fetch'
import { fromPairs, sumBy, zip } from 'lodash'
import { parse, unparse } from 'papaparse'
import { transpose } from './lib'

export interface CSVMap extends Record<string, number[]> {}
export type Format = 'raw' | 'json' | 'matrix'

/**
 * The function that retrieves only part of a csv and returns it as a string
 * @param url Url of the mapped csv
 * @param map Generated map of the csv or url where to retrieve it
 * @param columns Columns to retrieve
 * @param format Which format the function will return data into, defaults to json
 */
export async function partialFetch(
  url: string,
  map: CSVMap,
  columns: string[],
  format: 'raw',
): Promise<string>
export async function partialFetch(
  url: string,
  map: CSVMap,
  columns: string[],
  format?: 'json',
): Promise<JSON>
export async function partialFetch(
  url: string,
  map: CSVMap,
  columns: string[],
  format: 'matrix',
): Promise<(string | number)[][]>
export async function partialFetch(
  url: string,
  map: CSVMap,
  columns: string[],
  format: Format = 'json',
): Promise<any> {
  try {
    const ranges = columns
      .filter(col => col in map)
      .map(col => map[col].join('-'))
      .join(', ')
    const response = await fetch(url, {
      headers: {
        range: `bytes=${ranges}`,
      },
    })
    const text = await response.text()
    const parsed = parse<(string | number)[]>(text, { skipEmptyLines: true, dynamicTyping: true })
    const transposed = transpose(parsed.data)
    if (format === 'matrix') return transposed
    if (format === 'raw') return unparse(transposed)
    return transposed.slice(1).map(vals => fromPairs(zip(transposed[0], vals)))
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * The function that retrieves a map if generated via generate-map script
 * @param url Url of the csv map generated
 */
export async function fetchMap(url: string): Promise<CSVMap> {
  try {
    const response = await fetch(url)
    const text = await response.text()
    const parsed = parse<string[]>(text)
    const columns = parsed.data.map<[string, number]>(r => [r[0], Number(r[1])])
    const pairs = columns.map<[string, number[]]>((row, idx) => {
      const cumulatedLength = sumBy(columns.slice(0, idx), r => r[1])
      const start = cumulatedLength
      const end = start + row[1] - 1
      return [row[0], [start, end]]
    }, [])
    return fromPairs(pairs)
  } catch (err) {
    console.error(err)
    throw err
  }
}
