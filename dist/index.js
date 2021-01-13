"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMap = exports.partialFetch = void 0;
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const lodash_1 = require("lodash");
const papaparse_1 = require("papaparse");
const lib_1 = require("./lib");
function partialFetch(url, map, columns, format = 'json') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ranges = columns
                .filter(col => col in map)
                .map(col => map[col].join('-'))
                .join(', ');
            const response = yield isomorphic_fetch_1.default(url, {
                headers: {
                    range: `bytes=${ranges}`,
                },
            });
            const text = yield response.text();
            const parsed = papaparse_1.parse(text, { skipEmptyLines: true, dynamicTyping: true });
            const transposed = lib_1.transpose(parsed.data);
            if (format === 'matrix')
                return transposed;
            if (format === 'raw')
                return papaparse_1.unparse(transposed);
            return transposed.slice(1).map(vals => lodash_1.fromPairs(lodash_1.zip(transposed[0], vals)));
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    });
}
exports.partialFetch = partialFetch;
function fetchMap(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield isomorphic_fetch_1.default(url);
            const text = yield response.text();
            const parsed = papaparse_1.parse(text);
            const columns = parsed.data.map(r => [r[0], Number(r[1])]);
            const pairs = columns.map((row, idx) => {
                const cumulatedLength = lodash_1.sumBy(columns.slice(0, idx), r => r[1]);
                const start = cumulatedLength;
                const end = start + row[1] - 1;
                return [row[0], [start, end]];
            }, []);
            return lodash_1.fromPairs(pairs);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    });
}
exports.fetchMap = fetchMap;
//# sourceMappingURL=index.js.map