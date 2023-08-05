import React, { useState ,useEffect} from "react";
import { BiUserCircle } from "react-icons/bi";
import "./Header.scss";
import LogInForm from "./../../component/logInForm/LogInForm";
import AppContext from './../context/AppContext'




const Header = () => {

  const {actionToPerform} = React.useContext(AppContext);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showLogInform, setShowLogInForm] = useState(false);

  useEffect(()=>{
    if(actionToPerform){
      setShowLogInForm(actionToPerform);
      console.log("this is prop",actionToPerform)
    }
  },[actionToPerform])

  const handleIsUserLoggedIn = () => {
    setIsUserLoggedIn((prevUser) => !prevUser);
  };

  const handleLogInPageAppearance = () =>{
    setShowLogInForm(true);
  }

  return (
    <>
      <header>
        <div className="header_items">
          <div className="logo">
            Cinemaniac <button onClick={handleIsUserLoggedIn}>L</button>
          </div>
          {!isUserLoggedIn ? (
            <button onClick={handleLogInPageAppearance} className="logInBtn">LogIn</button>
          ) : (
            <div className="user">
              <div className="userProfile">
                <span className="user_icon">
                  <BiUserCircle />
                </span>
                <span className="user_name">Akshay </span>
              </div>
              <div className="UserDropdown">
                <ul>
                  <li>Play List</li>
                  <li>Log Out</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>
      {showLogInform && <LogInForm setShowLogInForm ={setShowLogInForm} />}
    </>
  );
};

export default Header;
