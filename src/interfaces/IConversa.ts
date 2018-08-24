import * as mongoose from 'mongoose'

export interface IMensagem extends mongoose.Document {
  author: string,
  date: string,
  mensagem: string
}

export interface IConversa extends mongoose.Document {
  id: string,
  mensagens: IMensagem[]
}