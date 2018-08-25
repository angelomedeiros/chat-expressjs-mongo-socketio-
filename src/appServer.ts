import * as express from 'express'
import { createServer, Server } from 'http'
import * as socketIo from 'socket.io'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import UsersRouter from './routes/users'
import ConversasRouter from './routes/conversas'
import IndexRouter from './routes'
import DataAccess from './config/dataAccess'
import * as swaggerUi from 'swagger-ui-express'
import * as YAML from 'yamljs'
import * as Debug from 'debug'
import * as logger from 'morgan'
import { Sockets } from './services/sockets'

const swaggerDocument = YAML.load(path.join(__dirname, '/docs/swagger.yaml'))

export class AppServer {

  public static readonly PORT: number = 3000
  private app: express.Application
  private db : any = new DataAccess().dbConnection
  private server: Server
  private port: number | string
  private debug: any = Debug('chat')

  constructor() {
    this.createApp()
    this.config()
    this.createServer()
    this.ss()
    this.listen()
    
    this.middlewares()
    this.routes()
    this.db()
  }

  public ss() {
    new Sockets(this.server)
  }

  private createApp(): void {
    this.app = express()
  }

  private createServer(): void {
    this.server = createServer(this.app)
    this.server.on('error', this.onError)
  }

  private config(): void {
    this.port = this.normalizePort(process.env.PORT || AppServer.PORT)
  }

  private middlewares(): void {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false })) // Pesquisar o que isso faz!!    
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    // this.app.use(logger('combined'))
    this.app.use(logger('dev'))
  }

  private routes(): void {
    this.app.use('/', IndexRouter)
    this.app.use('/users', UsersRouter)
    this.app.use('/conversas', ConversasRouter)
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      // console.log(`Listening on port ${this.port}`)
      this.debug(`Listening on port ${this.port}`)
    })
  }

  private normalizePort (val): any {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
  }

  public getApp(): express.Application {
    return this.app
  }

  private onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof this.port === 'string'
        ? 'Pipe ' + this.port
        : 'Port ' + this.port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
  }

}