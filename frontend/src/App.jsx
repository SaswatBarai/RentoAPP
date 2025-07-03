import React from 'react'
import { Routes, Route } from "react-router-dom"
import { MainLayout } from './layout/MainLayout.jsx';
import Home from "./pages/Home.jsx"
import Rentals from "./pages/Rentals.jsx"
import Contact from "./pages/Contact.jsx"
import Help from "./pages/Help.jsx"
import { LoginForm } from './components/LoginForm.jsx';
import { RegisterForm } from './components/RegisterForm.jsx';
import {GoogleWrapper} from "./components/wrapper/GoogleWrapper.jsx"
import {AuthCheck} from "./utils/checkAuth.js"
import { ErrorSection } from './pages/Error.jsx';

function App() {
  AuthCheck()

  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/rentals' element={<Rentals />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/help' element={<Help />} />
        <Route path="/login" element={
          <GoogleWrapper>
            <LoginForm />
          </GoogleWrapper>
        } />
        <Route path="/register" element={
          <GoogleWrapper>
            <RegisterForm />
          </GoogleWrapper>
        } />
        <Route />
        <Route path='*' element={<ErrorSection/>}/>
      </Route>
    </Routes>
  )
}

export default App;