import React, { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import "./LogInForm.scss";
import SignUpForm from "../signUpForm/SignUpForm";
import AppContext from "../context/AppContext";
import axios from "axios";

const LogInForm = ({ setShowLogInForm }) => {

  const serverUrl = process.env.REACT_APP_BASE_URL;


  let token = localStorage.getItem("token");

  const { propsAsAction, actionToPerform } = React.useContext(AppContext);

  const [showSignUpForm, setSignUpForm] = useState(false);

  const [logInFormData, setLogInFormData] = useState({
    email: "",
    password: "",
  });

  const [previewpassword, setPreviewpassword] = useState(false);

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [logInWatcher, setLogInWatcher] = useState(true);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setLogInFormData((preValue) => ({ ...logInFormData, [name]: value }));
  };

  const handlepasswordPreviewer = () => {
    setPreviewpassword((prevUser) => !prevUser);
  };
  const isStrongpassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!logInFormData.email) {
      errors.email = "email is required.";
    } else if (!emailRegex.test(logInFormData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!logInFormData.password) {
      errors.password = "password is required.";
    } else if (!isStrongpassword(logInFormData.password)) {
      errors.password = "Invalid password format.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        const data = {
          email: logInFormData.email,
          password: logInFormData.password,
        };
        const response = await axios.post(`${serverUrl}/login`, data);

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          // console.log("Login successful!", response.data, response.data.token);
          setLogInFormData({
            email: "",
            password: "",
          });
          setLogInWatcher(false);
        } else {
          console.log(response.data.message);
          setFormErrors({
            email:
              response.data.message === "Email Not Found"
                ? "Email Not Found"
                : "",
            password:
              response.data.message === "Invalid Password"
                ? "Invalid Password"
                : "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };






  const handleLogout = () => {
    localStorage.removeItem("token");
     token = null;
    console.log("Logout successful!");
  };

  useEffect(() => {
    if (actionToPerform.isLoggedin === false) {
      handleLogout();
    }
  }, [actionToPerform]);





  const handleGetData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${serverUrl}/protected`, {
        headers,
      });
      console.log(response);
      console.log(response.data.data);
      if (response.data.success) {
        setShowLogInForm(false); //// IT WILL SET THE STATE FALSE FOR LOG IN FORM SO THAT IN NEXT CALL IT CAN BE CALLED AGAIN
        propsAsAction({
          data: response.data.data, /// SENDING DATA TO HEADER FOR USER PROFILE
          isLoggedin: true, //// HANDLING WELCOME SCREEN APPEARANCE
        });
        setShowLogInForm(false);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };





  useEffect(() => {
    if (logInWatcher === false || token) {
      handleGetData();
      setLogInWatcher(true);
    } else if(actionToPerform.refreshPlayList === true){
      handleGetData();
      console.log("refresh")
    }
  }, [logInWatcher,actionToPerform]);

  const handleCloseLogInPage = () => {
    setShowLogInForm(false); ///// CLOSING LOG IN FOR API CALL 
    // propsAsAction({
    //   logInPageAppearance: false, ///// CLOSING LOG IN FORM IN HEADER CALL
    //   data: null,
    //   showLogInPage: null,
    // });
  };

  return (
    <div className="body">
      {!showSignUpForm ? (
        <form>
          <div className="logInForm">
            <h3>Log In </h3>
            <span onClick={handleCloseLogInPage} className="cross_btn">
              <RiCloseCircleLine />
            </span>
            <span className="form_user_name">
              <h6>email</h6>
              <input
                type="email"
                value={logInFormData.email}
                name="email"
                required
                placeholder="Enter Your email Id"
                onChange={handleOnChange}
              />
              {formErrors.email && <p className="error">{formErrors.email}</p>}
            </span>
            <span className="form_user_password">
              <h6>password</h6>
              <input
                type={previewpassword ? "text" : "password"}
                value={logInFormData.password}
                name="password"
                onChange={handleOnChange}
                required
                placeholder="Enter Your password"
              />
              {formErrors.password && (
                <p className="error">{formErrors.password}</p>
              )}
              <span
                className="password_hider"
                onClick={handlepasswordPreviewer}
              >
                {previewpassword ? <BsEye /> : <BsEyeSlash />}
              </span>
            </span>
            {logInFormData.password &&
              !isStrongpassword(logInFormData.password) && (
                <p>
                  password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number, and one special
                  character.
                </p>
              )}
            <button
              type="submit"
              onClick={handleLoginSubmit}
              className="form_logInBtn"
            >
              LogIn
            </button>
            <span className="togglebtn">
              Not Have an Account{" "}
              <button onClick={() => setSignUpForm(true)} type="btn">
                SignUp
              </button>
            </span>
            {/* <div className="signUpSection">
              <button className="googleSignUp">
                <FcGoogle />
                Continue With Google
              </button>
            </div> */}
          </div>
        </form>
      ) : (
        <SignUpForm
          setSignUpForm={setSignUpForm}
          setShowLogInForm={setShowLogInForm} setLogInWatcher={setLogInWatcher}
        />
      )}{" "}
    </div>
  );
};

export default LogInForm;
