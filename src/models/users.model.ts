import * as mongoose from 'mongoose'
import { IUser } from '../interfaces/IUser'

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    unique: true,
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  genero: {
    type: String,
    enum: ['m', 'f'],
    required: false
  },
  cpf: {
    type: Number,
    required: true,
    unique: true
  }
})

export const User = mongoose.model<IUser>('User', userSchema, 'usuarios')

