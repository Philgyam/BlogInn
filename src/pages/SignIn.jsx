import React, { useContext, useRef, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { BsArrowRight } from "react-icons/bs";
import { ThemeContext } from '../components/ThemeProvider';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
  const { theme } = useContext(ThemeContext);
  const { user, loginUser, handleAuth } = useAuth(); // Ensure handleAuth is provided
  const loginForm = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/Home');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    const userInfo = { email, password };

    loginUser(userInfo);
  };


  const AuthHandle =()=>{
    handleAuth()
  }

  const inputClasses = `appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-white bg-opacity-20 backdrop-filter`;

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.backgroundColor}`}>
      <div className="max-w-md w-full space-y-8 p-10 bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter">
        <div className="flex flex-col items-center">
          <div className='rounded-full h-20 w-20 bg-white overflow-hidden mb-4 shadow-lg'>
            <img className='w-full h-full object-cover' src="https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740" alt="Avatar" />
          </div>
          <h1 className="text-4xl font-bold text-orange-500 mb-2">BlogInn</h1>
          <p className={`text-sm ${theme.backgroundColor === 'bg-black' ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome back! Please sign in to your account.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} ref={loginForm}>
          <div className="rounded-md shadow-sm space-y-4">
            <input 
              type="email"
              name='email'
              className={inputClasses}
              required
              placeholder='Your Email or Username'
            />
            <input 
              type="password"
              name='password'
              className={inputClasses}
              required
              placeholder='Password'
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
            >
              Log In
              <BsArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme.backgroundColor === 'bg-black' ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={ AuthHandle}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-md bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg text-sm font-medium text-white hover:bg-opacity-40 transition duration-150 ease-in-out"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
          </div>
        </div>

        <Link to='/signUp'>
          <div className='text-white text-center pt-4 flex justify-center items-center gap-1'>
            <p className='hover:underline hover:cursor-pointer'>Create an account</p>
            <BsArrowRight />
          </div>
        </Link>

        <div className='text-white underline pt-6 text-center'>
          Forgotten Password?
        </div>
      </div>
    </div>
  );
}

export default SignIn;