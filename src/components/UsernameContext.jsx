import React,{createContext,useState,useEffect} from 'react'


export const UsernameContext = createContext()


export const UsernameProvider =({children})=> {

        const [username,setUserName] = useState(()=>{
            const storedUsername = localStorage.getItem('username')
            return storedUsername ? storedUsername : '';
        })

        const updateUsername = (username)=>{
            setUserName(username)
       
        }

        useEffect(() => {
            localStorage.setItem('username', username);
          }, [username]);

        const [avatar,setAvatar] = useState(()=>{
            const storedAvatar = localStorage.getItem('avatar')
            return storedAvatar ? storedAvatar : '';
        })

        const updateAvatar = (avatar)=>{
            setAvatar(avatar)
        }
        useEffect(() => {
            localStorage.setItem('avatar', avatar);
          }, [avatar]);


  return (
            <UsernameContext.Provider value={{username,updateUsername,updateAvatar,avatar,setAvatar}}>
                {children}
            </UsernameContext.Provider>
  )
}

export default UsernameContext