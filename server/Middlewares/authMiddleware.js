import jwt from 'jsonwebtoken'
import { Company } from '../Models/company.models.js'

export const protectCompany = async (req,res,next) =>{

    const token = req.headers.token

    if(!token){
        return res.json({success:false,message:"Not a valid token,login again"})
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.company = await Company.findById(decoded.id).select('-password')

        next()
    } catch (error) {
        return res.json({success:false,message:error.message})
    }

}

export default protectCompany