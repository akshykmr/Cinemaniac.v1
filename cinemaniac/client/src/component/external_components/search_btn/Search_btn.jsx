import React from 'react'
import './Search_btn.scss'

const Search_btn = ({setWelcomeScreen}) => {
  return (
    <button className="search_btn_glow" type="button" onClick={() => setWelcomeScreen(false)} >
  <strong>Serch Movies</strong>
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

export default Search_btn
