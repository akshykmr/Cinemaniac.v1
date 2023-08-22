import React, { useState, useEffect } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./ForgotPass.scss";
import { RiCloseCircleLine } from "react-icons/ri";


const ForgotPass = ({ setShowLogInForm, setSignUpForm }) => {
  const token = localStorage.getItem("token"); // USER TOKEN
  const requestId = localStorage.getItem("requestId"); // REQUEST ID TO FOR RESET PASS
  const serverUrl = process.env.REACT_APP_BASE_URL; // SERVER URL W

  const {actionToPerform } = React.useContext(AppContext);

  const [profileData, setProfileData] = useState({
    // USER DATA
    mobileNo: "",
  });

  const [resetData, setResetData] = useState({
    // DATA FOR RESET FUNCTION
    mobileNo: "",
    newPassword: "",
    email: "",
    otp: "",
  });

  const [isOtpSent, setOtpSent] = useState(false); // WATCHING THE OTP REQ

  const [formErrors, setFormErrors] = useState({
    mobileNo: "",
    newPassword: "",
    email: "",
    otp: "",
  });
  const [reqType, setReqType] = useState();

  const [previewpassword, setPreviewpassword] = useState(true);

  useEffect(() => {
    if (actionToPerform.userData) {
      setProfileData({
        mobileNo: actionToPerform.userData.mobileNo,
      });
    }
  }, [actionToPerform]);

  console.log("reset data", resetData);

  const isStrongpassword = (newPassword) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(newPassword);
  };

  const validatePass = () => {
    const errors = {};
    if (!resetData.mobileNo) {
      errors.mobileNo = "mobileNo is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEmail = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resetData.email) {
      errors.email = "email is required.";
    } else if (!emailRegex.test(resetData.email)) {
      errors.email = "Invalid email format.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOtp = () => {
    const errors = {};
    if (!resetData.otp) {
      errors.otp = "Otp is required.";
    }
    if (!resetData.newPassword) {
      errors.newPassword = "newPassword is required.";
    } else if (!isStrongpassword(resetData.newPassword)) {
      errors.newPassword = "";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlepasswordPreviewer = () => {
    setPreviewpassword((prevUser) => !prevUser);
  };




  const handleGenerateOtp = async (e) => {
    e.preventDefault();

    // Create an empty data object
    const data = {};

    const isFormValid = validatePass();

    if (isFormValid) {
      // Add properties to the data object if isFormValid is true
      data.mobileNo = resetData.mobileNo;

      setReqType("mobileNO");
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(`${serverUrl}/forgotPass`, data, {
          headers,
        });
        if (response.data.status === "success") {
          setOtpSent(true);
          console.log("data sent after forgot pass", response.data)
          localStorage.setItem("requestId", response.data.requestId);
          localStorage.setItem("token", response.data.token);
        } else {
          setFormErrors({
            mobileNo: response.data.message,
          });
          // console.log(response.data.message);
        } 
        // else {
        //   setFormErrors({
        //     email: response.data.message,
        //   });
        // }
      } catch (error) {
        console.error(error);
      }
    } else {
      const isEmailValid = validateEmail();
      if (isEmailValid) {
        // Add properties to the data object if isEmailValid is true
        data.email = resetData.email;
        setReqType("email");
        try {
          const headers = { Authorization: `Bearer ${token}` };

          const response = await axios.post(`${serverUrl}/forgotPass`, data, {
            headers,
          });
          if (response.data.status === "success") {
            setOtpSent(true);
            localStorage.setItem("requestId", response.data.requestId);
          } else {
            setFormErrors({
              email: response.data.message,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleValidataOtp = async (e) => {
    e.preventDefault();
    const isFormValid = validateOtp();
    if (isFormValid && isStrongpassword) {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const data = {
          newPassword: resetData.newPassword,
          otp: resetData.otp,
          requestId: requestId,
        };

        const response = await axios.post(`${serverUrl}/verifyOtp`, data, {
          headers,
        });
        console.log(response, "response");

        if (response.data.status === "success") {
          setSignUpForm(false)
        } else if (response.data.status === 400) {
          setFormErrors({
            newPassword: response.data.message,
          });
        } else {
          setFormErrors({
            otp: response.data.message,
          });
        }
        console.log(response.data.message);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePassReset = (event) => {
    const { name, value } = event.target;
    setResetData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  return (
    <div className="forgotPassbody">
      <form>

        <div className="forgotPassword">
          <h3>Reset Password</h3>
          <span onClick={()=>setShowLogInForm(false)} className="cross_btn">
              <RiCloseCircleLine />
            </span>
          {reqType === "email" ? (
            ""
          ) : (
            <>
              <span>Mobile Number</span>
              <input
                type="text"
                value={resetData.mobileNo}
                name="mobileNo"
                placeholder="Enter Your Registered Mobiel Number"
                onChange={handlePassReset}
              />
              {formErrors.mobileNo && (
                <p className="error">{formErrors.mobileNo}</p>
              )}{" "}
            </>
          )}
          {reqType === "mobileNO" || reqType === "email" ? "" : <h5>OR</h5>}
          {reqType === "mobileNO" ? (
            ""
          ) : (
            <>
              <span>Email Address</span>
              <input
                type="text"
                value={resetData.email}
                name="email"
                placeholder="Enter Your Registered Email"
                onChange={handlePassReset}
              />
              {formErrors.email && <p className="error">{formErrors.email}</p>}
            </>
          )}

          {!isOtpSent && (
            <button onClick={handleGenerateOtp}>Generate OTP</button>
          )}
          {isOtpSent && (
            <>
              <h6>
                {profileData.mobileNo
                  ? `OTP has been sent to Registered Mobile Number ${"*".repeat(
                      8
                    )} ${String(profileData.mobileNo).slice(-2)}`
                  : "Mobile Number not available"}
              </h6>
              {isOtpSent && (
                <>
                  <span>New Password</span>
                  <input
                    type={previewpassword ? "text" : "password"}
                    placeholder="Enter new Password"
                    value={resetData.newPassword}
                    name="newPassword"
                    onChange={handlePassReset}
                  />
                  <span
                    className="password_hider"
                    onClick={handlepasswordPreviewer}
                  >
                    {previewpassword ? <BsEye /> : <BsEyeSlash />}
                  </span>
                  {formErrors.newPassword && (
                    <p className="error">{formErrors.newPassword}</p>
                  )}
                  {resetData.newPassword &&
                    !isStrongpassword(resetData.newPassword) && (
                      <span className="warnig_msg">
                        Password must contain at least 8 characters, one
                        uppercase letter, one lowercase letter, one number, and
                        one special character.
                      </span>
                    )}
                </>
              )}
              <input
                type="text"
                placeholder="Enter Your OTP"
                value={resetData.otp}
                name="otp"
                onChange={handlePassReset}
              />
              {formErrors.otp && <p className="error">{formErrors.otp}</p>}
              <span className="otp_btn">
                <button onClick={handleValidataOtp}>Submit</button>
                <button onClick={handleGenerateOtp}>Resend OTP</button>
              </span>
            </>
          )}
          <span className="togglebtn">
          Already have an account?{" "}
          <button onClick={() => setSignUpForm(false)}>LogIn</button>
        </span>
        </div>
      </form>
    </div>
  );
};

export default ForgotPass;
