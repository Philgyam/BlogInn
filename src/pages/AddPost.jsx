import React,{useContext} from 'react'
import { useForm } from 'react-hook-form'
import TextEditor from '../components/TextEditor'
import Sidebar from '../components/Sidebar'
import { ThemeContext } from '../components/ThemeProvider'
import {UsernameContext} from '../components/UsernameContext'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'







function AddPost() {

  const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)

  const {theme,updateTheme} = useContext(ThemeContext)

  const {control,handleSubmit,register} = useForm()

  const Categories = ['Technology','DIY','Fashion','Education','Health','Relationship']

  const onSubmit = async (data)=>{

    
    try {

    const userId = await account.get();
    
    const fileContent = data.content
    const fileTitle = data.Title
    const fileCategory = data.category
    const fileId = ID.unique()

    // FILE BLOB

    const fileBlob = new File([
      fileContent
    ],{type:'text/plain'})


    // UPLOADING FILE TO DATABASE
    console.log(fileBlob instanceof File); // Should output: true


    const fileUpload = await bucket.createFile(
      BUCKET_ID,
      fileBlob,
      fileId,
     
      Permission.read(Role.any()),  
      
      `posts/${userId.$id}-${data.title}-${Date.now()}.txt`,{
        contentType:'text/plain',
        

      }

    )

  // DOCUMENT IN DATABASE WITH METADATA

  const dataBaseUpload = await databases.createDocument(
   DATABASE_ID,
   COLLECTION_ID,
   fileId,
   {
    title:fileTitle,
    category:fileCategory,
    authorId:userId.$id,
    fileUrl:fileUpload.$id,
    author : username,
    createdAt:Date.now(),
    updatedAt:Date.now(),
    avatar:avatar
   }

  )
    console.log('upload Succes')
    
      
    } catch (error) {
      console.log(error, 'database related')
    }
  

    
  }
  
  return (
    <div div className={`flex flex-col h-screen pt-3   w-full ${theme.backgroundColor} `}>
      <div className='flex '>

   <Sidebar/> 
   <img className='rounded-full w-10 h-10 mr-2' src={avatar} alt=""  />

      </div>
     
      
      <form onSubmit={handleSubmit(onSubmit)}>
        
        
        <input
         type="text"
         name='Title'
         placeholder='Post Title'
         className='w-full p-4 mb-2 text-center'
         {...register('Title',{required:true})}
                
        />
       

        <TextEditor name='content' control={control} />
        <div className='flex items-center justify-center gap-10'>
        <select
        name='Category'
        control = {control}
       className='h-10 mt-4 py-2 px-4 w-25 bg-cyan-950 text-white rounded-lg'

        >
          {Categories.map((category)=>(
            <option  value={category} key={category}>{category}</option>
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