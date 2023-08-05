import React from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/header/Header";
import HomePage from './component/homePage/HomePage'
// import AppContext from './component/context/AppContext'
// import LogInForm from "./component/logInForm/LogInForm";
// import SignUpForm from "./component/signUpForm/SignUpForm";


function App() {
 

  return (
    <BrowserRouter>
      {/* <AppContext> */}
        <Header/>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      {/* </AppContext> */}
    </BrowserRouter>
  );
}

export default App;
