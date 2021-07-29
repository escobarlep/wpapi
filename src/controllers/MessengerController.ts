import { Request, Response } from 'express'
import { MessengerService } from '../services/MessengerService'

export class MessengerController {
  constructor(private service: MessengerService){
    this.service = service
  }

  public async sendMessage(req: Request, res: Response) {
    const { phone, message } = req.body
    try {
      await this.service.sendMessage(phone, message)
      return res.status(200).json({
        message: 'Message sent'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: 'Message not sent',
        error: JSON.stringify(error),
        errorMsg: error.message
      })
    }
  }
}
