import { fetchMap, partialFetch } from '../src'

fetchMap('http://localhost:3000/transposed.map.csv')
  .then(map => partialFetch('http://localhost:3000/transposed.csv', map, ['Age', 'SibSp']))
  .then(res => console.log(res))
