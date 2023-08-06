import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import IMG from "./../../assets/1431137.jpg";
import { AiFillStar } from "react-icons/ai";
import { BsArrowLeftSquare } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { CgCalendarDates } from "react-icons/cg";
import AppContext from "./../context/AppContext";
import axios from "axios";

const HomePage = () => {
  const { propsAsAction } = React.useContext(AppContext);

  const [playlist, setPlayList] = useState(false);
  const [welcomeScreen, setWelcomeScreen] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [moviesData, setMoviesData] = useState();

  const handleAddToPlaylist = () => {
    setPlayList(true);
    setTimeout(() => {
      setPlayList(false);
    }, 3000);
  };

  const handleLogIn = () => {
    propsAsAction(true);
  };

  const handleSearch = () => {
    if (searchTerm.length >= 4) {
      axios
        .get(`https://www.omdbapi.com/?apikey=aedc4b94&s=${searchTerm}`)
        .then((response) => {
          if (response.data && response.data.Search) {
            const movies = response.data.Search;
            setSearchResults(movies);
          } else {
            setSearchResults([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 3) {
      handleSearch();
      console.log("CALLING API:");
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    console.log("searchResults:", searchResults);
  }, [searchResults]);

  const handleMovieSelect = async (title) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=aedc4b94&t=${title}`
      );
      const movieData = response.data;
      console.log("Selected Movie Data:", movieData, response.status);
      if (response.status === 200) {
        setSearchTerm("");
        setSearchResults([]);
        setMoviesData(movieData);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    setLoading(!moviesData);
  }, [moviesData]);

  return (
    <div className="homePage_body">
      {welcomeScreen ? (
        <div className="welcome_screen">
          <h1>Welcome To Cinemaniac</h1>
          <div className="screen_btn">
            <button onClick={() => setWelcomeScreen(false)}>
              Search Movies
            </button>
            <button onClick={handleLogIn}>LogIn</button>
          </div>
        </div>
      ) : (
        <>
          <div className="search_bar">
            <span className="back_btn" onClick={() => setWelcomeScreen(true)}>
              <BsArrowLeftSquare /> Back to Home Screen
            </span>
            <span className="search_box">
              <input
                type="text"
                placeholder="Search Movies here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="search_results">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.imdbID}
                      className="search_result_item"
                      onClick={() => handleMovieSelect(movie.Title)}
                    >
                      {movie.Title} ({movie.Year})
                    </div>
                  ))}
                </div>
              )}
            </span>
          </div>
          <div className="content_box">
            {loading ? (
              <div className="blank_skaleton">
                <h1>Empty Results</h1>
                <div class="hourglassBackground">
                  <div class="hourglassContainer">
                    <div class="hourglassCurves"></div>
                    <div class="hourglassCapTop"></div>
                    <div class="hourglassGlassTop"></div>
                    <div class="hourglassSand"></div>
                    <div class="hourglassSandStream"></div>
                    <div class="hourglassCapBottom"></div>
                    <div class="hourglassGlass"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="loaded_data">
                <div className="thumbnail_section">
                  <div className="imagebox">
                    <img src={moviesData?.Poster} alt="" />
                  </div>
                  <div className="add_to_playlist_btn">
                    <button onClick={handleAddToPlaylist}>
                      <AiFillStar /> Add to Playlist
                    </button>
                  </div>
                </div>
                <div className="movi_details">
                  <h4>
                    {moviesData?.Title} ({moviesData?.Year})
                  </h4>
                  <ul>
                    <li>
                      <AiFillStar />
                      {moviesData?.Ratings[0].Value}
                    </li>
                    <li>
                      <p>IMDB</p> {moviesData?.imdbRating}
                    </li>
                    <li>
                      <BiTimeFive /> {moviesData?.Runtime}
                    </li>
                    <li>
                      <CgCalendarDates /> {moviesData?.Released}
                    </li>
                  </ul>
                  <p>{moviesData?.Plot}</p>
                  <ul>
                    <li>Actors : {moviesData?.Actors}</li>
                    <li>Type : {moviesData?.Type}</li>
                  </ul>
                  <ul>
                    <li>Language : {moviesData?.Language}</li>
                    <li>Genre : {moviesData?.Genre}</li>
                    
                  </ul>
                  {playlist && (
                    <span className="playlist_msg">
                      Added in Playlist Successfully
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
