import * as express from 'express'
import { createServer, Server } from 'http'
import * as bodyParser from 'body-parser'
import DataAccess from './config/dataAccess'
import * as Debug from 'debug'
import * as logger from 'morgan'
import { Sockets } from './services/sockets'

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
    this.createSockets()
    this.listen()    
    this.middlewares()
    this.db()
  }

  public createSockets() {
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
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(logger('dev'))
  }

  private listen(): void {
    this.server.listen(this.port, () => {
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