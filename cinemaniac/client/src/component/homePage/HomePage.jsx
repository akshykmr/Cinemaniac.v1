import React, { useState } from "react";
import "./HomePage.scss";
import IMG from "./../../assets/1431137.jpg";
import { AiFillStar } from "react-icons/ai";
import { BsArrowLeftSquare } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { CgCalendarDates } from "react-icons/cg";
import AppContext from './../context/AppContext'

const HomePage = () => {

  const {propsAsAction} = React.useContext(AppContext);

  const [playlist, setPlayList] = useState(false);
  const [welcomeScreen, setWelcomeScreen] = useState(true);

  const handleAddToPlaylist = () => {
    setPlayList(true);
    setTimeout(() => {
      setPlayList(false);
    }, 3000);
  };

  const handleLogIn = ()=>{
    propsAsAction(true);
  };


  return (
    <div className="homePage_body">
      {welcomeScreen ? (
        <div className="welcome_screen">
          <h1>Welcome To Cinemaniac</h1>
          <div className="screen_btn">
            <button onClick={()=> setWelcomeScreen(false)}>Search Movies</button>
            <button onClick={handleLogIn}>LogIn</button>
          </div>
        </div>
      ) : (
        <>
          <div className="search_bar">
          <span className="back_btn" onClick={()=>setWelcomeScreen(true)}> 
            <BsArrowLeftSquare/> Back to Home Screen
            </span>
            <input type="text" placeholder="Search Movies here" />
          </div>
          <div className="content_box">
            <div className="thumbnail_section">
              <div className="imagebox">
                <img src={IMG} alt="" />
              </div>
              <div className="add_to_playlist_btn">
                <button onClick={handleAddToPlaylist}>
                  <AiFillStar /> Add to Playlist
                </button>
              </div>
            </div>
            <div className="movi_details">
              <h4>Puss In boots: The Last Wish</h4>
              <ul>
                <li>
                  <AiFillStar />
                  7.8
                </li>
                <li>
                  <p>IMDB</p> 167
                </li>
                <li>
                  <BiTimeFive /> 1h 40min
                </li>
                <li>
                  <CgCalendarDates /> 2020
                </li>
              </ul>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Voluptates autem in reprehenderit quod earum porro quae quasi,
                culpa repudiandae deleniti architecto explicabo aut illo
                molestiae, dolorum corrupti nemo sint quo quidem consequatur
                eaque, harum voluptatibus? Impedit maiores, quia corrupti
                blanditiis laudantium odio atque ad ullam quis nostrum vitae
                inventore culpa accusamus cupiditate distinctio excepturi.
              </p>
              <ul>
                <li>Quality:</li>
                <li>Language</li>
              </ul>
              <ul>
                <li>Country</li>
                <li>Category</li>
              </ul>
              {playlist && (
                <span className="playlist_msg">
                  Added in Playlist Successfully
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
