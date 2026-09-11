import { createContext, useEffect, useState } from "react";
// import { jobsData } from "../assets/assets";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from 'axios'
import { toast } from "react-toastify";
export const AppContext = createContext()

export const AppContextProvider = (props) =>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    
    const {getToken} = useAuth()

    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''

})
    const [isSearched,setIsSearched] = useState(false)

    const [jobs,setJobs] = useState([])

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)

    // const [companyToken,setCompanyToken] = useState(null)
    const [companyToken, setCompanyToken] = useState(
        () => localStorage.getItem('companyToken')
)
    const [companyData,setCompanyData] = useState(null)
    const [userData,setUserData] = useState(null)
    const [userApplications,setUserApplications] = useState([])
    //function to fetch job data
    
   

    const fetchJobs = async () =>{

        try {
            const {data} = await axios.get(backendUrl+'/api/jobs')

            if(data.success){
                setJobs(data.jobs)

            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }
    
    //function to fetch company data
     
    const fetchCompanyData = async ()=>{
        try {
            
            const {data} = await axios.get(backendUrl+'/api/company/company',{headers:{token:companyToken}})

            if(data.success){
                setCompanyData(data.company)
                console.log(data)
            }
            else{
                // Remove old or invalid recruiter tokens so the app does not
                // keep retrying requests with a malformed JWT.
                if (data.message === 'jwt malformed' || data.message === 'jwt expired' || data.message === 'invalid signature') {
                    localStorage.removeItem('companyToken')
                    setCompanyToken(null)
                    setCompanyData(null)
                }
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    //function to fetch user data

    const fetchUserData = async () =>{
        try {
            const token = await getToken()
            const {data} = await axios.get(backendUrl+'/api/users/user',
                {
                    headers:{Authorization:`Bearer ${token}`}
                }
            )

            if(data.success){
                console.log(data.user)
                setUserData(data.user)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //function to fetch user[s applied application data
    
    const fetchUserApplications = async () =>{
        try {
            const token = await getToken()

            const {data} = await axios.get(backendUrl+'/api/users/applications',
                {headers:{Authorization:`Bearer ${token}`}}
            )

            if(data.success){
                setUserApplications(data.applications)
        
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')
        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)
        }
    },[])
    useEffect(()=>{
        if(companyToken){
            fetchCompanyData()
        }
    },[companyToken])

    useEffect(()=>{
        if(user){
            fetchUserData()
            fetchUserApplications()
        }
    },[user])

    const value = {
        setSearchFilter,searchFilter,
        isSearched,setIsSearched,
        jobs,setJobs,
        showRecruiterLogin,setShowRecruiterLogin,
        companyToken,setCompanyToken,
        companyData,setCompanyData,
        backendUrl,
        userData,setUserData,
        userApplications,setUserApplications,
        fetchUserData,fetchUserApplications
    }

    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}
