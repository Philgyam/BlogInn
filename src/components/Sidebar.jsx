import React,{useState,useContext,useEffect} from 'react'
import {UsernameContext} from '../components/UsernameContext'
import { ThemeContext } from '../components/ThemeProvider';




function Sidebar() {

    const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)

    const {theme,updateTheme} = useContext(ThemeContext)

    const colorChange1 =()=>{
        updateTheme({
          backgroundColor:'bg-[#FFF3C7]',
          textColor:'text-black'
        })
      }

      const colorChange2 =()=>{
        updateTheme({
          backgroundColor:'bg-[#068DA9]',
          textColor:'text-white'
        })
      }
      
      const colorChange3 =()=>{
        updateTheme({
          backgroundColor:'bg-[#ECF8F9]',
          textColor:'text-black'
        })
      }
      
      
      const colorChange4 =()=>{
        updateTheme({
          backgroundColor:'bg-black',
          textColor:'text-white'
        })
      }
      
      useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme))
       }, [theme])

    const [isClicked, setIsClicked] = useState(false)
    
    const handleClick = () => {
        setIsClicked(!isClicked)
    }

  return (
   <>
    <div className={`flex flex-col   w-full ${theme.backgroundColor} `}>
   <button
   onClick={handleClick}
   className='fixed top-0 left-0 p-4 bg-[#068DA9] text-white'>
     
   </button>
   
  <div className={`fixed top-10 left-0 h-full w-[20rem] flex flex-col  bg-gray-900 text-white transition-all duration-300 ease-in-out ${isClicked?'translate-x-0':'-translate-x-full'}`}>
    <div className='flex flex-row justify-end gap-4 pt-4 pr-4'>
        <div onClick={colorChange1} className='w-7 h-7 bg-[#FFF3C7] rounded-full hover:cursor-pointer'>

        </div>

        <div onClick={colorChange2} className='w-7 h-7 bg-[#068DA9] rounded-full  hover:cursor-pointer'>

</div>
<div onClick={colorChange3} className='w-7 h-7 rounded-full bg-[#ECF8F9]  hover:cursor-pointer'>

</div>
        
<div onClick={colorChange4} className='w-7 h-7  bg-black rounded-full  hover:cursor-pointer'>

</div>
    </div>
  <div className='mt-5 ml-3 bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50 cursor-pointer'>
            <img className='rounded-full w-16 h-16' src={avatar} alt="" />
            

            </div>
    <div className='text-center'>
        
        <ul className={`pt-10 flex flex-col  gap-10`}>
            <li
            className={`transition-all duration-[400ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}
            >
                <button 
                className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                 >
                   My Profile
                </button>
            </li>

            <li 
                className={`transition-all duration-[500ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}

            >
                <button
                   className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                >
                    New Posts
                </button>
            </li>

            <li
              className={`transition-all duration-[600ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}
              >
                <button className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'>
                All Posts
                </button>
               
                
                </li>

            <li
            
            className={`transition-all duration-[700ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}

            >
                <button
                className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                >
                Archives
                </button>
                </li>

            <li
              className={`transition-all duration-[700ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}

            >
                <button  className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                >
                    About BlogInn

                </button>
                </li>
        </ul>
    </div>
        <div className='mt-2 bottom-div text-center'>
      
            Version 1.0
        </div>

  </div>
  </div>
   </>
  )
}

export default Sidebar