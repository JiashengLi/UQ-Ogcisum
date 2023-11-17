import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './Pages/App';
import EditSample from './Pages/EditSample'
import ShareSample from './Pages/ShareSample'
import CreateSample from './Pages/Create'
import { toneObject, toneTransport, tonePart } from "./data/instruments.js";


ReactDOM.render(
  <React.StrictMode>
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<App toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}/>} />
            <Route path="/create" element={<CreateSample toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}/>} />
            <Route path="/edit/:id" element={<EditSample toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}/>} />
            <Route path="/share/:id" element={<ShareSample toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}/>} />
        </Routes>
    </BrowserRouter>  
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
