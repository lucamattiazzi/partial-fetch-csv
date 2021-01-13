export interface CSVMap extends Record<string, number[]> {
}
export declare type Format = 'raw' | 'json' | 'matrix';
export declare function partialFetch(url: string, map: CSVMap, columns: string[], format: 'raw'): Promise<string>;
export declare function partialFetch(url: string, map: CSVMap, columns: string[], format?: 'json'): Promise<JSON>;
export declare function partialFetch(url: string, map: CSVMap, columns: string[], format: 'matrix'): Promise<(string | number)[][]>;
export declare function fetchMap(url: string): Promise<CSVMap>;
