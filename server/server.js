import './Config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './Config/db.js'
import * as Sentry from '@sentry/node'
import { clerkWebhooks } from './Controllers/webhooks.js'


const app = express()

//connect to db

await connectDb()

app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("API is working")
})

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks',clerkWebhooks);


const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})