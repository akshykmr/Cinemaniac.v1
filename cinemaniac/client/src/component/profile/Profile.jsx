import React, { useState } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { BiSave } from "react-icons/bi";
import AppContext from "../context/AppContext";
import { AiOutlineFileAdd } from "react-icons/ai";

import "./Profile.scss";

const Profile = ({ setShowProfile }) => {
    
    const { actionToPerform, propsAsAction } = React.useContext(AppContext);


  let userImg = localStorage.getItem("userImg");

  const [userName, setUserName] = useState({
    firstName: "",
    lastName: "",
    profilePic : ""
  });

  console.log("data from contex api",actionToPerform)

  const [edit, setEdit] = useState(false);

  const handleForgotPassword = () => {
    console.log("clicked on profile", actionToPerform.openForgotPass);
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
              <img
                src={userImg}
                alt="avatar"
              />
              {edit && (
                <span className="img_add">
                  <input type="file" />
                </span>
              )}
              {edit && (
                <span className="add_svg">
                  <AiOutlineFileAdd />
                </span>
              )}
            </div>
            <div className="userName">
              <h5>John Smith</h5>
            </div>
          </div>

          <div
            className={
              !edit ? "secondCard" : `secondCardEdit ${edit ? "" : "closing"}`
            }
          >
            <div className="row">
              <h4>First Name</h4>
              <input type="text" value="Akshay" />
            </div>
            <div className="row">
              <h4>Last Name</h4>
              <input type="text" value="Kumar" />
            </div>
            <div className="row">
              <h4>Email Address</h4>
              <h5>Akshay@gmail.com</h5>
            </div>
            {edit && (
              <div className="editbtn">
                <span
                  onClick={() => setShowProfile(false)}
                  className="action_btn1"
                >
                  <BiSave />
                </span>
                <span
                  onClick={() => setEdit((prevState) => !prevState)}
                  className="action_btn2"
                >
                  <RiCloseCircleLine />
                </span>
              </div>
            )}
            {!edit && (
              <div className="control_btn">
                <div className="btn">
                  <button onClick={() => setEdit((prevState) => !prevState)}>
                    Edit Profile
                  </button>
                </div>
                <div className="bnt">
                  <button onClick={handleForgotPassword}>Reset Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
