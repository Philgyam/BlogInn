import React,{useState} from 'react'


function Sidebar() {

    const [isClicked, setIsClicked] = useState(false)
    
    const handleClick = () => {
        setIsClicked(!isClicked)
    }

  return (
   <>
    <div className='mt-5 bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50 cursor-pointer'>
            <img className='rounded-full w-16 h-16' src={avatar} alt="" />
            

            </div>
   <button
   onClick={handleClick}
   className='fixed top-0 left-0 p-4 bg-gray-900 text-white'>
     
   </button>
  <div className={`fixed top-10 left-0 h-full w-[20rem] flex flex-col gap-[20rem] bg-gray-900 text-white transition-all duration-300 ease-in-out ${isClicked?'translate-x-0':'-translate-x-full'}`}>
    <div className='pt-10 text-center'>
        <form action="">
            <input type="text" 
            placeholder='search a category'
            className='h-10 w-[15rem] px-2 font-mono bg-black bg-opacity-50 rounded-md shadow-md text-white'
            />
        </form>
        <ul className={`pt-20 flex flex-col gap-[3.5rem] transition-all duration-500 ease-in-out   ${isClicked?'translate-x-0':'-translate-x-full'} `}>
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
   </>
  )
}

export default Sidebar