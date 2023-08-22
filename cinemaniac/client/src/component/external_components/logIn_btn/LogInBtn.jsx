import React from 'react';
import './LogInBtn.scss';
import AppContext from "./../../context/AppContext";


const LogInBtn = () => {
  const {propsAsAction } = React.useContext(AppContext);

  return (
    <button className="logIn_btn_glow" type="button" onClick={() => propsAsAction({
            logInPageAppearance: true,
          })} >
    <strong>Log In</strong>
    <div id="container-stars">
      <div id="stars"></div>
    </div>
  
    <div id="glow">
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  </button>
  )
}

export default LogInBtn
