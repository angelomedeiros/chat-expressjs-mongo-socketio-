import * as express from 'express'
import * as bodyParser from 'body-parser'
import UsersRouter from './routes/users'
import IndexRouter from './routes'
import DataAccess from './config/dataAccess'

class App {

  public app: express.Application
  public db : any = new DataAccess().dbConnection

  constructor() {
    this.app = express()
    this.routes()
    this.db()
  }

  private routes() {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false })) // Pesquisar o que isso faz!!
    this.app.use('/', IndexRouter)
    this.app.use('/users', UsersRouter)    
  }

}

export default new App().app