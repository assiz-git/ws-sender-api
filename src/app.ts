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

app.get('/contacts', async (req: Request, res: Response) => {
  try {
    await sender.getContacts()
    const contacts = sender.contacts
    //console.log("Contatos", contacts)
    return res.status(200).json(contacts)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: "NOK" })
  }
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

app.post('/send/buttons', async (req: Request, res: Response) => {
  const { number } = req.body
  
  try {
    await sender.sendButtons(number)
    return res.status(200).json({ status: "OK"})
  } 
  catch (error) {
    console.error(error)
    return res.status(500).json({ number, message: error})
  }
})

app.post('/send/reply', async (req: Request, res: Response) => {
  const { number, id } = req.body

  try {
    await sender.reply(number, id)
    return res.status(200).json({ status: "OK"})
  } 
  catch (error) {
    console.error(error)
    return res.status(500).json({ number, message: error})
  }
})

app.post('/send/list', async (req: Request, res: Response) => {
  const { number } = req.body
  
  try {
    await sender.sendListMenu(number)
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
