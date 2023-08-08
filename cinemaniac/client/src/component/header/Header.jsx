import React, { useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";
import "./Header.scss";
import LogInForm from "./../../component/logInForm/LogInForm";
import AppContext from "./../context/AppContext";
import Playlist from "../playList/Playlist";

const Header = () => {
  const { actionToPerform, propsAsAction } = React.useContext(AppContext);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showLogInform, setShowLogInForm] = useState(false);
  const [userData, setUserData] = useState();
  const [displayPlayList, setDisplayPlayList] = useState(false);

  useEffect(() => {
    if (actionToPerform.logInPageAppearance === true) {
      setShowLogInForm(true);
    }
  }, [actionToPerform]);

  useEffect(() => {
    if (actionToPerform.isLoggedin) {
      setIsUserLoggedIn(true);
      setUserData(actionToPerform.data);
    }
  }, [actionToPerform]);

  const handleLogOutUser = () => {
       propsAsAction({
      //  logInPageAppearance: true, 
       data: null,
       isLoggedin: false,
       });
       setUserData("");
       setIsUserLoggedIn(false);
       setShowLogInForm(true);
  };

  const handleLogInPageAppearance = () => {
    setShowLogInForm(true);
  };

  const handleDisplayPlayList = () =>{
    setDisplayPlayList(true); 
  }

  return (
    <>
      <header>
        <div className="header_items">
          <div className="logo">Cinemaniac</div>
          {!isUserLoggedIn ? (
            <button onClick={handleLogInPageAppearance} className="logInBtn">
              LogIn
            </button>
          ) : (
            <div className="user">
              <div className="userProfile">
                <span className="user_icon">
                  <BiUserCircle />
                </span>
                <span className="user_name">{userData.firstName} </span>
              </div>
              <div className="UserDropdown">
                <ul>
                  <li onClick={handleDisplayPlayList}>Play List</li>
                  <li onClick={handleLogOutUser}>Log Out</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>
      {showLogInform && <LogInForm setShowLogInForm={setShowLogInForm} />}
      {displayPlayList && <Playlist setDisplayPlayList={setDisplayPlayList} />}
    </>
  );
};

export default Header;
