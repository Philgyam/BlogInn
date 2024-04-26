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

  const Categories = ['Technology','DIY','Fashion','Education','Health','Relationship']

  const onSubmit =(data)=>{
    console.log(data)
  }
  
  return (
    <div div className={`flex flex-col h-screen pt-3   w-full ${theme.backgroundColor} `}>
      <div className='flex '>

   <Sidebar/> 
   <img className='rounded-full w-10 h-10 mr-2' src={avatar} alt=""  />

      </div>
     
      <div className='mb-5 text-gray-400 text-2xl text-center mt-5'>
        Add Post
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextEditor name='content' control={control} />
        <div className='flex items-center justify-center gap-10'>
        <select
        name='Category'
        control = {control}
       
        >
          {Categories.map((category)=>(
            <option value={category} key={category}>{category}</option>
          ))}

        </select>
        <button
        className='mt-5 ml-5 py-2 px-4 text-white rounded-md bg-cyan-950'
         type="submit">Submit</button>
         </div>
      </form>
    </div>
  )
}

export default AddPost