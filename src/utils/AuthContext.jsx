import React,{createContext,useContext,useState,useEffect} from 'react'
import { account } from '../appwrite/appwriteconfig'
import { useNavigate } from 'react-router-dom'
import {ID} from 'appwrite'
import {UsernameContext} from '../components/UsernameContext'
import '../components/style.css'






const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
  const navigate = useNavigate()
  const {updateUsername} = useContext(UsernameContext)

  const [loading,setLoading] = useState(true)
  const [user,setUser] = useState(null)


  useEffect(() => {
    // setLoading(false)
    checkUserStatus()
    
  }, [])



  const loginUser = async (userInfo)=>{

    setLoading(true)
    


    try {
      let response = await account.createEmailPasswordSession(userInfo.email,userInfo.password)
      let accountDetails = await  account.get();

      setUser(accountDetails)
      
   
  
      
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  
  }

  const logoutUser = async ()=>{
    await account.deleteSession('current')
    setUser(null)
    navigate('/')

    

  }

  const signUp = async (userInfo)=>{
    setLoading(true)

    try {
      let response = await account.create(ID.unique(), userInfo.email, userInfo.password2, userInfo.name)
      await account.createEmailPasswordSession(userInfo.email,userInfo.password2)

      let accountDetails = await account.get()
    

      setUser(accountDetails)
      
      navigate('/avatar')
      updateUsername(accountDetails.name)
    
      
    } catch (error) {
       console.error( error, 'there was an error')
    }

    setLoading(false)
  }

  const checkUserStatus = async()=>{
    try {
      let accountDetails = await account.get();
      setUser(accountDetails)
    
    } catch (error) {
      console.error('no account found')
    }
    setLoading(false)
 
  }

  const contextData = {

    user,
    loginUser,
    logoutUser,
    signUp,
    checkUserStatus

  }

  return (
  <AuthContext.Provider value={contextData}>
  {loading ? (
    <div className="flex h-screen justify-center items-center bg-black">
     <span class="loader"></span>
    </div>
  ) : (
    children
  )}
</AuthContext.Provider>
  )


}

export const useAuth = () =>{  return useContext(AuthContext)}




export default  AuthContext;