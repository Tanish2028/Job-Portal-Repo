import express from 'express'
import { ChangeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../Controllers/companyController.js'
import upload from '../Config/multer.js';
import { protectCompany } from '../Middlewares/authMiddleware.js';


const router = express.Router()

//register a company
router.post('/register',upload.single('image'),registerCompany);

//company login
router.post('/login',loginCompany);

//getcompany data

router.get('/company',protectCompany,getCompanyData);

//post a job

router.post('/post-job',protectCompany,postJob)

//get applicant
router.get('/applicants',protectCompany,getCompanyJobApplicants)

//get company job list
router.get('/list-jobs',protectCompany,getCompanyPostedJobs)

//change application status

router.post('/change-status',protectCompany,ChangeJobApplicationsStatus)

//change applicantions visibility
router.post('/change-visibility',protectCompany,changeVisibility)

export default router;