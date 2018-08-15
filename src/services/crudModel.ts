import * as mongoose from 'mongoose'
import { Response } from 'express';

export abstract class CrudModel<T extends mongoose.Document> {

  constructor (protected model: mongoose.Model<T>) {
  }

  protected findAll = (req, res) => {
    this.model
          .find()
          .then( result => {
            res.send(result)
          })
          .catch( e => {
            res.send(e)
          })
  }

  protected findById = (req, res) => {
    this.model.findById(req.params.id, '-_id -__v', (err, result) => {
      if (err) {
        return res.send(err)
      }
      res.send(result)
    })
  }

  protected create = (req, res: Response) => {
    const document = new this.model(req.body)
    document.save()
            .then( x => {
              res.send(x)
            })
            .catch( e => {
              res.status(401)
              res.send(e)
            })
  }

  protected update = (req, res) => {
    const query = this.model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    query.select('-_id -__v')
    query.exec((err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  }

  protected delete = (req, res) => {
    this.model.findByIdAndRemove(req.params.id)
      .exec( (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  }

  protected findOne = (req, res) => {
    const query = this.model.findOne(req.query)
      query.select('-_id cpf')
      query.exec( (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  }

}
