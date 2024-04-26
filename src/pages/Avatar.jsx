import React,{useState} from 'react'
import { AiOutlinePlus } from "react-icons/ai";
import { ThemeContext } from '../components/ThemeProvider';
import {useContext} from 'react'
import {UsernameContext} from '../components/UsernameContext'
import {Link} from 'react-router-dom'
import { v4 as uuid } from 'uuid';
import { bucket,BUCKET_ID } from '../appwrite/appwriteconfig';



function Avatar() {


   

    const {theme,updateTheme} = useContext(ThemeContext)

    


    const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)

    const avatar1 = "https://img.freepik.com/free-photo/view-3d-videographer-with-camera_23-2151067043.jpg?t=st=1713291206~exp=1713294806~hmac=35f1088b0e6622ea68370517aec1a6d77a554e1fc1e5ae9f271846dcb72be745&w=740"
    const avatar2 = "https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740"
    const avatar3 = "https://img.freepik.com/free-photo/3d-render-cartoon-asian-girl-with-hat-eyeglasses_1142-51305.jpg?t=st=1713290905~exp=1713294505~hmac=965477b80aaa17f414e8f47cb8296c59941f436e86479003a9d119ae7a00db1b&w=740"
    const avatar4 = "https://img.freepik.com/free-photo/portrait-young-student-education-day_23-2150980069.jpg?t=st=1713288534~exp=1713292134~hmac=11bb57674a785edf19986c8de3b85ee2675f70915e7a49571f375a01c5255efa&w=740"


    const [userImage, setUserImage] = useState(null)

    const handleFileChange = (e)=>{
        const uploadedFile = e.target.files[0]
        setUserImage(uploadedFile)
    }

    const handleUploaded = async ()=>{
        try {
            if(!userImage) return;
            const fileId = uuid();
            console.log(fileId)
            await bucket.createFile(BUCKET_ID,fileId,userImage)
            console.log('file uploaded')
            const fileUrl = await bucket.getFileDownload(BUCKET_ID,fileId)
            updateAvatar(fileUrl)
            
         
        } catch (error) {
            console.log(error,'fie upload error')
        }
    }
 

 

  return (
    <>
    <div className={`flex flex-col  h-screen w-full ${theme.backgroundColor}  lg:flex-col items-center  `}
    >
        <div  className='text-white mt-[5rem] text-2xl'>
            {
            <h1 className='text-black font-bold font-mono'>
                Hello
                <span className='text-orange-500 font-bold text-3xl ml-3'>{username} </span>
                
                </h1>
            }
        </div>
        <div className='mt-5 bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50 cursor-pointer'>
            <img className='rounded-full w-16 h-16' src={avatar} alt="" />
            

            </div>
        <div className='flex mt-[1rem] gap-4 '>
        <div className='mt-5 cursor-crosshair bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50'>
            <img onClick={()=>{
                updateAvatar(avatar1)
            }} className='rounded-full w-16 h-16' src="https://img.freepik.com/free-photo/view-3d-videographer-with-camera_23-2151067043.jpg?t=st=1713291206~exp=1713294806~hmac=35f1088b0e6622ea68370517aec1a6d77a554e1fc1e5ae9f271846dcb72be745&w=740" alt="" />
            </div>
            <div className='mt-5 cursor-crosshair bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50'>
            <img onClick={()=>{
                updateAvatar(avatar2)
            }}  className='rounded-full' src="https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740" alt="" />
            </div>
            <div className='mt-5 cursor-crosshair bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50'>
             <img onClick={()=>{
                updateAvatar(avatar3)
            }}   className='rounded-full w-16 h-16' src="https://img.freepik.com/free-photo/3d-render-cartoon-asian-girl-with-hat-eyeglasses_1142-51305.jpg?t=st=1713290905~exp=1713294505~hmac=965477b80aaa17f414e8f47cb8296c59941f436e86479003a9d119ae7a00db1b&w=740" alt="" />
            </div>
            <div className='mt-5 cursor-crosshair bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50'>
            <img onClick={()=>{
                updateAvatar(avatar4)
            }} src="https://img.freepik.com/free-photo/portrait-young-student-education-day_23-2150980069.jpg?t=st=1713288534~exp=1713292134~hmac=11bb57674a785edf19986c8de3b85ee2675f70915e7a49571f375a01c5255efa&w=740" alt="" className="rounded-full  w-16 h-16" />
            </div>
        </div>
        <div className='mt-10 text-black text-center underline cursor-pointer'>
            <input type="file"
            onChange={handleFileChange}
            
         
             />
             <button  className='bg-blue-500 mt-4 px-4 py-2 rounded-lg' onClick={handleUploaded}>
                Upload avatar
             </button>
       </div>
       <div>
        <form action="Submit">
            <input type="text"
            placeholder='Say Something nice about yourself 😊'
        className='h-20 w-[20rem] pl-1 font-mono mt-10 bg-black bg-opacity-50 rounded-md shadow-md text-white'

            />

        </form>
        </div>
        <div className='mt-10 text-white cursor-pointer bg-orange-500 py-2 px-5 rounded-xl'>
            <Link to='/categories'>
            
            <button className='cursor-pointer'>
                Next
            </button>
            </Link>
        </div>
        <div>
       
        </div>
        
    </div>
    </>
  )
}

export default Avatar