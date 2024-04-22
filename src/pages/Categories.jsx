import React from 'react'
import { TypeAnimation } from 'react-type-animation';


function Categories() {
  return (
   <>
<div className='flex flex-col   h-screen w-full bg-gradient-to-br from-black to-teal-500 lg:flex-col  '>
<h1 className='text-4xl text-orange-500 mb-5 font-mono text-center mt-2 xl:text-left xl:ml-10'>BlogInn</h1>

        <div className=' text-white text-center  xl:text-left xl:ml-10 text-[2rem]'> 
            <p> Categories </p>
        </div>
        <div className='flex flex-col mt-5 gap-5 bg-[#F6F5F2] bg-opacity-30 mx-[2rem] xl:mx-[20rem]  text-white h-[30rem] justify-center rounded-3xl  '>
            <button className='hover:bg-[#4793AF] cursor-pointer text-[1.5rem] mx-[5rem] xl:mx-[10rem] rounded-xl py-1'>Tech</button>
            <button className='hover:bg-[#4793AF] cursor-pointer text-[1.5rem] mx-[5rem] xl:mx-[10rem] rounded-xl py-1'>Life Style</button>
            <button className='hover:bg-[#4793AF] cursor-pointer text-[1.5rem] mx-[1rem] xl:mx-[10rem] rounded-xl py-1'>Personal Development</button>
            <button className='hover:bg-[#4793AF] cursor-pointer text-[1.5rem] mx-[5rem] xl:mx-[10rem] rounded-xl py-1'>DIY</button>
            <button className='hover:bg-[#4793AF] cursor-pointer text-[1.5rem] mx-[1rem] xl:mx-[10rem] rounded-xl py-1'
            > Business and Finance </button>
            <button className='hover:bg-[#4793AF] cursor-pointer text-[1.5rem] mx-[1rem] xl:mx-[10rem] rounded-xl py-2'>Arts and Culture</button>
        </div>

        <button className='mt-6  xl:ml-10 text-white underline text-left ml-2'>
            <p>
                Other Categories
            </p>
        </button>
        <div className='mt-10 text-white text-center  py-2 px-5 rounded-xl'>
            <button className='text-white py-2 px-5 rounded-xl  bg-orange-500'>
                Next
            </button>
        </div>
        

    </div>
</>
  )
}

export default Categories