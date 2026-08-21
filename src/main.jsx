import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { FlightBookingProvider } from './context/FlightBookingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <WishlistProvider>
          <FlightBookingProvider>
            <App />
          </FlightBookingProvider>
        </WishlistProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)

