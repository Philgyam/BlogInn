import React, { useContext, useRef } from 'react';
import { FcGoogle } from "react-icons/fc";
import { BsArrowRight } from "react-icons/bs";
import { ThemeContext } from '../components/ThemeProvider';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const { theme } = useContext(ThemeContext);
  const signupForm = useRef(null);
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = signupForm.current.name.value;
    const email = signupForm.current.email.value;
    const password = signupForm.current.password1.value;
    const password2 = signupForm.current.password2.value;
  
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
  
    const userInfo = { name, email, password };  // Use 'password' instead of 'password1'
    try {
      await signUp(userInfo);
      // Navigation is now handled in the AuthContext
    } catch (error) {
      console.error('Sign up failed:', error);
      alert('Sign up failed. Please try again.');
    }
  };

  const inputClasses = `appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-white bg-opacity-20 backdrop-filter `;

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.backgroundColor}`}>
      <div className="max-w-md w-full space-y-8 p-10 bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter ">
        <div className="flex flex-col items-center">
          <div className='rounded-full h-20 w-20 bg-white overflow-hidden mb-4 shadow-lg'>
            <img className='w-full h-full object-cover' src="https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740" alt="Avatar" />
          </div>
          <h1 className="text-4xl font-bold text-orange-500 mb-2">BlogInn</h1>
          <p className={`text-sm ${theme.backgroundColor === 'bg-black' ? 'text-gray-300' : 'text-gray-600'}`}>
            Join our community of writers and readers
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} ref={signupForm}>
          <div className="rounded-md shadow-sm space-y-4">
            <input id="name" name="name" type="text" required className={inputClasses} placeholder="Username" />
            <input id="email" name="email" type="email" required className={inputClasses} placeholder="Email address" />
            <input id="password1" name="password1" type="password" required className={inputClasses} placeholder="Password" />
            <input id="password2" name="password2" type="password" required className={inputClasses} placeholder="Confirm Password" />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
            >
              Sign Up
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
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-sm font-medium text-white hover:bg-opacity-30 transition duration-150 ease-in-out"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;