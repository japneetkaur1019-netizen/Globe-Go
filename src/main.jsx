import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import "./styles/global.css";
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { FlightBookingProvider } from './context/FlightBookingContext.jsx';
import { GroupTripProvider } from './context/GroupTripContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <WishlistProvider>
            <FlightBookingProvider>
              <GroupTripProvider>
                <App />
              </GroupTripProvider>
            </FlightBookingProvider>
          </WishlistProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
