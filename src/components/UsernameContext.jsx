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
    
        

        

        const [avatar,setAvatar] = useState('https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/66306257003b3ba6261b/view?project=66201769ed5710073074&mode=admin')

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