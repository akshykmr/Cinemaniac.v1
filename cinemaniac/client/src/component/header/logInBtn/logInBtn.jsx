import React from 'react';
import './logInBtn.scss';

const logInBtn = ({setShowLogInForm}) => {
  return (
    <button className="header_logIn" onClick={()=>setShowLogInForm(true)}> Log In
</button>
  )
}

export default logInBtn
