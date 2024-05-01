import React,{createContext,useState,useEffect} from 'react'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,databases} from '../appwrite/appwriteconfig';




export const UsernameContext = createContext()


export const UsernameProvider =({children})=> {


    const [username,setUserName] = useState('')

    function updateUsername(username){
        
        setUserName(username)
    }

    
        const getUser = async ()=>{

            const user = await account.get();
            const name= user.name
            updateUsername(name)
         

          
        }

        getUser()
        


    


        

        

        

        

        const [avatar,setAvatar] = useState('')

        const updateAvatar = (avatar)=>{
            setAvatar(avatar)
        }
      

  return (
            <UsernameContext.Provider value={{username,updateUsername,updateAvatar,avatar,setAvatar}}>
                {children}
            </UsernameContext.Provider>
  )
}

export default UsernameContext