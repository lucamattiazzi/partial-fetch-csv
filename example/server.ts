import http from 'http'
import parseUrl from 'parseurl'
import send from 'send'

const server = http.createServer((req, res) => {
  const path = parseUrl(req).pathname
  send(req, path, { root: './' }).pipe(res)
})

server.listen(3000)
