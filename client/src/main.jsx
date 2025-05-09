import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import {BrowswerRouter} from 'react-router-dom'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowswerRouter> */}
        <App />
        
    {/* </BrowswerRouter> */}
  </StrictMode>,
)
