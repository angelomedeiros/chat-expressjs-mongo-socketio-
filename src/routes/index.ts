import * as express from 'express'

class IndexRouter {

  public router: express.Router

  constructor() {
    this.router = express.Router()
    this.Rotas()
  }

  Rotas () {

    const requestTime = (req, res, next) => {
      req.requestTime = Date()
      next()
    }
    
    this.router.use(requestTime)
    
    this.router.get('/', (req: any, res) => {
      var responseText = 'Hello world '
      responseText += `Requested at: ${req.requestTime}`
      res.send(responseText)
    })
    
    this.router.post('/', (req, res) => {
      res.send('Hello world from method post!')
    })

  }

}

export default new IndexRouter().router
