import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { MessengerService } from './services/MessengerService'
import { MessengerController } from './controllers/MessengerController'

const messengerService = new MessengerService()
const controller = new MessengerController(messengerService)
const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())

app
  .post('/', controller.sendMessage.bind(controller))

app.listen(3000, () => {
  messengerService.start()
})
