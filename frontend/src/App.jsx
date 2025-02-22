import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx' 
import { useAuthStore } from './store/useAuthStore.js'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from "./store/useThemeStore";

import {Loader} from 'lucide-react'


const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=  useAuthStore()
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  //console.log({authUser})

  if(isCheckingAuth && !authUser) return (
    <span className="loading loading-spinner text-primary"></span>
  )
  return (
    <div data-theme={theme} > 
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>:<Navigate to="/login"/> }/>
        <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/"/>} />
        <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/>:<Navigate to="/login"/>} />
      </Routes>
      <Toaster />

    </div>
  )
}

export default App
