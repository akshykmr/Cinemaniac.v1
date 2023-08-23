import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import { AiFillStar } from "react-icons/ai";
import { BsArrowLeftSquare } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { CgCalendarDates } from "react-icons/cg";
import AppContext from "./../context/AppContext";
import axios from "axios";
import SearchBtn from "./../external_components/search_btn/Search_btn";
import WelcomeTxt from "./../external_components/welcome_txt/WelcomeTxt";
import LogInBtn from "./../external_components/logIn_btn/LogInBtn";
import Loader from './../external_components/loader/Loader'

const HomePage = () => {
  const omdbBaseUrl = `${process.env.REACT_APP_OMDB_BASE_URL}?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;

  const serverUrl = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem("token");
  const movie = localStorage.getItem("movies");

  const { actionToPerform } = React.useContext(AppContext);

  const [playlist, setPlayList] = useState(false);

  const [playlistMsg, setPlaylistMsg] = useState();

  const [welcomeScreen, setWelcomeScreen] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [moviesData, setMoviesData] = useState();


  useEffect(() => {
    if (actionToPerform.showSearchpage === true) {
      setWelcomeScreen(false);
    } else if(actionToPerform.showSearchpage === false){
      setWelcomeScreen(true);
    }
  }, [actionToPerform]);


 

  const handleAddToPlaylist = async (movieName) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      console.log("token", headers);
      const formData = new FormData();
      formData.append("movieName", movieName);
      const response = await axios.put(
        `${serverUrl}/update`,
        { movieName },
        { headers }
      );
      if (response.data.success) {
        setPlayList(true);
        setTimeout(() => {
          setPlayList(false);
        }, 3000);
        console.log(response.data.message);
        setPlaylistMsg(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleLogInAppearance = () => {
  //   //// THIS WILL TRIGGER THE LOG IN PAGE AND LOG IN / SIGNUP PAGE WILL APPEAR ON  HOMEPAGE
  //   propsAsAction({
  //     logInPageAppearance: true,
  //   });
  // };

  const handleSearch = () => {
    if (searchTerm.length >= 4) {
      axios
        .get(`${omdbBaseUrl}&s=${searchTerm}`)
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

  const handleMovieSelect = async (title) => {
    try {
      const response = await axios.get(`${omdbBaseUrl}&t=${title}`);
      const movieData = response.data;
      console.log("Selected Movie Data:", movieData, response.status);
      if (response.status === 200) {
        setSearchTerm("");
        setSearchResults([]);
        setMoviesData(movieData);
        localStorage.setItem("movies", title);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    setLoading(!moviesData);
  }, [moviesData]);

  useEffect(() => {
    if (actionToPerform.isLoggedin) {
      setWelcomeScreen(false);
    } 
  }, [actionToPerform]);

  useEffect(() => {
    if (movie !== "Undefined" && movie !== "null") {
      handleMovieSelect(movie);
      console.log("movie", movie)
    }
  }, [movie]);

  
  useEffect(() => {
    if (actionToPerform.playlistMovie ) {
      handleMovieSelect(actionToPerform.playlistMovie);
    }
  }, [actionToPerform]);

  return (
    <div className="homePage_body">
      {welcomeScreen ? (
        <div className="welcome_screen">
          {/* <h1>Welcome To Cinemaniac</h1> */}
          <WelcomeTxt />
          <div className="screen_btn">
            {/* <button onClick={() => setWelcomeScreen(false)}>
              Search Movies
            </button> */}
            <SearchBtn setWelcomeScreen={setWelcomeScreen} />
            {!token && (
              <LogInBtn />
              // <button onClick={handleLogInAppearance}>LogIn</button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="search_bar">
            <span className="back_btn" onClick={() => setWelcomeScreen(true)}>
              <BsArrowLeftSquare /> Back
            </span>
            <div class="form__group field">
              <input
                type="text"
                class="form__field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Movies "
                required=""
              />
              <label for="name" class="form__label">
                Search Movies
              </label>
              <div className="cards">
                {searchResults.length > 0 ? (
                  searchResults.map((movie, index) => (
                    <div
                      key={movie.imdbID}
                      className={`card ${
                        index % 3 === 0
                          ? "red"
                          : index % 3 === 1
                          ? "blue"
                          : "green"
                      }`}
                      onClick={() => handleMovieSelect(movie.Title)}
                    >
                      <p className="tip">
                        {movie.Title} ({movie.Year})
                      </p>
                    </div>
                  ))
                ) : (
""                )}
              </div>
            </div>
            {/* <span className="search_box">
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
            </span> */}
          </div>
          <div className="content_box" style={!moviesData ? { backgroundColor: "rgba(18, 38, 63, 0.6784313725)" } : {}}>
            {loading ? (
              <div className="blank_skaleton">
                <h1>Empty Results</h1>
                <div className="loader">
                  <Loader/>
                </div>
                <div className="hourglassBackground">
                  <div className="hourglassContainer">
                    <div className="hourglassCurves"></div>
                    <div className="hourglassCapTop"></div>
                    <div className="hourglassGlassTop"></div>
                    <div className="hourglassSand"></div>
                    <div className="hourglassSandStream"></div>
                    <div className="hourglassCapBottom"></div>
                    <div className="hourglassGlass"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="loaded_data">
                <div className="thumbnail_section">
                  <div className="imagebox">
                    <img src={moviesData?.Poster} alt="" />
                  </div>
                  {token && (
                    <div className="add_to_playlist_btn">
                      <button
                        onClick={() => handleAddToPlaylist(moviesData?.Title)}
                      >
                        <AiFillStar /> Add to Playlist
                      </button>
                    </div>
                  )}
                </div>
                <div className="movi_details">
                  <h4>
                    {moviesData?.Title} ({moviesData?.Year})
                  </h4>
                  <ul>
                    <li>
                      <AiFillStar />
                      {moviesData?.Ratings[0]?.Value || "NA"}
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
                    <li style={{width:"100%"}}>Actors : {moviesData?.Actors}</li>
                  </ul>
                  <ul>
                    <li>Language : {moviesData?.Language}</li>
                    <li>Genre : {moviesData?.Genre}</li>
                  </ul>
                  {playlist && (
                    <span className="playlist_msg">{playlistMsg}</span>
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
