
// register a new company

import { Company } from "../Models/company.models.js";
import bcrypt from 'bcrypt'

import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../Utils/generateToken.js";
import { Job } from "../Models/Job.models.js";
import { JobApplication } from "../Models/JobApplication.models.js";
export const registerCompany = async (req,res) =>{

    const {name,email,password} = req.body;

    const imageFile = req.file;

    if(!name || !email || !password || !imageFile){
        return res.json({success:false,message:"Missing details"})
    }

    try {
        const companyExists = await Company.findOne({email});

        if(companyExists){
            return res.json({success:false,message:"Already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        
        // console.log(imageFile)

        const hashPassword = await bcrypt.hash(password,salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        
        // console.log(imageUpload)

        const company = await Company.create({
            name,email,password:hashPassword,
            image:imageUpload.secure_url
        })

        return res.json({
            success:true,
            company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image
            },
            token:generateToken(company._id)
        })

    } catch (error) {
        console.error("Uploading to cloudinary",imageFile.path)
        console.error(error.message)
        return res.json({success:false,message:error.message})
    }
}

//company login

export const loginCompany = async (req,res)=>{

    const {email,password} = req.body;

    try {
        
        const company = await Company.findOne({email})

        if(await bcrypt.compare(password,company.password)){
            return res.json({
                success:true,
                company:{
                    _id:company._id,
                    name:company.name,
                    email:company.email,
                    image:company.image
                },
                token:generateToken(company._id)
            })
        }
        else{
            return res.json({success:false,message:'Invalid email or password'})
        }

    } catch (error) {
        return res.json({success:false,message:"Error in login"})
    }
}

//get company data

export const getCompanyData = async (req,res)=>{
    

    try {
        const company = req.company;
        return res.json({success:true,company})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//post a new job

export const postJob = async (req,res)=>{
    const {title,description,location,salary,level,category} = req.body;

    const companyId = req.company._id

    // console.log(companyId,{title,description,location,salary})
    try {
        const newJob = new Job({
            title,
            description,
            salary,
            location,
            companyId,
            date:Date.now(),
            level,
            category
        })

        await newJob.save()

        return res.json({success:true,newJob})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//get company applicants

export const getCompanyJobApplicants = async (req,res)=>{

    try {
        const companyId = req.company._id

        //find job applications for the user and populate related data 
        const applications = await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()

        return res.json({success:true,applications})
    } catch (error) {
        return res.json({success:false,message:error.message})

    }
}

//get company posted job

export const getCompanyPostedJobs = async (req,res)=>{

    try {
        
        const companyId = req.company._id
        const jobs = await Job.find({companyId})

        //adding no. of applicants in a job
        
        const jobsData = await Promise.all(jobs.map(async (job) =>{
            const applicants = await JobApplication.find({jobId: job._id})
            return {...job.toObject(),applicants:applicants.length}
        }))

        return res.json({success:true,jobsData})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//change job application status

export const ChangeJobApplicationsStatus = async (req,res)=>{

    try {
        
        const application = await JobApplication.findById(id);

        if (!application) {
        return res.json({ success: false, message: 'Application not found' });
        }

        if (application.companyId.toString() !== req.company._id.toString()) {
        return res.json({ success: false, message: 'Unauthorized' });
        }

        application.status = status;
        await application.save();

        return res.json({
        success: true,
        message: 'Status changed successfully',
        });

    } catch (error) {
        return res.json({success:false,message:error.message})
    }


}


//change visibility 

export const changeVisibility = async (req,res)=>{
    
    try {
        const {id} = req.body;

        const companyId = req.company._id

        const job = await Job.findById(id)

        if(!job){
            return res.json({success:false,message:'Job not found'})
        }

        if(companyId.toString() !== job.companyId.toString()){
            return res.json({success:false,message:"Unauthorized"})
        }
        
        job.visible = !job.visible
        await job.save()

        return res.json({success:true,job})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
