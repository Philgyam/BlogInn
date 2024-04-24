import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { BsArrowRight } from "react-icons/bs";
import { ThemeContext } from '../components/ThemeProvider';
import {useContext,useRef,useEffect} from 'react'
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';


function SignUp() {
  const {theme} = useContext(ThemeContext)

  const signupForm = useRef(null)
  const {user,signUp} = useAuth()
  const navigate = useNavigate()
 
  

  const handleSubmit= (e)=>{
    e.preventDefault()

    const name = signupForm.current.name.value
    const email = signupForm.current.email.value
    const password1 = signupForm.current.password1.value
    const password2 = signupForm.current.password2.value

    if(password1!==password2){
      alert('unmatched Password')
      return
    }

    const userInfo = {name,email,password2,password2}

    signUp(userInfo)


  }


  return (
    <>
     <div className={`flex flex-col  h-screen w-full   lg:flex-col items-center ${theme.backgroundColor}`}>
           <h1 className='text-6xl text-orange-500 mb-10 font-mono text-center mt-5'>BlogInn</h1>
          <div className='h-[30rem] xl:h-[29rem] bg-white w-[80%] xl:w-[50%]  rounded-xl bg-opacity-30 flex flex-col items-center pt-5 xl:mb-4'>
             
             <div className='rounded-full h-16 w-16 bg-white'>
             <img className='rounded-full' src="https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740" alt="" />

             </div>
              <form onSubmit={handleSubmit} ref={signupForm}>
              <div className='mt-3 '>
                  <input type='text'
                  className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-md shadow-md text-white'
                  required
                  placeholder=' Username'
                  name='name'

                   />
                  
                </div>
                <div className='mt-8 '>
                  <input type="email"
                  name='email'
                  className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-md shadow-md text-white'
                  required
                  placeholder=' Email'

                   />
                  
                </div>
                <div className='mt-8  '>
                  <input type="password"
                  name='password1'
                  className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-md shadow-md text-white'
                  required
                  placeholder='Password'

                   />
                </div>
                <div className='mt-8  '>
                  <input type="password"
                  name='password2'
                  className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-md shadow-md text-white'
                  required
                  placeholder='Retype Password'

                   />
                </div>

                <div className='text-center mt-8 font-mono '>
                  <input type="submit" value='SignUp '
                  className='bg-white py-1 px-4 rounded-xl font-mono'
                   />
                  
                </div>
               <div className='flex flex-row gap-3 mt-5  justify-center  text-white '>
                <p className={`underline  ${theme.backgroundColor === 'bg-black' ? 'text-white' :'text-black' }`} > 
                <button type='submit'>
                SignUp with
                </button>
                 </p>
               <button>
               <FcGoogle
                />
               </button>

               </div>
              
               
               

                   
                  
                  
                
              </form>

          </div>




            </div>

    </>
  )
}

export default SignUp