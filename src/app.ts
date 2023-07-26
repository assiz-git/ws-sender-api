import { error } from 'console';
import express, { Request, Response } from "express"
import Sender from "./sender";

const sender = new Sender()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/status', (req: Request, res: Response) => {
  return res.send({
    connected: sender.isConnect,
    status: sender.status,
    qr_code: sender.qrCode
  })
})

app.post('/send', async (req: Request, res: Response) => {
  const { number, message } = req.body
  
  try {
    await sender.sendText(number, message)
    return res.status(200).json({ status: "OK"})
  } 
  catch (error) {
    console.error(error)
    return res.status(500).json({ number, message: error})
  }
})

app.listen(5000, () => {
  console.log('server started')
})
