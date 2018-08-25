import * as express from 'express'
import { CrudModel } from '../services/crudModel'
import { Conversa } from '../models/conversa.model'
import { IConversa } from '../interfaces/IConversa'

class ConversasRouter extends CrudModel<IConversa> {

  public router: express.Router

  constructor() {
    super(Conversa)
    this.router = express.Router()
    this.Rotas()
  }

  findMensagens = (req: express.Request, res: express.Response, next) => {
    const query = Conversa.findById(req.params.id, '-_id -__v')
      query.slice('mensagens', -50)
      query.then( conversa => {
        res.send(conversa)
        return next()
    }).catch(next)
  }

  pushMensagem = (req: express.Request, res: express.Response, next) => {
    const query = Conversa.findOneAndUpdate({ identificador: req.params.id }, { $push: { mensagens: req.body } }, { new: true, upsert: true })
    query.select('-_id -__v -id')
    query.slice('mensagens', -10)
    // query.where('mensagens').slice(5) // Ou isso
    query.exec((err, result) => {
      res.send(result)
    })
  }

  Rotas() {
    this.router.get('/',  this.findAll)
    this.router.get('/:id', this.findById)
    this.router.post('/', this.create)
    this.router.put('/:id', this.update)
    this.router.delete('/:id',this.delete)
    this.router.get('/findOne', this.findOne)

    this.router.get('/:id/mensagens', this.findMensagens)
    this.router.put('/:id/mensagens', this.pushMensagem)
  }

}

export default new ConversasRouter().router