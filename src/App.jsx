import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignIn from './pages/SignIn'
import Welcome from './pages/Welcome'
import SignUp from './pages/SignUp'
import Avatar from './pages/Avatar'
import Categories from './pages/Categories'
import Profile from './pages/Profile'
import Homepage from './pages/Homepage'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import { UsernameProvider } from './components/UsernameContext'
import AddPost from './pages/AddPost'
import FullPost from './pages/FullPost'



function App() {



  return (
    <>
   <Router>
    <UsernameProvider>
   
        <AuthProvider>
      <Routes>  
        <Route path='/' element={<Welcome/>}/>
        <Route path='/signIn' element={<SignIn/>}/>
        <Route path='/signUp' element={<SignUp/>}/>

      {/* Protected Pages with Private Routes component */}

      <Route element={<PrivateRoutes />}>
      <Route path='/avatar' element={<Avatar/>}/>
      <Route path='/categories' element={<Categories/>}/>
      <Route path='/Profile' element={<Profile/>}/>
      <Route path='/Home' element ={<Homepage/>}/>
      <Route path='/addPost' element={<AddPost/>}/>
      <Route path='/profile/:user/:Category/:id' element = {<FullPost/>} />

      </Route>
      </Routes>
      </AuthProvider>
      </UsernameProvider>
      </Router>
      
  
      </>
      


  )
}

export default App
