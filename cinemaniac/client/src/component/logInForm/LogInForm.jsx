import React, { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import "./LogInForm.scss";
import SignUpForm from "../signUpForm/SignUpForm";
import AppContext from "../context/AppContext";
import axios from "axios";
import { LogInBtn } from "../signInWithGoogle/LogInBtn";
import ForgotPass from "../forgotPass/ForgotPass";

const LogInForm = ({ setShowLogInForm }) => {
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const { propsAsAction } = React.useContext(AppContext);

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
          setLogInFormData({
            email: "",
            password: "",
          });
          propsAsAction({
            isUserLoggedIn: true,
          });
          console.log("Login successful!", response.data);
          console.log(response.data.message);
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

  const handleCloseLogInPage = () => {
    setShowLogInForm(false); ///// CLOSING LOG IN FOR API CALL
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
            <span className="accountreset">
              <button onClick={() => setSignUpForm("forgot")} type="btn">
                Forgot Password
              </button>
            </span>
            <LogInBtn />
          </div>
        </form>
      ) : showSignUpForm === "forgot" ? (
        <ForgotPass
        setSignUpForm={setSignUpForm}
          setShowLogInForm={setShowLogInForm}
        />
      ) : (
        <SignUpForm
          setSignUpForm={setSignUpForm}
          setShowLogInForm={setShowLogInForm}
        />
      )}
    </div>
  );
};

export default LogInForm;
