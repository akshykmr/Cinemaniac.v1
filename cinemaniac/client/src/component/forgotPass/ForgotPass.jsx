import React, { useState } from 'react'
import './ForgotPass.scss'
import { RiCloseCircleLine } from "react-icons/ri";


const ForgotPass = ({setShowLogInForm, setSignUpForm}) => {

    const [userEmail, setUserEmail] = useState();
    const [formErrors, setFormErrors] = useState({
        email: ""
    });

      const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!userEmail) {
          errors.email = "email is required.";
        } else if (!emailRegex.test(userEmail)) {
          errors.email = "Invalid email format.";
        }
    
        setFormErrors(errors);
    
        return Object.keys(errors).length === 0;
      };

  return (
    <div className="playListbody">
       <form>
          <div className="logInForm">
            <h3>Reset Password </h3>
            <span onClick={()=>setShowLogInForm(false)} className="cross_btn">
              <RiCloseCircleLine />
            </span>
            <span className="form_user_name">
              <h6>email</h6>
              <input
                type="email"
                value={userEmail}
                name="email"
                required
                placeholder="Enter Your email Id"
                onChange={(e)=>setUserEmail(e.target.value)}
              />
              {formErrors.email && <p className="error">{formErrors.email}</p>}
            </span>
            <button
              type="submit"
            //   onClick={handleLoginSubmit}
              className="form_logInBtn"
            >
              Send OTP
            </button>
            <input
                type="email"
                value={userEmail}
                name="email"
                required
                placeholder="Enter Your OTP"
                onChange={(e)=>setUserEmail(e.target.value)}
              />
            {/* <span className="togglebtn">
            Back To {" "}
              <button onClick={() => setSignUpForm(false)} type="btn">
                Log In
              </button>
            </span> */}
            <span className="accountreset">
              <button onClick={() => setSignUpForm("forgot")} type="btn">
                Find By Name
              </button>
            </span>
          </div>
        </form>
    </div>
  )
}

export default ForgotPass
