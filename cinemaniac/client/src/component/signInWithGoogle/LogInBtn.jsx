import React from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import "./LogInBtn.scss";
import { FcGoogle } from "react-icons/fc";
import AppContext from "../context/AppContext";


export const LogInBtn = () => {
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const { propsAsAction } = React.useContext(AppContext);


  const handleSuccess = async (response) => {
    try {
      if (response) {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
              Accept: "application/json",
            },
          }
        );
        const data = {
          firstName: res.data.given_name,
          lastName: res.data.family_name,
          email: res.data.email,
          profilePic : res.data.picture,
        };
        try {
          const response = await axios.post(`${serverUrl}/googlelogin`, data);
  
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            propsAsAction({
                isUserLoggedIn: true,
              });
          } else {
            console.log(response.data.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleFailure = (error) => {
    console.log("error", error);
  };

  const signIn = useGoogleLogin({
    onSuccess: handleSuccess,
    onFailure: handleFailure,
  });

  const handleButtonClick = (e) => {
    e.preventDefault();
    signIn();
  };

  return (
    <button onClick={handleButtonClick} className="googleSignUp">
      <FcGoogle />
      Continue With Google
    </button>
  );
};
