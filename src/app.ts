import * as express from 'express'
import UsersRouter from './routes/users'
import IndexRouter from './routes'

class App {

  public app: express.Application

  constructor() {
    this.app = express()
    this.routes()
  }

  private routes() {

    this.app.use('/', IndexRouter)
    this.app.use('/users', UsersRouter)
    
  }

}

export default new App().app