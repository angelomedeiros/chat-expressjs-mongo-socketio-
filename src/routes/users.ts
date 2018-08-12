import * as express from 'express'

class UsersRouter {

  public router: express.Router

  constructor() {
    this.router = express.Router()
    this.Rotas()
  }

  Rotas () {

    this.router.get('/angelo', (req, res) => {
      res.send('Angelo Medeiros')
    })

    this.router.get('/thalita', (req, res) => {
      res.send('Thalita Oliveira')
    })

  }

}

export default new UsersRouter().router
