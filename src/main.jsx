import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { FlightBookingProvider } from './context/FlightBookingContext.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AppProvider>
//         <App />
//       </AppProvider>
//     </BrowserRouter>
//   </StrictMode>,
// )
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { AppProvider } from "./context/AppContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { FlightBookingProvider } from "./context/FlightBookingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

      <AppProvider>
<<<<<<< HEAD
        <WishlistProvider>
          <FlightBookingProvider>
            <App />
          </FlightBookingProvider>
        </WishlistProvider>
=======

        <WishlistProvider>
          <FlightBookingProvider>

            <App />

          </FlightBookingProvider>
        </WishlistProvider>

>>>>>>> f8ed227 (update main)
      </AppProvider>

    </BrowserRouter>
<<<<<<< HEAD
  </StrictMode>,
)

=======
  </StrictMode>
);
>>>>>>> f8ed227 (update main)
