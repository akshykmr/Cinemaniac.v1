import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { RiCloseCircleLine } from "react-icons/ri";
import "./SignUpForm.scss";
import axios from "axios";
import AppContext from "../context/AppContext";

const SignUpForm = ({ setShowLogInForm, setSignUpForm ,setLogInWatcher }) => {

  const serverUrl = process.env.REACT_APP_BASE_URL;

  const { propsAsAction, actionToPerform } = React.useContext(AppContext);

  const [previewpassword, setPreviewpassword] = useState(false);

  const [signUpFormData, setSignUpFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setSignUpFormData((prevValue) => ({ ...prevValue, [name]: value }));
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

    if (!signUpFormData.firstName) {
      errors.firstName = "First Name is required.";
    }
    if (!signUpFormData.lastName) {
      errors.lastName = "Last Name is required.";
    }
    if (!signUpFormData.email) {
      errors.email = "email is required.";
    } else if (!emailRegex.test(signUpFormData.email)) {
      errors.email = "Invalid email format.";
    }
    if (!signUpFormData.password) {
      errors.password = "password is required.";
    } else if (!isStrongpassword(signUpFormData.password)) {
      errors.password = "Invalid password format.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        const data = {
          firstName: signUpFormData.firstName,
          lastName: signUpFormData.lastName,
          email: signUpFormData.email,
          password: signUpFormData.password,
        };
        const response = await axios.post(
          `${serverUrl}/register`,
          data
        );

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          console.log("Signup successful!", response.data);
          propsAsAction({
            logInPageAppearance: false,
            data: null,
            showLogInPage: true,
          });
          setLogInWatcher(false);
        } else {
          console.log(response.data.message);
          setFormErrors({
            email: response.data.message,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleCloseSignupPage = () => {
    setShowLogInForm(false);
    propsAsAction({
      logInPageAppearance: false, ///// CLOSING LOG IN FORM IN HEADER CALL
      data: null,
      showLogInPage: null,
    });
  };

  return (
    // <div className="body">
    <form>
      <div className="signUpForm">
        <h3>Registration</h3>
        <span onClick={handleCloseSignupPage} className="cross_btn">
          <RiCloseCircleLine />
        </span>
        <span className="form_user_name">
          <span>
            <h6>First Name</h6>
            <input
              type="text"
              placeholder="Enter Your First Name"
              onChange={handleOnChange}
              value={signUpFormData.firstName}
              name="firstName"
            />
            {formErrors.firstName && (
              <p className="error">{formErrors.firstName}</p>
            )}
          </span>
          <span>
            <h6>Last Name</h6>
            <input
              type="text"
              placeholder="Enter Your Last Name"
              onChange={handleOnChange}
              value={signUpFormData.lastName}
              name="lastName"
            />
            {formErrors.lastName && (
              <p className="error">{formErrors.lastName}</p>
            )}
          </span>
        </span>
        <span className="form_user_password">
          <span>
            <h6>email</h6>
            <input
              type="email"
              value={signUpFormData.email}
              name="email"
              required
              placeholder="Enter Your email Id"
              onChange={handleOnChange}
            />
            {formErrors.email && <p className="error">{formErrors.email}</p>}
          </span>
          <span>
            <h6>password</h6>
            <input
              type={previewpassword ? "text" : "password"}
              value={signUpFormData.password}
              name="password"
              onChange={handleOnChange}
              required
              placeholder="Enter Your password"
            />
            <span className="password_hider" onClick={handlepasswordPreviewer}>
              {previewpassword ? <BsEye /> : <BsEyeSlash />}
            </span>
            {formErrors.password && (
              <p className="error">{formErrors.password}</p>
            )}
          </span>
        </span>
        {signUpFormData.password &&
          !isStrongpassword(signUpFormData.password) && (
            <span className="warnig_msg">
              password must contain at least 8 characters, one uppercase letter,
              one lowercase letter, one number, and one special character.
            </span>
          )}
        <button className="form_logInBtn" onClick={handleSignUpSubmit}>
          SignUp
        </button>
        <span className="togglebtn">
          Already have an account?{" "}
          <button onClick={() => setSignUpForm(false)}>LogIn</button>
        </span>
        {/* <div className="signUpSection">
          <button className="googleSignUp">
            <FcGoogle />
            Continue With Google
          </button>
        </div> */}
      </div>
    </form>
    // </div>
  );
};

export default SignUpForm;
