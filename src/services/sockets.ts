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
        // const result = async () => {
        //   const mensagens = await this.findMensagens(chatId)
        //   return mensagens.toJSON()
        // }
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
      
      socket.on('newMessage', (chatId, message) => {
        console.log(message, chatId)
        const result = this.pushMensagem(chatId, message)
        socket.in(chatId).emit('addMessage', message)
      })
    })
  }

  pushMensagem = (identificador, mensagem) => {
    const query = Conversa.findOneAndUpdate({ identificador: identificador }, { $push: { mensagens: mensagem } }, { new: true, upsert: true })
    query.select('-_id -__v -id')
    query.slice('mensagens', -1)
    // query.where('mensagens').slice(5) // Ou isso
    query.exec().then( result => console.log(result) ).catch( err => console.log(err))
  }

  findMensagens = (identificador) => {
    const query = Conversa.findOne({ identificador: identificador }, '-_id -__v')
      query.slice('mensagens', -50)
    return query
  }
  
}

