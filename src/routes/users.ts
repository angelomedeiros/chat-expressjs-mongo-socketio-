import * as express from 'express'
import * as mongoose from 'mongoose'
import { CrudModel } from '../services/crudModel'
import { User } from '../models/users.model'
import { IUser } from '../interfaces/IUser'

class UsersRouter extends CrudModel<IUser> {

  public mongooseConnection: mongoose.Connection
  public mongooseInstance  : any
  public router            : express.Router

  constructor() {
    super(User)
    this.router = express.Router()
    this.Rotas()
    this.dbConnection()
  }

  Rotas () {
    this.router.get('/',  this.findAll)
    this.router.get('/:id', this.findById)
    this.router.post('/', this.create)
    this.router.post('/:id', this.update)
    this.router.delete('/:id',this.delete)
    this.router.get('/findOne', this.findOne)
  }

  dbConnection () {
    this.mongooseInstance = mongoose.connect('mongodb://localhost:27017/teste-express-mongo', { useNewUrlParser: true }) // mongooseInstance
    this.mongooseConnection = mongoose.connection // mongooseConnection
    this.mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
    this.mongooseConnection.once('open', () => {
      console.log('Conexão aberta com o mongo...')
    })
  }

}

export default new UsersRouter().router
