import parsePhoneNumber, { isValidNumber, AsYouType } from "libphonenumber-js"
import { create, Whatsapp, SocketState } from "venom-bot"

// export type QRCode = {
//   base64Qr: string,
//   asciiQR: string,
//   attempts: number | undefined,
//   urlCode: string | undefined
// }

export type QRCode = {
  base64Qr: string,
  attempts: number | undefined
}

class Sender {
  private client: Whatsapp
  private connected: boolean
  private qr: QRCode
  private statusSession: string

  get isConnect() : boolean {
    return this.connected
  }
  
  get qrCode() : QRCode {
    return this.qr
  }
  
  get status() {
    return this.statusSession
  }

  constructor() {
    this.initialize()
  }
  
  private initialize() {
    // const qr = (base64Qr: string, asciiQR: string, attempts: number | undefined, urlCode: string | undefined) => {
    //   this.qr = { base64Qr, asciiQR, attempts, urlCode }
    // }
    const qr = (base64Qr: string, asciiQR: string, attempts: number | undefined ) => {
      this.qr = { base64Qr, attempts }
    }
    const start = (client: Whatsapp) => {
      this.client = client
      //this.sendText('5511996162225@c.us', 'Olá, tudo bem?')

      client.onStateChange((state: SocketState) => {
        this.connected = state === SocketState.CONNECTED
      })

      client.onAnyMessage((message) => {
        //console.log('message', message)
        console.log('Mensagem recebida')
        console.log('Telefone: ', message.sender.id)
        console.log('Nome: ', message.sender.name)
        let phoneNumber = new AsYouType('BR').input(message.from)
        console.log('Telefone Formatado: ', phoneNumber)
        console.log('Mensagem: ', message.body)
      })

    }

    const status = (statusSession: string) => {
      console.log('statusSession', statusSession)
      this.connected = (["isLogged", "qrReadSuccess", "chatsAvailable", "successChatn", "successChat"]).includes(
        statusSession
      )
      this.statusSession = statusSession
    }
  
    create('ws-sender-dev', qr, status)
      .then((client) => start(client))
      .catch((error) => console.error(error))
    }

  async sendText(to: string, body: string) {
    if (!isValidNumber(to, "BR")) {
      throw new Error('Número do telefone inválido!')
    }
    let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164").replace('+', '') as string
    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`
    console.log("phoneNumber", phoneNumber)
    await this.client.sendText(phoneNumber, body)
  }

  async sendListMenu(to: string) {
    if (!isValidNumber(to, "BR")) {
      throw new Error('Número do telefone inválido!')
    }
    let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164").replace('+', '') as string
    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`
    console.log("phoneNumber", phoneNumber)
    const list = [
      {
        title: "Pasta",
        rows: [
          {
            title: "Ravioli Lasagna",
            description: "Made with layers of frozen cheese",
          }
        ]
      },
      {
        title: "Dessert",
        rows: [
          {
            title: "Baked Ricotta Cake",
            description: "Sweets pecan baklava rolls",
          },
          {
            title: "Lemon Meringue Pie",
            description: "Pastry filled with lemonand meringue.",
          }
        ]
      }
    ]
    await this.client.sendListMenu(phoneNumber, "Title", "Subtitle", "Description", "Menu", list)
      .then((result) => {
        console.log("Result", result)
      })
      .catch((error) => {
        console.error("Error when sending: ", error)
      })
  }

  async sendButtons(to: string) {
    if (!isValidNumber(to, "BR")) {
      throw new Error('Número do telefone inválido!')
    }
    let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164").replace('+', '') as string
    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`
    const title = "Button push test"
    const subtitle = "Choose your favorite"
    const buttons = [
      { "buttonText": 
        { "displayText": "Option 1"}
      },
      { "buttonText":
        { "displayText": "Option 2"}
      }]
      await this.client.sendButtons(phoneNumber, title, subtitle, buttons)
      .then((result) => {
        console.log("Result", result)
      })
      .catch((error) => {
        console.error("Error when sending: ", error)
      })
  }
}

export default Sender