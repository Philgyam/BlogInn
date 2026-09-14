import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '@/context/AuthContext'
import PrivateRoutes from '@/routes/PrivateRoutes'
import AppLayout from '@/routes/AppLayout'
import { Loader } from '@/components/Loader'

import Welcome from '@/pages/Welcome'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import Avatar from '@/pages/Avatar'
import Categories from '@/pages/Categories'
import Homepage from '@/pages/Homepage'
import LandingStory from '@/pages/LandingStory'
import NotFound from '@/pages/NotFound'
import OAuthCallback from '@/pages/OAuthCallback'
import VerifyEmail from '@/pages/VerifyEmail'

const Profile = lazy(() => import('@/pages/Profile'))
const AddPost = lazy(() => import('@/pages/AddPost'))
const FullPost = lazy(() => import('@/pages/FullPost'))
const Community = lazy(() => import('@/pages/Community'))

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/stories/:slug" element={<LandingStory />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/avatar" element={<Avatar />} />
              <Route path="/categories" element={<Categories />} />

              <Route element={<AppLayout />}>
                <Route path="/home" element={<Homepage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/community" element={<Community />} />
                <Route path="/post/:author/:category/:id" element={<FullPost />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
