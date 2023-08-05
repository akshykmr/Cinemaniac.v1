import React, { useState, useEffect } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import './SignUpForm.scss'

const SignUpForm = () => {
  const [userForm, setUserForm] = useState('LogIn');
  const [previewPassword, setPreviewPassword] = useState(false);

  const [signUpFormData, setSignUpFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
  });

  const [formErrors, setFormErrors] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setSignUpFormData((prevValue) => ({ ...prevValue, [name]: value }));
  };

  useEffect(() => {
    console.log('SignUp Details', signUpFormData);
  }, [signUpFormData]);

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
    if (!signUpFormData.First_Name) {
      errors.First_Name = 'First Name is required.';
    }
    if (!signUpFormData.Last_Name) {
      errors.Last_Name = 'Last Name is required.';
    }
    if (!signUpFormData.Email) {
      errors.Email = 'Email is required.';
    }
    if (!signUpFormData.Password) {
      errors.Password = 'Password is required.';
    } else if (!isStrongPassword(signUpFormData.Password)) {
      errors.Password =
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      // Do something with the valid form data
      console.log('Form submitted:', signUpFormData);
    }
  };

  return (
    <div className="body">
      <form>
      <div className="signUpForm">
      <h3>Registration</h3>
      <span className="form_user_name">
        <span>
          <h6>First Name</h6>
          <input
            type="text"
            placeholder="Enter Your First Name"
            onChange={handleOnChange}
            value={signUpFormData.First_Name}
            name="First_Name"
          />
          {formErrors.First_Name && (
            <p className="error">{formErrors.First_Name}</p>
          )}
        </span>
        <span>
          <h6>Last Name</h6>
          <input
            type="text"
            placeholder="Enter Your Last Name"
            onChange={handleOnChange}
            value={signUpFormData.Last_Name}
            name="Last_Name"
          />
          {formErrors.Last_Name && (
            <p className="error">{formErrors.Last_Name}</p>
          )}
        </span>
      </span>
      <span className="form_user_password">
        <span>
          <h6>Email</h6>
          <input
            type="email"
            value={signUpFormData.Email}
            name="Email"
            required
            placeholder="Enter Your Email Id"
            onChange={handleOnChange}
          />
          {formErrors.Email && <p className="error">{formErrors.Email}</p>}
        </span>
        <span>
          <h6>Password</h6>
          <input
            type={previewPassword ? 'text' : 'password'}
            value={signUpFormData.Password}
            name="Password"
            onChange={handleOnChange}
            required
            placeholder="Enter Your Password"
          />
          <span className="password_hider" onClick={handlePasswordPreviewer}>
            {previewPassword ? <BsEye /> : <BsEyeSlash />}
          </span>
          {formErrors.Password && (
            <p className="error">{formErrors.Password}</p>
          )}
        </span>
      </span>
      <button className="form_logInBtn" onClick={handleSignUpSubmit}>
        SignUp
      </button>
      <p>
        Already have an account?{' '}
        <button onClick={() => setUserForm('LogIn')}>LogIn</button>
      </p>
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

export default SignUpForm;
