import * as express from 'express'

class App {

  public app: express.Application

  constructor() {
    this.app = express()
    this.rotas()
  }

  private rotas() {

    const requestTime = (req, res, next) => {
      req.requestTime = Date.now()
      next()
    }
    
    this.app.use(requestTime)
    
    this.app.get('/', (req: any, res) => {
      var responseText = 'Hello world '
      responseText += `Requested at: ${req.requestTime}`
      res.send(responseText)
    })
    
    this.app.post('/', (req, res) => {
      res.send('Hello world from method post!')
    })
    
  }

}

export default new App().app