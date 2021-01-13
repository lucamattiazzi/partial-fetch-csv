# Partial Fetch CSV

Allows to fetch only selected columns from a csv without needing a database or even a specific server.

## How does it work

Via a seldom used (at least, first time I see it) header, [range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range), the client can requests only selected chunks of a resource from a server. A range is defined by a pair of numbers that represent the starting and ending byte of the requested resource.

In order to filter only selected columns though a csv must be first transposed and mapped.

The transposition will rotate the csv table in order to swap columns and rows. Then each new row will be measured in bytes and for each column will be computed the range of bytes that it occupies.

This will generate 2 files: a `transposed.csv` and a `transposed.map.csv`.

## How to use it

The first thing to do is to generate the map and the translated csv file using the following command:
```bash
yarn generate-map path/to/input.csv path/to/output.csv
```
This will save the transposed csv in `path/to/output.csv` and the map in `path/to/output.map.csv`

The map can be either hardcoded or simply fetched from the client (since it's a small file).

Then the function can be called to retrieve the selected columns:

```typescript
import { fetchMap, partialFetch } from '../src'

async function retrieveUrl(url: string, columns: string[]): Promise<JSON> {
  const map = await fetchMap('http://resource.url/transposed.map.csv')
  const csv = await partialFetch('http://resource.url/transposed.csv', map, columns)
  return csv
}
```

The output format can be either `json` (default), `raw` or `matrix`.

The first one will return an array of objects, the second one a csv file as a string, and the third one an array of tuples.

