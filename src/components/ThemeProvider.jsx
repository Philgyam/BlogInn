import React,{createContext,useState} from 'react'



export const ThemeContext = createContext()


 export const ThemeProvider =({children})=>{
  const [theme,setTheme]= useState({
      backgroundColor:'bg-gradient-to-br from-black to-teal-500',
      textColor:'text-white'
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

