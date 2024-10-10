import React, { useState, useEffect, useContext } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { ThemeContext } from '../components/ThemeProvider';
import { Link } from 'react-router-dom';

function Welcome() {
  const { theme, updateTheme } = useContext(ThemeContext);

  const colorChange1 = () => {
    updateTheme({
      backgroundColor: 'bg-[#FFF3C7]',
      textColor: 'text-black'
    });
  };
  const colorChange2 = () => {
    updateTheme({
      backgroundColor: 'bg-[gradient-to-br from-black to-teal-500]',
      textColor: 'text-white'
    });
  };
  const colorChange3 = () => {
    updateTheme({
      backgroundColor: 'bg-[#ECF8F9]',
      textColor: 'text-black'
    });
  };
  const colorChange4 = () => {
    updateTheme({
      backgroundColor: 'bg-black',
      textColor: 'text-white'
    });
  };

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <>
      <div className={`flex flex-col w-full ${theme.backgroundColor}`}>
        <div>
          <div className='float-right mr-4 mt-5 h-[3.5rem] flex w-[15rem] gap-4 bg-white px-2 py-1 shadow-lg rounded-xl '>
            <div onClick={colorChange1} className='bg-[#FFF3C7] rounded-full basis-1/4'></div>
            <div onClick={colorChange2} className='bg-[#068DA9] rounded-full basis-1/4'></div>
            <div onClick={colorChange3} className='bg-[#ECF8F9] rounded-full basis-1/4'></div>
            <div onClick={colorChange4} className='bg-black rounded-full basis-1/4'></div>
          </div>
        </div>

        <div className='flex flex-col h-screen w-full lg:flex-row lg:h-full '>
          <div className={`pl-[3rem] ${theme.textColor} pt-[5rem] lg:w-[70%] md:flex md:flex-col md:items-center lg:flex lg:items-start`}>
            <h1 className='text-6xl text-orange-500 mb-10 font-mono'>BlogInn</h1>
            <TypeAnimation
              style={{ whiteSpace: 'pre-line', height: '195px', display: 'block', fontSize: '1.5rem' }}
              sequence={[
                `Increase your creativity\nShare with the world,\nEvery piece matters\nEven as we build together`,
              ]}
            />
            <div className='mt-[-3rem] '>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange" className='w-[3rem] h-[10rem] ml-[7.5rem] pt-[4rem] animate-bounce'>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
              </svg>
              <div>
                <Link to='/signIn'>
                  <button className='text-white py-3 px-8 text-2xl rounded-lg hover:shadow-blue-500 shadow-lg bg-[#7D0A0A]'>LogIn</button>
                </Link>
                <Link to='/signUp'>
                  <button className='text-white py-3 px-5 text-2xl rounded-lg shadow-lg bg-[#7D0A0A] hover:shadow-blue-500 ml-3'>Sign Up</button>
                </Link>
              </div>
            </div>
          </div>

          <div className='hidden text-white w-full xl:w-[80%] pr-4 lg:flex lg:flex-col lg:mt-[10rem] lg:pb-2'>
            <div className='flex flex-row h-screen gap-4'>
              <div className="basis-2/4 h-[35rem] xl:h-[25rem] lg:flex flex-col gap-3">
                <div className='basis-1/3 bg-white text-black rounded-[1rem] pt-2 pl-3 pb-2 shadow-2xl'>
                  <div className='float-right pr-4'>SignIn</div>
                  <div>
                    <img style={{ height: '50px' }} src="https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1713258403~exp=1713262003~hmac=40049ffdfe6e43796fc517fe880d3bad4d055e48e00946120ef1431cc510c8f7&w=740" alt="Tessy" />
                  </div>
                  <div>
                    Hey there, you can call me <b>TESSY</b>, I'm a passionate blogger waiting to share with you and also learn from you❤️.
                  </div>
                </div>
                <div className='basis-1/3 flex flex-row gap-4'>
                  <div className='basis-1/2 bg-purple-300 rounded-[1rem]'>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute left-[8rem] inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 left-[8rem] bg-sky-500"></span>
                    </span>
                    <p className='text-black mt-3 pl-2 pb-3'>A new Post on <b>DIY</b>. <br />I think you should check it out</p>
                    <BsArrowUpRightCircleFill
                      style={{ marginLeft: '10px', marginBottom: '10px', color: 'wheat' }}
                    />
                  </div>
                  <div className='basis-1/2 bg-blue-300 rounded-[1rem] text-7xl text-center pt-4 shadow-lg'>
                    ❤️
                    <br />
                    <div className='text-[1rem]'>
                      <BsArrowUpRightCircleFill
                        style={{ marginTop: '1.3rem', marginLeft: '1rem', color: 'black' }}
                      />
                      <p className='mt-[-1rem] ml-4'>fav_Posts 😘</p>
                    </div>
                  </div>
                </div>
                <div className='basis-1/3 bg-indigo-400 rounded-[1rem] p-4'>
                  <h2 className='text-xl font-bold'>Featured Article</h2>
                  <p className='mt-2'>Check out our latest article on travel tips for beginners!</p>
                  <Link to='/travel-tips' className='text-white underline'>Read More</Link>
                </div>
              </div>

              <div className="basis-2/4 h-[35rem] xl:h-[25rem] rounded-[1rem] flex flex-row gap-4 ">
                <div className='basis-1/2 gap-3 flex flex-col'>
                  <div className='basis-1/3 bg-red-400 rounded-[1rem] p-4'>
                    <h2 className='text-xl font-bold'>Upcoming Events</h2>
                    <p className='mt-2'>Join us for our next writing workshop on creativity!</p>
                  </div>
                  <div className='basis-2/3 bg-green-500 rounded-[1rem]'>
                    <div>
                      <img src="https://www.canva.com/design/DAGCk8fRmc4/_AJUAgMUoTnPTX6NLVYL7w/view" alt="Event" />
                    </div>
                  </div>
                </div>
                <div className='basis-1/2 flex gap-3 flex-col'>
                  <div className='basis-2/3 bg-green-500 rounded-[1rem] p-4'>
                    <h2 className='text-xl font-bold'>Community Highlights</h2>
                    <p className='mt-2'>Spotlight on our top contributors this month!</p>
                  </div>
                  <div className='basis-1/3 bg-red-400 rounded-[1rem] p-4'>
                    <h2 className='text-xl font-bold'>Tips & Tricks</h2>
                    <p className='mt-2'>Learn how to improve your writing skills.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
