import React,{createContext,useState} from 'react'
import { useAuth } from '../utils/AuthContext';



export const ThemeContext = createContext()




 export const ThemeProvider =({children})=>{
  const [theme,setTheme]= useState(()=>{
     const storedTheme = localStorage.getItem('theme');
     return storedTheme ? JSON.parse(storedTheme): {
          backgroundColor: 'bg-gradient-to-br from-black to-teal-500',
          textColor: 'text-white'
     }

  })

  const updateTheme = (newtheme)=>{
    setTheme(newtheme)
  }






  return (
       <ThemeContext.Provider value={{theme,updateTheme}}>
            {children}
       </ThemeContext.Provider>
  )
}

