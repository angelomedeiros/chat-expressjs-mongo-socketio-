import * as express from 'express'
import * as bodyParser from 'body-parser'
import UsersRouter from './routes/users'
import IndexRouter from './routes'

class App {

  public app: express.Application

  constructor() {
    this.app = express()
    this.routes()    
  }

  private routes() {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false })) // Pesqiosar o que isso faz!!
    this.app.use('/', IndexRouter)
    this.app.use('/users', UsersRouter)
    
  }

}

export default new App().app