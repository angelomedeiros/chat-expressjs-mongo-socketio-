import * as express from 'express'
import { CrudModel } from '../services/crudModel'
import { User } from '../models/users.model'
import { IUser } from '../interfaces/IUser'

class UsersRouter extends CrudModel<IUser> {

  public router: express.Router

  constructor() {
    super(User)
    this.router = express.Router()
    this.Rotas()
  }

  Rotas () {
    this.router.get('/',  this.findAll)
    this.router.get('/:id', this.findById)
    this.router.post('/', this.create)
    this.router.put('/:id', this.update)
    this.router.delete('/:id',this.delete)
    this.router.get('/findOne', this.findOne)
  }  

}

export default new UsersRouter().router
