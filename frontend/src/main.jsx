import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import {SnackbarProvider} from 'notistack'
import { ChakraProvider } from '@chakra-ui/react'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider>
      <ChakraProvider>
          <App />
      </ChakraProvider>
    </SnackbarProvider>
  </BrowserRouter>
)
