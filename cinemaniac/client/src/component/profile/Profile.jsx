import React, { useState, useEffect } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";
import { BiSave } from "react-icons/bi";
import AppContext from "../context/AppContext";
import { AiOutlineFileAdd } from "react-icons/ai";
import axios from "axios";
import { BsEye, BsEyeSlash } from "react-icons/bs";


import "./Profile.scss";

const Profile = ({ setShowProfile }) => {

  //////  RETRIEVING DATA FROM LOCAL STORAGE  
  const token = localStorage.getItem("token"); // USER TOKEN 
  const requestId = localStorage.getItem("requestId"); // REQUEST ID TO FOR RESET PASS
  const serverUrl = process.env.REACT_APP_BASE_URL; // SERVER URL W
  const { propsAsAction, actionToPerform } = React.useContext(AppContext); // GLOBAL VARIABLE OR STATE PROVIDED BY CONTEXT API
  const [profileData, setProfileData] = useState({ // USER DATA 
    firstName: "",
    lastName: "",
    email: "",
    playlist: "",
    profilePic: "",
    mobileNo: "",
  });
  const [resetData, setResetData] = useState({  // DATA FOR RESET FUNCTION
    oldPassword: "",
    newPassword: "",
    email: "",
    otp: "",
    
  });
  const [isOtpSent, setOtpSent] = useState(false); // WATCHING THE OTP REQ 

  const [formErrors, setFormErrors] = useState({
    oldPassword: "",
    newPassword: "",
    email: "",
    otp: "",
    mobileNo: "",
  });
  const [edit, setEdit] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const [reqType, setReqType] = useState();

  const [previewpassword, setPreviewpassword] = useState(true);



  useEffect(() => {
    if (actionToPerform.userData) {
      setProfileData({
        firstName: actionToPerform.userData.firstName,
        lastName: actionToPerform.userData.lastName,
        email: actionToPerform.userData.email,
        mobileNo: actionToPerform.userData.mobileNo,
        profilePic: actionToPerform.userData.profilePic.imgUrl,
      });
    }
  }, [actionToPerform]);

  

  useEffect(() => {
    if (actionToPerform.passReset === true) {
      setFormErrors({
        firstName:"",
        lastName: "",
        email: "",
        mobileNo: "",
        profilePic: "",
      });
      setResetData({
        firstName:"",
        lastName: "",
        email: "",
        mobileNo: "",
        profilePic: "",
      });
    }
  }, [actionToPerform]);




  const isStrongpassword = (newPassword) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(newPassword);
  };

  const validatePass = () => {
    const errors = {};
    if (!resetData.oldPassword) {
      errors.oldPassword = "oldPassword is required.";
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
      data.oldpassword = resetData.oldPassword;
      
      setReqType("pass");
      try {
        const headers = { Authorization: `Bearer ${token}` };
    
        // You can use the 'data' object here, which may or may not have 'oldpassword' based on the condition
        // console.log(headers, "headers");
        // console.log(data, "data");
    
        const response = await axios.post(`${serverUrl}/generateOtp`, data, {
          headers,
        });
        if (response.data.status === "success") {
          setOtpSent(true);
          localStorage.setItem("requestId", response.data.requestId);
        } else if(response.data.message === "Invalid Password") {
          setFormErrors({
            oldPassword: response.data.message,
          });
          // console.log(response.data.message);
        } else {
          setFormErrors({
            email: response.data.message,
          });
        }
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
    
        // You can use the 'data' object here, which may or may not have 'oldpassword' based on the condition
        // console.log(headers, "headers");
        // console.log(data, "data");
    
        const response = await axios.post(`${serverUrl}/generateOtp`, data, {
          headers,
        });
        if (response.data.status === "success") {
          setOtpSent(true);
          localStorage.setItem("requestId", response.data.requestId);
        } else if(response.data.message === "Invalid Password") {
          setFormErrors({
            oldPassword: response.data.message,
          });
          // console.log(response.data.message);
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
          setEdit(false);
          propsAsAction({
            passReset: true,
          });
        } else if(response.data.status === 400) {
          setFormErrors({
            newPassword: response.data.message
          });
         }
          else {
            setFormErrors({
              otp: response.data.message
            });
          }
          console.log(response.data.message);
      } catch (error) {
        console.error(error);
      }
    }
  };

  //   console.log("data from contex api",profileData)

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handlePassReset = (event) => {
    const { name, value } = event.target;
    setResetData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  console.log("reset data", resetData);

  const handleFileChange = (event) => {
    setProfileData({ ...profileData, profilePic: event.target.files[0] });
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImg(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("mobileNo", profileData.mobileNo);
      formData.append("profilePic", profileData.profilePic);
      console.log("req", formData);
      const response = await axios.put(`${serverUrl}/update`, formData, {
        headers,
      });
      console.log("response", response);
      if (response.data.success) {
        propsAsAction({
          isUserLoggedIn: true,
          passReset : true
        });
        setEdit(false);
      } else {
        if(response.data.action === "mobileNo"){
          setFormErrors({
            mobileNo :response.data.message
          })
        }
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackBtn = () => {
    setEdit(false);
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="firstCard">
            <span onClick={() => setShowProfile(false)} className="cross_btn">
              <RiCloseCircleLine />
            </span>

            <div className="userImg">
              {}
              <img
                src={
                  edit
                    ? profileImg || actionToPerform.userData?.profilePic.imgUrl
                    : actionToPerform.userData?.profilePic.imgUrl
                }
                alt="avatar"
              />
              {edit === true && (
                <span className="img_add">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    name="profilePic"
                  />
                </span>
              )}
              {edit === true && (
                <span className="add_svg">
                  <AiOutlineFileAdd />
                </span>
              )}
            </div>
            <div className="userName">
              <h5>
                {actionToPerform.userData?.firstName || profileData?.firstName}
                {actionToPerform?.userData?.lastName || profileData?.lastName}
              </h5>
            </div>
          </div>
          {edit === "isOtpSent" && !actionToPerform.loggedInWithGoogle ? (
            <div className="resetPassword">
              <h3>Reset Password</h3>
              <button className="backbtn" onClick={handleBackBtn}>
                <BiArrowBack />
                back
              </button>
              { reqType === "email" ? "" : <><span>Old Password</span>
              <input
                type="text"
                value={resetData.oldPassword}
                name="oldPassword"
                placeholder="Enter Your Old Password"
                onChange={handlePassReset}
              />
              {formErrors.oldPassword && (
                <p className="error">{formErrors.oldPassword}</p>
              )} </>}
              {reqType === "pass" || reqType === "email" ? "" : <h5>OR</h5> }
              {reqType === "pass" ? "" : <>
              
              <span>Email Address</span>
              <input
                type="text"
                value={resetData.email}
                name="email"
                placeholder="Enter Your Email"
                onChange={handlePassReset}
              />
              {formErrors.email && (
                <p className="error">{formErrors.email}</p>
              )}
              </>}
              


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
                            uppercase letter, one lowercase letter, one number,
                            and one special character.
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
            </div>
          ) : (
            <div
              className={
                edit === false
                  ? "secondCard"
                  : `secondCardEdit ${edit === true ? "" : "closing"}`
              }
            >
              <div className="row">
                <h4>First Name</h4>
                {edit === true ? (
                  <input
                    type="text"
                    value={profileData?.firstName}
                    onChange={handleOnChange}
                    name="firstName"
                  />
                ) : (
                  <h5>{actionToPerform.userData?.firstName}</h5>
                )}
              </div>
              <div className="row">
                <h4>Last Name</h4>
                {edit === true ? (
                  <input
                    type="text"
                    value={profileData?.lastName}
                    onChange={handleOnChange}
                    name="lastName"
                  />
                ) : (
                  <h5>{actionToPerform.userData?.lastName}</h5>
                )}
              </div>

              <div className="row">
                <h4>Mobile Number</h4>
                {edit === true ? (
                 <> <input
                    type="text"
                    value={profileData.mobileNo || ""}
                    onChange={handleOnChange}
                    name="mobileNo"
                    placeholder="Add Mobile Number"
                  />
                  {formErrors.mobileNo && (
                <p className="error">{formErrors.mobileNo}</p>
              )} </>
                ) : (
                  <h5>{actionToPerform.userData?.mobileNo || "Not Found"}</h5>
                )}
              </div>
              <div className="row">
                <h4>Email Address</h4>
                <h5>{profileData.email}</h5>
              </div>
              {edit === true && (
                <div className="editbtn">
                  <span onClick={handleUpdateProfile} className="action_btn1">
                    <BiSave />
                  </span>
                  <span onClick={() => setEdit(false)} className="action_btn2">
                    <RiCloseCircleLine />
                  </span>
                </div>
              )}
              {edit === false && (
                <div className="control_btnn">
                  <div className="btnn">
                    <button onClick={() => setEdit(true)}>Edit Profile</button>
                  </div>
                  {actionToPerform.userData?.loggedInWithGoogle === false ? (
                    <div className="btnn">
                      <button onClick={() => setEdit("isOtpSent")}>
                        Reset Password
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
