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
import Sidebar from './components/Sidebar'



function App() {

  return (
    <>
    <UsernameProvider>
    <Router>
   
        <AuthProvider>
      <Routes>  
        <Route path='/' element={<Welcome/>}/>
        <Route path='/signIn' element={<SignIn/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='/sidebar' element ={<Sidebar/>}/>

      {/* Protected Pages with Private Routes component */}

      <Route element={<PrivateRoutes />}>
      <Route path='/avatar' element={<Avatar/>}/>
      <Route path='/categories' element={<Categories/>}/>
      <Route path='/user' element={<Profile/>}/>
      <Route path='/Home' element ={<Homepage/>}/>
      </Route>
      </Routes>
      </AuthProvider>
      </Router>
      </UsernameProvider>
  
      </>
      


  )
}

export default App
