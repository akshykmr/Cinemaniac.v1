import React, { useEffect, useState } from "react";
import "./Playlist.scss";
import { RiCloseCircleLine } from "react-icons/ri";

import AppContext from "../context/AppContext";

const Playlist = ({ setDisplayPlayList }) => {
  const { actionToPerform } = React.useContext(AppContext);

  const [playlist, setPlaylist] = useState();

  useEffect(() => {
    if (actionToPerform && actionToPerform.data) {
      setPlaylist(actionToPerform.data.playlist);
    }
  }, [actionToPerform]);

  const handleClosePlaylist = () => {
    setDisplayPlayList(false);
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
            {playlist?.map((movie) => (
              <li key={movie._id}>{movie.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
