import './Config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './Config/db.js'
import * as Sentry from '@sentry/node'
import { clerkWebhooks } from './Controllers/webhooks.js'
import companyRoutes from './Routes/companyRoutes.js'
import connectCloudinary from './Config/cloudinary.js'
import { protectCompany } from './Middlewares/authMiddleware.js'
import JobRoutes from './Routes/JobRoutes.js'
import UserRoutes from './Routes/UserRoutes.js'
import {clerkMiddleware} from '@clerk/express'
const app = express()

//connect to db

await connectDb()
await connectCloudinary()

app.use(cors())

app.use(express.json())
app.use(clerkMiddleware())
app.get('/',(req,res)=>{
    res.send("API is working")
})

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks',clerkWebhooks);

app.use('/api/company',companyRoutes)
app.use('/api/jobs',JobRoutes)
app.use('/api/users',UserRoutes)

const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})