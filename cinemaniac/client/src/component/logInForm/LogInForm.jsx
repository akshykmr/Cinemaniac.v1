import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import "./LogInForm.scss";

const LogInForm = () => {
  const [userForm, setUserForm] = useState("LogIn");

  const [logInFormData, setLogInFormData] = useState({
    Email: "",
    Password: "",
  });

  const [previewPassword, setPreviewPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({
    Email: "",
    Password: "",
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setLogInFormData((preValue) => ({ ...logInFormData, [name]: value }));
  };

  const handlePasswordPreviewer = () => {
    setPreviewPassword((prevUser) => !prevUser);
  };
  const isStrongPassword = (password) => {
    // Define your password complexity requirements here
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const errors = {};
    if (!logInFormData.Email) {
      errors.Email = "Email is required.";
    }
    if (!logInFormData.Password) {
      errors.Password = "Password is required.";
    } 

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
        console.log("UserName:", logInFormData.Email);
        console.log("Password:", logInFormData.Password);
        console.log("formdata:", logInFormData);

    }
  };

  return (
    <div className="body">
      <form>
        <div className="logInForm">
          <h3>Log In </h3>
          <span className="cross_btn"><RiCloseCircleLine/></span>
          <span className="form_user_name">
            <h6>Email</h6>
            <input
              type="email"
              value={logInFormData.Email}
              name="Email"
              required
              placeholder="Enter Your Email Id"
              onChange={handleOnChange}
            />
            {formErrors.Email && <p className="error">{formErrors.Email}</p>}
          </span>
          <span className="form_user_password">
            <h6>Password</h6>
            <input
              type={previewPassword ? "text" : "password"}
              value={logInFormData.Password}
              name="Password"
              onChange={handleOnChange}
              required
              placeholder="Enter Your Password"
            />
            {formErrors.Password && <p className="error">{formErrors.Password}</p>}
            <span className="password_hider" onClick={handlePasswordPreviewer}>
              {previewPassword ? <BsEye /> : <BsEyeSlash />}
            </span>
          </span>
          {logInFormData.Password &&
            !isStrongPassword(logInFormData.Password) && (
              <p>
                Password must contain at least 8 characters, one uppercase
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
            <button type="btn">SignUp</button>
          </span>
          <div className="signUpSection">
            <button className="googleSignUp">
              <FcGoogle />
              Continue With Google
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LogInForm;
