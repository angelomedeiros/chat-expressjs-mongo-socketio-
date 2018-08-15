import * as mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  nome: string,
  email: string,
  genero: string,
  cpf: number
}