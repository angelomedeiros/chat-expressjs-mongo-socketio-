import * as mongoose from 'mongoose'

export default class DataAccess {

  public mongooseConnection: mongoose.Connection
  public mongooseInstance  : any

  dbConnection () {
    this.mongooseInstance = mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true }) // mongooseInstance
    this.mongooseConnection = mongoose.connection // mongooseConnection
    this.mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
    this.mongooseConnection.once('open', () => {
      console.log('Conexão aberta com o mongo...')
    })
  }

}