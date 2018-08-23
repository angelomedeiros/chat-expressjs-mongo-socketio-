import * as express from 'express'
import { createServer, Server } from 'http'
import * as socketIo from 'socket.io'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import UsersRouter from './routes/users'
import IndexRouter from './routes'
import DataAccess from './config/dataAccess'
import * as swaggerUi from 'swagger-ui-express'
import * as YAML from 'yamljs'

const swaggerDocument = YAML.load(path.join(__dirname, '/docs/swagger.yaml'))

export class AppServer {

  public static readonly PORT: number = 3000
  private app: express.Application
  private db : any = new DataAccess().dbConnection
  private server: Server
  private io: SocketIO.Server
  private port: number | string

  constructor() {
    this.createApp()
    this.config()
    this.createServer()
    this.sockets()
    this.listen()

    this.middlewares()
    this.routes()
    this.db()
  }

  private createApp(): void {
    this.app = express()
  }

  private createServer(): void {
    this.server = createServer(this.app)
  }

  private config(): void {
    this.port = this.normalizePort(process.env.PORT || AppServer.PORT)
  }

  private sockets(): void {
    this.io = socketIo(this.server)
  }

  private middlewares(): void {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false })) // Pesquisar o que isso faz!!    
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  }

  private routes(): void {
    this.app.use('/', IndexRouter)
    this.app.use('/users', UsersRouter)    
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`)
    })

    const nsp = this.io.of('/chat')
    nsp.on('connection', (socket) => {

      socket.on('join', (chatId) => {
        socket.join(chatId)
      })

      socket.on('disconnect', () => {        
        console.log('Conexão perdida! com "/chat" ')
      })
      
      socket.on('newMessage', (chatId, message) => {    
        socket.broadcast.to(chatId).emit('addMessage', message)
      })

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

}