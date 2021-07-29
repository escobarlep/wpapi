import fs, { PathOrFileDescriptor } from 'fs';
import qrcode from 'qrcode-terminal';
import { Client, Message } from 'whatsapp-web.js';

export class MessengerService {
  public sesionFilePath = './src/services/data/session.json'
  public options: any = {}
  public client = {} as Client

  constructor(){
    this.instanciateClient()
    this.startDefaultListeners()
    this.listenToNewMessages()
  }

  logFilePath(): PathOrFileDescriptor {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() +1
    const day = date.getFullYear()
    return `./src/services/data/${year}${month}${day}-messages.log`
  }

  startDefaultListeners() {
    this.client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', (session) => {
      fs.writeFile(this.sesionFilePath, JSON.stringify(session), (err) => {
        if (err) console.error(err);
      });
    });

    this.client.on('ready', () => {
      console.log('Client is ready!');
    });
  }

  listenToNewMessages() {
    this.client.on('message', (message: Message) => {
      try {
        fs.appendFile(this.logFilePath(), JSON.stringify(message)+',', (err) => {
          if (err) console.log(err.message);
        });
      } catch (error) {}
    });
  }

  instanciateClient() {
    if (fs.existsSync(this.sesionFilePath)) {
      const file = fs.readFileSync(this.sesionFilePath, 'utf8')
      this.options = {
        session: JSON.parse(file)
      };
    }
    try {
      this.client = new Client(this.options)
    } catch (error) {
      this.client = new Client({})
    }
  }

  start(){
    this.client.initialize()
  }

  sendMessage(to: string, message: string){
    return this.client.sendMessage(to, message)
  }
}

