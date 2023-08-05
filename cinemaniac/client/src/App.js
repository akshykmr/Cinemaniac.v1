import React from "react";
import "./App.scss";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/header/Header";
import HomePage from './component/homePage/HomePage'
import AppContext from "./component/context/AppContext";


function App() {
 
  const [actionToPerform, setActionToPerform] = React.useState(null);

  const propsAsAction =(result)=>{
    setActionToPerform(result);
  }

  return (
    <AppContext.Provider value={{propsAsAction, actionToPerform, setActionToPerform}}>
    <Header/>
    <HomePage/>
    </AppContext.Provider>
  );
}

export default App;
