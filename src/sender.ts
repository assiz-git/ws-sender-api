import parsePhoneNumber, { isValidNumber } from "libphonenumber-js"
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

      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED
      })

      client.onAnyMessage((message) => {
        console.log('message', message)
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
}

export default Sender