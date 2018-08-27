import * as socketIo from 'socket.io'
import { Server } from 'http'
import { Conversa } from '../models/conversa.model'

export class Sockets {

  private io: SocketIO.Server
  private server: Server

  constructor (server) {
    this.server = server
    console.log(this.server)
    this.sockets()
    this.connection()
  }

  private sockets(): void {
    this.io = socketIo(this.server)
  }

  public connection () {
    const nsp = this.io.of('/chat')
    nsp.on('connection', (socket) => {

      socket.on('join', (chatId) => {
        socket.join(chatId)
        this.findMensagens(chatId).then(result => {
          socket.emit('enviar mensagens', result)
        })
      })

      socket.on('disconnect', () => {        
        console.log('Conexão perdida! com "/chat" ')
      })

      socket.on('leave room', (chatId) => {
        socket.leave(chatId)
      })
      
      socket.on('newMessage', (chatId, mensagem) => {
        console.log(mensagem, chatId)
        this.pushMensagem(chatId, mensagem)
        socket.in(chatId).emit('addMessage', mensagem)
      })
    })
  }

  pushMensagem = (identificador, mensagem) => {
    const query = Conversa.findOneAndUpdate({ identificador: identificador }, { $push: { mensagens: mensagem } }, { new: true, upsert: true })
    query.select('-_id -__v -id')
    query.slice('mensagens', -1)
    query.exec().then( result => console.log(result) ).catch( err => console.log(err))
  }

  findMensagens = (identificador) => {
    const query = Conversa.findOne({ identificador: identificador }, '-_id -__v')
      query.slice('mensagens', -50)
    return query
  }
  
}

