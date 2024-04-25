import React,{useContext} from 'react'
import { useForm } from 'react-hook-form'
import TextEditor from '../components/TextEditor'
import Sidebar from '../components/Sidebar'
import { ThemeContext } from '../components/ThemeProvider'
import {UsernameContext} from '../components/UsernameContext'





function AddPost() {

  const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)

  const {theme,updateTheme} = useContext(ThemeContext)

  const {control,handleSubmit} = useForm()

  const onSubmit =(data)=>{
    console.log(data)
  }
  
  return (
    <div div className={`flex flex-col h-screen pt-3   w-full ${theme.backgroundColor} `}>
      <div className='flex '>
   <Sidebar/> 
   <img className='rounded-full w-16 h-16 mr-2' src={avatar} alt=""  />

      </div>
     
      <div className='mb-5 text-gray-400 text-2xl text-center mt-5'>
        Add Post
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextEditor name='content' control={control} />
        <button
        className='mt-5 ml-5 py-2 px-4 text-white rounded-md bg-cyan-950'
         type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddPost