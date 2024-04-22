import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { BsArrowRight } from "react-icons/bs";
import { ThemeContext } from '../components/ThemeProvider';
import {useContext,useRef,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext';






function SignIn() {
  const {theme} = useContext(ThemeContext)

  const {user,loginUser} = useAuth()
 
  const loginForm = useRef(null)
const navigate = useNavigate()


useEffect(() => {
  if (user){
    navigate('/Home')
  }

}, [])

  const handleSubmit = (e) =>{
    e.preventDefault()

    const email = loginForm.current.email.value
    const password = loginForm.current.password.value

    const userInfo = {email,password}

    loginUser(userInfo)

    
  }
  


  
  return (
   <>
           <div className={`flex flex-col  h-screen w-full ${theme.backgroundColor}  lg:flex-col items-center `}>
           <h1 className='text-6xl text-orange-500 mb-10 font-mono text-center mt-5'>BlogInn</h1>
          <div className='h-[30rem] xl:h-[29rem] bg-white w-[80%] xl:w-[50%]  rounded-xl bg-opacity-30 flex flex-col items-center pt-5 xl:mb-4'>
             
             <div className='rounded-full h-16 w-16 bg-white'>
             <img className='rounded-full' src="https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740" alt="" />

             </div>
              <form onSubmit={handleSubmit} ref={loginForm}>
                <div className='mt-3 '>
                  <input 
                  type="email"
                  name='email'
                  className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-md shadow-md text-white'
                  required
                  placeholder='Your Email or Username'

                   />
                  
                </div>
                <div className='mt-10  '>
                  <input type="password"
                  name='password'
                  className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-md shadow-md text-white'
                  required
                  placeholder='Password'

                   />
                </div>

                <div className='text-center mt-10 font-mono '>
                  <input type="submit" value='LogIn '
                  className='bg-white py-1 px-4 rounded-xl'
                   />
                  
                </div>
               <div className='flex flex-row gap-3 mt-5  justify-center  text-white '>
                <p className='underline'> SignIn with </p>
               <button>
               <FcGoogle
                />
               </button>

               </div>
               <Link to='/signUp'>
               <div
               className='text-white text-center  pt-4 flex justify-center items-center gap-1'
               >
                <p className=' hover:underline hover:cursor-pointer'>
                  Create an account
                  </p> 
                  
                  <BsArrowRight />
                  </div>


                  </Link>
               
               <div className='text-white underline pt-10 text-center'>
                Forgotten Password?
               </div>

                   
                  
                  
                
              </form>

          </div>




            </div>

   </>
  )
}

export default SignIn