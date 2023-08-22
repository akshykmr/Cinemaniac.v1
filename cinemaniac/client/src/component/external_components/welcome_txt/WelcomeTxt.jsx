import React from 'react';
import './WelcomeTxt.scss'

const WelcomeTxt = () => {
  return (
    <button data-text="Welcome To Cinemaniac" className="button">
    <span className="actual-text">&nbsp;Welcome To Cinemaniac&nbsp;</span>
    <span className="hover-text" aria-hidden="true">&nbsp;Welcome To Cinemaniac&nbsp;</span>
</button>
  )
}

export default WelcomeTxt
