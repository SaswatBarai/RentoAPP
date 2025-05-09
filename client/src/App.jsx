import React from 'react'
import { AuthPage } from './pages/AuthPage'
import { ToastContainer } from 'react-toastify';




function App() {
  return (
    <div >
      <ToastContainer />
      <AuthPage />
      
      {/* <LoginForm /> */}
      {/* <RegisterForm /> */}
      {/* <Dashboard /> */}
      {/* <Profile /> */}
      {/* <Settings /> */}
      {/* <NotFound /> */}
    </div>
  )
}

export default App