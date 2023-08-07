import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import "./LogInForm.scss";
import SignUpForm from "../signUpForm/SignUpForm";
import AppContext from "../context/AppContext";
import axios from "axios";

const LogInForm = ({ setShowLogInForm }) => {

  const {setActionToPerform} = React.useContext(AppContext);

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
      errors.password =
        "Invalid password format.";
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
        const response = await axios.post('http://localhost:5000/login', data);
         console.log("1", response)
        // if (response.data.message === 'Email Not Found') {
        //   console.log("Email Not Found");
        //   // Display error message for email not found
        // } else if (response.data.message === 'Invalid Password') {
        //   console.log("Invalid Password");
        //   // Display error message for invalid password
        // } else if (response.status === 200) {
        //   // Login was successful
        //   localStorage.setItem('@token', JSON.stringify({ token: 'Bearer ' + response.data.token }));
        //   console.log("Login successful!", response.data);
        //   setLogInFormData({
        //     email: "",
        //     password: "",
        //   });
        // } else {
        //   console.log("Unexpected response:", response.data);
        //   // Handle other unexpected responses
        // }
      } catch (error) {
        console.error("Error:", error);
        // Handle other errors if necessary
      }
    }
  };
  
  

  const handleLogIn = () =>{
    setShowLogInForm(false);
    setActionToPerform(false);
  }
 
  return (
    <div className="body">
      {!showSignUpForm ? (
        <form>
          <div className="logInForm">
            <h3>Log In </h3>
            <span onClick={handleLogIn} className="cross_btn">
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
            <div className="signUpSection">
              <button className="googleSignUp">
                <FcGoogle />
                Continue With Google
              </button>
            </div>
          </div>
        </form>
      ) : (
        <SignUpForm setSignUpForm={setSignUpForm} setShowLogInForm ={setShowLogInForm} />
      )}{" "}
    </div>
  );
};

export default LogInForm;
