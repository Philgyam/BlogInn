import React,{useContext} from 'react'
import { ThemeContext } from '../components/ThemeProvider'
import { CiMenuBurger } from "react-icons/ci";
import { HiSearch } from 'react-icons/hi';

function Homepage() {

  const {theme,updateTheme} = useContext(ThemeContext)

  const fontColor = theme.backgroundColor === 'bg-black' ? 'text-white':''


  return (
    <div className={`flex flex-col h-screen   w-full ${theme.backgroundColor} `}>
        <h1 className='text-2xl text-orange-500 mb-4 ml-1 font-mono text-center mt-1' >BlogInn</h1>
      <div className='flex gap-8'>
        <div className='h-[15] w-10 ml-3' 
        ><CiMenuBurger 
        style={{
          height:'2rem',
          width:'2rem',
          fontStyle:'bold',
          color:fontColor
        
        }}
        /></div>

        <div > 
          <form action="" className='relative flex'>
            <input type="text"
            className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-full shadow-md text-white flex-1 '
            required
            placeholder='search....'
             />
             <button className="absolute right-5 top-3  ">
             <HiSearch className="text-white" />
             </button>
          </form>
        </div>
        
      </div>
    </div>
    
  )
}

export default Homepage
