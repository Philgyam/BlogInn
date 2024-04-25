import React,{useContext,useCallback} from 'react'
import { useForm } from 'react-hook-form'
import TextEditor from '../components/TextEditor'
import Sidebar from '../components/Sidebar'
import { ThemeContext } from '../components/ThemeProvider'
import {UsernameContext} from '../components/UsernameContext'
import service from '../appwrite/config'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'





function AddPost({post}) {
  const {register,control,handleSubmit,getValues,setValue,watch} = useForm({
    defaultValues:{
      title: post?.title || '',
      slug:post?.slug || '',
      content: post?.content,
      category: post?.category || 'general'
    }
  })

  const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)

  const {theme,updateTheme} = useContext(ThemeContext)


  const onSubmit = async (data)=>{
    console.log(data)
  }

  const slugTransform = useCallback((value) => {
    if(value && typeof value === "string") return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, '-')
    .replace(/\s/g, "-")
}, [])

React.useEffect(()=>{

  watch((value,{name})=>{
    if(name ==='title'){
      setValue('slug',slugTransform(value.title),{shouldValidate:true})
    }
  })

},[watch,slugTransform,setValue])




  
  return (
    <div div className={`flex flex-col h-screen pt-3   w-full ${theme.backgroundColor} `}>
      <div className='flex '>
   <Sidebar/> 
   <img className='rounded-full w-16 h-16 mr-2' src={avatar} alt=""  />

      </div>
{/*      
      <div className='mb-5 text-gray-400 text-2xl text-center mt-5'>
        Add Post
      </div> */}

      <Input
      label='Title'
      placeholder = 'Title'
      className = 'mb-4'
      {...register('title',{required:true})}
      />

      
<Input
      label='Slug'
      placeholder = 'Slug'
      className = 'mb-4'
      {...register('slug',{required:true})}
      
      />
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