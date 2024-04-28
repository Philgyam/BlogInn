import React,{useContext,useState} from 'react'
import { useForm } from 'react-hook-form'
import TextEditor from '../components/TextEditor'
import Sidebar from '../components/Sidebar'
import { ThemeContext } from '../components/ThemeProvider'
import {UsernameContext} from '../components/UsernameContext'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'








function AddPost() {

  const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)

  const {theme,updateTheme} = useContext(ThemeContext)

  const {control,handleSubmit,register} = useForm()
  const [success,setSuccess ] = useState(null)

  const navigate = useNavigate()

  const Categories = ['Technology','DIY','Fashion','Education','Health','Relationship']

  const onSubmit = async (data)=>{
    
    const userDetails = await account.get()
    const userId = userDetails.$id
    console.log(userId)

    const {Title,content,Category} = data;
  
    

    try {



   
      
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          Title,
          content,
          Category,
          Author:username,
          Avatar:avatar
        },
      [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId)),
        Permission.update(Role.user(userId)),


      ]
        
      )
       return setSuccess('Post succesful')
        


    } catch (error) {
      console.log(error)
    }

  }
  
  return (
    < div className={`flex flex-col h-screen pt-3 relative  w-full ${theme.backgroundColor} `}>
      <div className='flex '>

   <Sidebar/> 
   <img className='rounded-full w-10 h-10 mr-2' src={avatar} alt=""  />

      </div>
     
     
      <form onSubmit={handleSubmit(onSubmit)} className={`${success ? 'opacity-50':''}`}>


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
      {success && (
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
              Sucess
            </AlertTitle>
            <AlertDescription>Your Post is Up, Enjoy!</AlertDescription>
  
  
           </Alert>
          </div>
        </div>
        
      )}
      
      
    </div>
  )
}

export default AddPost