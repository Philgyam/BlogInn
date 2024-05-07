import React,{useContext,useState,useRef} from 'react'
import { useForm,Controller} from 'react-hook-form'
import Sidebar from '../components/Sidebar'
import { ThemeContext } from '../components/ThemeProvider'
import {UsernameContext} from '../components/UsernameContext'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'
import { useNavigate } from 'react-router-dom'
import { Editor } from "@tinymce/tinymce-react"
import { v4 as uuidv4 } from 'uuid';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'








function AddPost() {

  const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)

  const {theme,updateTheme} = useContext(ThemeContext)
  const [url,setUrl] = useState('')


  const {control,handleSubmit,register,watch,setValue,getValues} = useForm()
  const [success,setSuccess ] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [userPrevImage, setUserPrevImage] = useState(null)


  const navigate = useNavigate()

  const [Content,setContent] = useState('')
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });


 
  

  const Categories = ['Technology','DIY','Fashion','Education','Health','Relationship']

  const onSubmit = async (data)=>{
    
    
    const userDetails = await account.get()
    console.log(userDetails)
    const userId = userDetails.$id
    
    const {Title, Content, Category,postDescribe} = data

  
    
   
    

    try {



   
      
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          Title,
          Content,
          Category,
          Author:username,
          Avatar:avatar,
          dateCreated:currentDate,
          postDescribe,
          postImage:url

        },
      [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId)),
        Permission.update(Role.user(userId)),


      ]
        
      )
       setSuccess('Post succesful')
       setSubmitted(true)
      
       setUserPrevImage(null) 
       


    } catch (error) {
      console.log(error)
    }
    finally{
      setSubmitted(false)

    }

  }




  // /////// IMAGE UPLOAD //////




  const handleFileChange = (e)=>{
      const uploadedFile = e.target.files[0]
      setUrl (URL.createObjectURL(uploadedFile))
      
      setUserPrevImage(uploadedFile)
      
  }



  const handleUploaded = async ()=>{
    try {
        if(!userPrevImage) return;
        const fileId  = uuidv4();
         await bucket.createFile(BUCKET_ID,fileId,userPrevImage)
        console.log('file uploaded')
        const fileUrl =  bucket.getFileView(BUCKET_ID,fileId)
        setUrl(fileUrl)

        console.log(fileUrl)
        

        
     
    } catch (error) {
        console.log(error,'fie upload error')
    }

    
}




  
  return (
    < div className={`flex flex-col h-full pt-3 relative  w-full ${theme.backgroundColor} `}>
      <div className='flex  mt-2'>

   <Sidebar/> 
   <img className='rounded-full w-10 h-10 mr-2' src={avatar} alt=""  />

      </div>
     
     
      <form onSubmit={handleSubmit(onSubmit)}  className={`${success ? 'opacity-50':''}`}>


        <input
         type="text"
         name='Title'
         placeholder='Post Title'
         className='w-full p-4 mb-2 mt-2 text-center'
         {...register('Title',{required:true})}
                
        />

<input
         type="text"
         name='postDescribe'
         placeholder='A short Description for preview'
         className='w-full h-[5rem] p-4 mb-2 text-center'
         {...register('postDescribe', {  defaultValue: '' })}
                
        />

        

           <Editor
          name ='Content'
          
          apiKey="3ydwmu1v69ysn5e4pu1oxwmrdp4a02oj5sear5jwqxk5qh3w"
          initialValue="<p>Please Enter you content here</p>"
          init={{
            height:450,
            menubar: false,
            plugins: [
              'advlist autolink lists link image',
              'charmap print preview anchor help',
              'searchreplace visualblocks code',
              'insertdatetime media table paste wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic | \
              alignleft aligncenter alignright | \
              bullist numlist outdent indent | \
              removeformat | help'
          }}
          onEditorChange={(content, editor) => {
            const strippedContent = content.replace(/<[^>]+>/g, '');
            setValue('Content', strippedContent)
          }}
          
         
         
        />
         
         <div className='mb-10'>

         <div className='py-5 text-[1.1rem]  text-center'>
        Please upload a preview Image for your Post
       </div>

       <div className='flex px-4 items-center'>
        

       <input type="file"
       name='postImage'
      
        className='ml-4'
        onChange={handleFileChange}

       
       />

       <div className='bg-gray-200 h-[5rem] w-[9rem]'>
        <img className='h-[5rem] w-[9rem] object-contain' src={url} alt="" />
     
       </div>

       </div>

       <button
       className='ml-8 text-[1.2rem] bg-blue-600 px-5 py-1 rounded-sm '
       onClick={handleUploaded}
       type='button'
       >Upload</button>

       


         </div>
       
        
        <div className='flex items-center justify-center  mb-4 gap-10'>
        
        <select
        name='Category'
        control = {control}
       className='h-10 mt-4 py-2 px-4 w-25 bg-cyan-950 text-white rounded-lg'
       {...register('Category', { required: true })}
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
      {submitted ? (
        <div className='text-white bg-green-200 py-10 px-10 rounded-xl'>Hello there</div>
      ) : (success ? (
        <div className={`items-center  h-full absolute w-full transition duration-300 ease-in-out flex justify-center`}> 
        <div >
  
           <Alert 
           className={`flex flex-col  gap-4 bg-green-200 py-10 px-10 rounded-xl`}
           status='success'>
            <AlertIcon
            style={{
              height:'1rem',
              color:'green'
            }} 
           
            />
             <AlertTitle
             className='text-2xl font-bold'
             >
              Success
            </AlertTitle>
            <AlertDescription>Your Post is Up, Enjoy!</AlertDescription>
  
  
           </Alert>
          </div>
        </div>
        
      ):null)}

{success && setTimeout(() => {
    navigate('/home'); // navigate to homepage after 3 seconds
  }, 3000)}
      
      
    </div>
  )
}

export default AddPost