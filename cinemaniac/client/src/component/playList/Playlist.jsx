import React, { useEffect, useState } from "react";
import "./Playlist.scss";
import { RiCloseCircleLine } from "react-icons/ri";
import {MdOutlineDeleteOutline} from 'react-icons/md'
import axios from 'axios'
import AppContext from "../context/AppContext";

const Playlist = ({ setDisplayPlayList }) => {

  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");


  const { actionToPerform, propsAsAction } = React.useContext(AppContext);

  const [playlist, setPlaylist] = useState();

  useEffect(() => {
    if (actionToPerform.userData) {
      setPlaylist(actionToPerform.userData.playlist);
    }
  }, [actionToPerform]);

  // console.log("playlist", playlist)

  const handleClosePlaylist = () => {
    setDisplayPlayList(false);
  };

  const handleMovieSearch = (movie) => {
    propsAsAction({
      playlistMovie: movie,
    });
  };

  const handleRemoveItem =  async(index) =>{

    console.log("clicked movie" , playlist[index]._id)

    const updatedPlaylist = [...playlist];
      try {
        const movieId = playlist[index]._id
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.delete(
          `${serverUrl}/remove/${movieId}`,
          { headers }
        );
        if (response.data.success) {
          updatedPlaylist.splice(index, 1);
          setPlaylist(updatedPlaylist);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="playListbody">
      <div className="playlistbody">
        <div className="crs_btn_cont">
          <h3>Play List </h3>
          <span onClick={handleClosePlaylist} className="cross_btn">
            <RiCloseCircleLine />
          </span>
          <ul>
            {playlist?.map((movie, index) => (
              <li key={index}>
                <span  onClick={() => handleMovieSearch(movie.name)} className="movieName">
                {movie.name}
                </span>
                <span onClick={()=>handleRemoveItem(index)}  className="remove_btn">
              <MdOutlineDeleteOutline />
            </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
