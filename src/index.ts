import * as express from 'express'

var app = express()

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.post('/', (req, res) => {
  res.send('Hello world from method post!')
})

app.listen(3000, () => {
  console.log('Listening on port 3000...')
})