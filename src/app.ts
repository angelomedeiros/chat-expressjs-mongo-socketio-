import * as express from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import UsersRouter from './routes/users'
import IndexRouter from './routes'
import DataAccess from './config/dataAccess'
import * as swaggerUi from 'swagger-ui-express'
import * as YAML from 'yamljs'

const swaggerDocument = YAML.load(path.join(__dirname, '/docs/swagger.yaml'))

class App {

  public app: express.Application
  public db : any = new DataAccess().dbConnection

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
    this.db()
  }

  private middlewares () {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false })) // Pesquisar o que isso faz!!    
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  }

  private routes() {
    this.app.use('/', IndexRouter)
    this.app.use('/users', UsersRouter)    
  }

}

export default new App().app