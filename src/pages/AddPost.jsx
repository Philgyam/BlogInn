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
import { Spinner } from '@chakra-ui/react'

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
  const [userId,setUserId] = useState('')
  const [upload,setUpload] = useState (false)
  


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
    setUserId(userId)
    
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
          postImage:url,
          postID:userId


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
      setUpload(true)
        if(!userPrevImage) return;
        const fileId  = uuidv4();
         await bucket.createFile(BUCKET_ID,fileId,userPrevImage)
        console.log('file uploaded')
        setUpload(false)
        const fileUrl =  bucket.getFileView(BUCKET_ID,fileId)
        setUrl(fileUrl)

    
        

        
     
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
    <div className='py-5 text-lg font-semibold text-center'>
        Please upload a preview image for your post
    </div>

    <div className='flex flex-col items-center'>
        <input
            type="file"
            name='postImage'
            className='mb-4 border rounded-md p-2 bg-gray-100 text-gray-700'
            onChange={handleFileChange}
        />

        <div className='bg-gray-200 h-[10rem] w-[15rem] rounded-md overflow-hidden flex items-center justify-center'>
            {url ? (
                <img className='h-full w-full object-cover' src={url} alt="Preview" />
            ) : (
                <span className='text-gray-400'>No image selected</span>
            )}
        </div>

        <button
            className='mt-4 text-lg flex items-center w-32 h-10 bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition'
            onClick={handleUploaded}
            type='button'
        >
            <div>Upload</div>
            {upload && (
                <Spinner
                    thickness='3px'
                    style={{
                        height: '1rem',
                        width: "1rem",
                        color: '#FC4100',
                        fontWeight: 'bold',
                        marginLeft: '0.5rem'
                    }}
                />
            )}
        </button>
    </div>
</div>
       
        
<div className='flex items-center justify-center mb-4 gap-8'>
    <select
        name='Category'
        control={control}
        className='h-10 py-2 px-4 bg-cyan-950 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent'
        {...register('Category', { required: true })}
    >
        {Categories.map((category) => (
            <option value={category} key={category}>
                {category}
            </option>
        ))}
    </select>

    <button
        className='py-2 px-6 text-white rounded-lg bg-cyan-950 hover:bg-cyan-700 transition duration-200'
        type="submit"
    >
        Submit
    </button>
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