import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux'
import { store } from "./state/store"

const queryCilent = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryCilent} >
          <App />
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>

  </StrictMode>,
)
