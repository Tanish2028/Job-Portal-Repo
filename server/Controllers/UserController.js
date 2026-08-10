

//get user data

import { JobApplication } from "../Models/JobApplication.models.js"
import {v2 as cloudinary} from "cloudinary"
import { User } from "../Models/User.models.js"
import { Job } from "../Models/Job.models.js"
export const getUserData = async (req,res) =>{

    const userId = req.auth.userId

    try {
        
        const user = await User.findById(userId)

        if(!user){
            return res.json({success:false,message:'User not found'})
        }

        return res.json({success:true,user})


    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//apply for a job

export const applyForJob = async (req,res)=>{
    const {jobId} = req.body;

    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await JobApplication.find({jobId,userId})

        if(isAlreadyApplied.length > 0){
            return res.json({success:false,message:'Already applied'})
        }
        
        const jobData = await Job.findById(jobId)

        if(!jobData){
            return res.json({success:false,message:'Job not found'})
        }

        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        })

        return res.json({success:true,message:'Applied Successfully'})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//get user applied applications

export const getUserJobApplications = async (req,res)=>{

    try {
        const userId = req.auth.userId

        const applications = await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')

        if(!applications){
            return res.json({success:false,message:'No application available with respect to this'})
        }

        return res.json({success:true,applications})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//update user profile - resume

export const updateUserResume = async (req,res)=>{
    try {
        const userId = req.auth.userId;

        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save();

        return res.json({success:true,message:'Resume updated'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}