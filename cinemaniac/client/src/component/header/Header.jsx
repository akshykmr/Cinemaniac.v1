import React, { useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";
import "./Header.scss";
import LogInForm from "./../../component/logInForm/LogInForm";
import AppContext from "./../context/AppContext";
import Playlist from "../playList/Playlist";
// import { useAuth0 } from "@auth0/auth0-react";
// import ForgotPass from "../forgotPass/ForgotPass";
import Profile from './../profile/Profile'

import axios from "axios";

const Header = () => {
  const serverUrl = process.env.REACT_APP_BASE_URL;

  let token = localStorage.getItem("token");

  // const { loginWithRedirect } = useAuth0();
  // const { logout } = useAuth0();

  const { actionToPerform, propsAsAction } = React.useContext(AppContext);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const [showLogInform, setShowLogInForm] = useState(false);

  const [showProfile, setShowProfile] = useState(true);

  const [userData, setUserData] = useState();

  const [displayPlayList, setDisplayPlayList] = useState(false);

  useEffect(() => {
    if (actionToPerform.logInPageAppearance === true) {
      setShowLogInForm(true);
    } 
  }, [actionToPerform]);
  

  const handleLogInPageAppearance = () => {
    setShowLogInForm(true);
  };

  const handleDisplayPlayList = () => {
    setDisplayPlayList(true);
    handleGetData();
  };

  const handleGetData = async () => {
    ///// IT WILL HELP TO FETCH THE DATA WHENEVER APP GET RELOAD OR REFRESH
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${serverUrl}/protected`, {
        headers,
      });
      if (response.data.success) {
        setShowLogInForm(false);
        setUserData(response.data.data);
        localStorage.setItem('userImg',response.data.data.profilePic);
        propsAsAction({
          userData : response.data.data
        })
        propsAsAction({
          data: response.data.data,
          isLoggedin: true,
        });
        setIsUserLoggedIn(true);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (actionToPerform.isUserLoggedIn === true) {
      handleGetData();
    }
  }, [actionToPerform]);

  useEffect(() => {
    if (token) {
      handleGetData();
    } else {
      console.log("token expired");
    }
  }, []);

  const handleLogOutUser = () => {
    propsAsAction({
      data: null,
      isUserLoggedIn: false,
    });
    setUserData("");
    setIsUserLoggedIn(false);
    setShowLogInForm(true);
    localStorage.removeItem("token");
    localStorage.removeItem("movies");
    localStorage.removeItem("userImg");
    console.log("Logout successful!");
  };

  const handleDisplayProfile = (
    () =>{
      setShowProfile(true)
    }
  );

  return (
    <>
      <header>
        <div className="header_items">
          {/* <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}></button> */}

          <div className="logo">Cinemaniac</div>
          {/* <button onClick={() => loginWithRedirect()}>Log In</button>; */}
          {!isUserLoggedIn ? (
            !showLogInform ? (
              <button onClick={handleLogInPageAppearance} className="logInBtn">
                LogIn
              </button>
            ) : (
              ""
            )
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
                  <li onClick={handleDisplayProfile}>Profile</li>
                  <li onClick={ handleLogOutUser}>Log Out</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>
      {showLogInform && <LogInForm setShowLogInForm={setShowLogInForm} />}
      {displayPlayList && <Playlist setDisplayPlayList={setDisplayPlayList} />}
      {showProfile && <Profile setShowProfile={setShowProfile} />}
    </>
  );
};

export default Header;
