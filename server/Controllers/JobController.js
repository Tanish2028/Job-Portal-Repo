
import {Job} from '../Models/Job.models.js'


//get all job

export const getJobs = async (req,res)=>{
    try {
        const jobs = await Job.find({visible:true})
        .populate({path:'companyId',select:'-password'})

        return res.json({success:true,jobs})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//get a single job by ID

export const getJobById = async (req,res)=>{

    try {
        const {id} = req.params

        const job = await Job.findById(id)
        .populate({
            path:'companyId',
            select:'-password'
        })

        if(!job){
            return res.json({success:false,message:'Job not found'})
        }

        return res.json({success:true,job})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}