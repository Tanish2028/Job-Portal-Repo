import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../Controllers/UserController.js'
import upload from '../Config/multer.js'

const router = express.Router()

//get user data

router.get('/user',getUserData)

//apply for job

router.post('/apply',applyForJob)

//get applied job data

router.get('/applications',getUserJobApplications)

//update resume

router.post('/update-resume',upload.single('resume'),updateUserResume)

export default router
