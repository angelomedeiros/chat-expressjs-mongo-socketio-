import * as mongoose from 'mongoose'
import { IConversa } from '../interfaces/IConversa'

const mensagemSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  mensagem: {
    type: String,
    required: true
  }
})

const conversaSchema = new mongoose.Schema({
  identificador: {
    type: 'String',
    required: true,
    unique: true,
    index: true
  },
  mensagens: {
    type: [mensagemSchema],
    required: true,
    // select: false, // Não exibe as mensagens por padrão nas queries ,
    // default: [] // Testar sem esse parametro // Esse parametro é opcional nesse caso
  }
})

export const Conversa = mongoose.model<IConversa>('Conversa', conversaSchema, 'conversas')