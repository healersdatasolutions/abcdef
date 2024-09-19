import React from "react";
import ReactDOM from "react-dom/client";
import { InternetIdentityProvider } from "ic-use-internet-identity";
// import { BrowserRouter as Router } from "react-router-dom";
import Actors from "./Actors.tsx"


import App from "./App.jsx";
import './index.css';



// import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
         <InternetIdentityProvider>
          <Actors>
            <App />
            </Actors>
          </InternetIdentityProvider>  
        
    </React.StrictMode>
);
