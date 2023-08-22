import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { RiCloseCircleLine } from "react-icons/ri";
import "./SignUpForm.scss";
import AppContext from "../context/AppContext";
import { LogInBtn } from "../signInWithGoogle/LogInBtn";

const SignUpForm = ({ setShowLogInForm, setSignUpForm }) => {
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const { propsAsAction } = React.useContext(AppContext);

  const [previewpassword, setPreviewpassword] = useState(false);

  const [signUpFormData, setSignUpFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNo: "",
    profilePic: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNo: "",
    profilePic: "",
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setSignUpFormData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleFileChange = (event) => {
    setSignUpFormData({ ...signUpFormData, profilePic: event.target.files[0] });
    console.log(event.target.files[0]);
  };
  // console.log("signUpFormData", signUpFormData);

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
    if (!signUpFormData.mobileNo) {
      errors.mobileNo = "Mobile Number is required";
    }
    if (!signUpFormData.profilePic) {
      errors.profilePic = "User Image is required";
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
        const formData = new FormData();
        formData.append("firstName", signUpFormData.firstName)
        formData.append("lastName", signUpFormData.lastName)
        formData.append("email", signUpFormData.email)
        formData.append("password", signUpFormData.password)
        formData.append("mobileNo", signUpFormData.mobileNo)
        formData.append("profilePic", signUpFormData.profilePic)
        // const data = {
        //   firstName: signUpFormData.firstName,
        //   lastName: signUpFormData.lastName,
        //   email: signUpFormData.email,
        //   password: signUpFormData.password,
        //   mobileNo: signUpFormData.mobileNo,
        //   profilePic : signUpFormData.profilePic,
        // };
        const response = await fetch(`${serverUrl}/register`,{
          method: 'POST',
          body: formData,
        });
        const responseData = await response.json();
        if (responseData.success) {
          localStorage.setItem("token", responseData.token);
          console.log("Signup successful!", responseData);
          propsAsAction({
            isUserLoggedIn: true,
          });
          setSignUpFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            mobileNo: "",
            profilePic: "",
          });
        } else {
          // console.log(responseData.message);
          if(responseData.action === "email"){
            setFormErrors({
              email: responseData.message,
            });
          } else {
            setFormErrors({
              mobileNo: responseData.message,
            });
          }
          
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleCloseSignupPage = () => {
    setShowLogInForm(false);
  };

  return (
    <form className="signUpBody">
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
        <span className="form_user_name">
          <span>
            <h6>Mobile Number</h6>
            <input
              type="text"
              placeholder="Enter Your Mobile Number"
              onChange={handleOnChange}
              value={signUpFormData.mobileNo}
              name="mobileNo"
            />
            {formErrors.mobileNo && (
              <p className="error">{formErrors.mobileNo}</p>
            )}
          </span>
          <span>
            <h6>Profile Picture</h6>
            <input
              type="file"
              style={{ width: "150px", height: "10px" ,backgroundColor:"transparent", border:"0px" }}
              onChange={handleFileChange}
              accept="image/*"
              required
              name="Car_Image"
            />
            {formErrors.profilePic && (
              <p className="error">{formErrors.profilePic}</p>
            )}
          </span>
        </span>
        <button className="form_logInBtn" onClick={handleSignUpSubmit}>
          SignUp
        </button>
        <span className="togglebtn">
          Already have an account?{" "}
          <button onClick={() => setSignUpForm(false)}>LogIn</button>
        </span>
        <LogInBtn />
      </div>
    </form>
  );
};

export default SignUpForm;
