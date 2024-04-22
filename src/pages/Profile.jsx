import React from 'react'
import { AiOutlineMenu } from "react-icons/ai";



function Profile() {
  const {user,logout} = useAuth()
  
  return (
    <>
    <div className='h-screen w-full bg-[#F5F5F5] pt-3'>
    <div className=' text-white  w-20 cursor-pointer bg-orange-500 py-2 float-right mr-3  px-4 rounded-[1rem]'>
            <button className='cursor-pointer '>
                Logout
            </button>
        </div>

        <div className='flex flex-row gap-4 pl-2 pt-5 items-center '>
            <AiOutlineMenu 
            style={{height:'4rem', width:'2rem'}}
             />
            <div className='rounded-full  h-16 w-16 '>
            <img className='rounded-full' src="https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740" alt="" />

            </div>
            <div >
                Hello JEANE
            </div>
        </div>

    </div>
    </>
  )
}

export default Profile