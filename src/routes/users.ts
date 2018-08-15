import * as express from 'express'
import * as mongoose from 'mongoose'
import { User } from '../models/users.model'

class UsersRouter {

  public mongooseConnection: mongoose.Connection
  public mongooseInstance  : any
  public router            : express.Router

  constructor() {
    this.router = express.Router()
    this.Rotas()
    this.dbConnection()
  }

  Rotas () {

    // FindAll
    this.router.get('/', (req, res) => {
      User.find()
          .then( users => {
            console.log('Succeess', users)
            res.send(users)
          })
          .catch( e => {
            console.log('Succeess', e)
            res.send(e)
          })
      // console.log(req.params.id)
    })

    // FindById

    this.router.get('/:id', (req, res) => {
      // User.findById(req.params.id)
      //     .then( user => {
      //       console.log('findById ', user)
      //       res.send(user)
      //     })
      //     .catch( err => {
      //       console.log('findById error ', err)
      //     })
      User.findById(req.params.id, '-_id -__v', (err, user) => {
        if (err) {
          console.log('findById error ', err)
          return res.send(err)
        }
        console.log('findById ', user)
        res.send(user)
      })
    })

    // Create new User
    this.router.post('/', (req, res) => {
      const teste = new User(req.body)
      teste.save()
           .then( x => {
             res.send(x)
            }
          )
          .catch( e => {
              res.send(e)
            }
          )
      // console.log('Teste')
      // const { nome } = req.body
      // console.log(nome)
      // res.send('Olá angelo')
    })

    // this.router.post('/:id', (req, res) => {
    //   User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
    //     console.log('HAHAHAHAHAHAHAHAHAHAHAH')
    //     if (err) {
    //       console.log('findByIdAndUpdate error ', err)
    //       user.save()
    //       return res.send(err)
    //     }
    //     console.log('findBfindByIdAndUpdateyId ', user)
    //     res.send(user)
    //   })
    // })

    // Update user
    this.router.post('/:id', (req, res) => { // Retorna o objeto encontrado
      const query = User.findByIdAndUpdate(req.params.id, req.body, { new: true })

      query.select('-_id -__v')

      query.exec( (err, user) => {
        if (err) return res.send(err)
        res.send(user)
      })
    })

    // Delete User
    this.router.delete('/:id', (req, res) => {
      User.findByIdAndRemove(req.params.id).exec( (err, user) => {
        console.log('Removeu... ', user)
        res.send({ status: true })
      })
    })

    // Usando o findOne
    this.router.get('/findOne', (req, res) => {  //Não é canse sensitive o path
      const query = User.findOne(req.query)
      query.select('-_id cpf') // Traz o CPF e omite o _id

      query.exec( (err, user) => {
        if (err) return console.log('Errouu...', err)
        res.send(user)
      })

    })

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
