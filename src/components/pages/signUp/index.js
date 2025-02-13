import React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../firebase/AuthProvider";
import { updateProfile } from "firebase/auth";
import LoadingIndicator from "../../../assets/loading";

import "./signup.css";

const SignUp = () => {
  const { register, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const { createUser, user, loading } = useAuthContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <LoadingIndicator />
    )
  }

  if (user) {
    navigate("/");
  }

  const onSubmit = (formData) => {
    const name = formData.name;
    const email = formData.email;
    const password = formData.password;
    createUser(email, password)
      .then((result) => {
        updateProfile(result.user, {
          displayName: name,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="signin-container">
      <h2>Sign Up</h2>
      <div>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-wrapper">
            <label htmlFor="email">
              Name
            </label>
            <div>
              <input
                id="name"
                type="name"
                autoComplete="name"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-red">{message}</p>
              )}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="email">
              Email address
            </label>
            <div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  validate: {
                    isValidEmail: (value) =>
                      // eslint-disable-next-line no-useless-escape
                      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email is not valid",
                  },
                })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className="text-red">{message}</p>
              )}
            />
          </div>

          <div className="input-wrapper">
            <div>
              <label htmlFor="password">
                Password
              </label>
            </div>
            <div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  validate: {
                    minLength: (value) =>
                      value.length >= 8 ||
                      "Password should has more than 8 characters",
                    isCapitalLetter: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password should has at least one capital letter",
                    isLowerCaseLetter: (value) =>
                      /[a-z]/.test(value) ||
                      "Password should has at least one lower case letter",
                    isContainNumber: (value) =>
                      /\d/.test(value) ||
                      "Password should has at least one number",
                  },
                })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <p className="text-red">{message}</p>
              )}
            />
          </div>

          <div className="input-wrapper">
            <div>
              <label htmlFor="confirm_password">
                Confirm Password
              </label>
            </div>
            <div>
              <input
                id="confirm_password"
                type="password"
                autoComplete="current-password"
                {...register("confirm_password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  validate: (val) => { 
                    if (watch('password') !== val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="confirm_password"
              render={({ message }) => (
                <p className="text-red">{message}</p>
              )}
            />
          </div>
      
          <div className="sign-in-btn">
            <button type="submit" className="register-btn">
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <div className="login-route">Already a member? <Link to='/login'>Log in</Link></div>
    </div>
  );
};

export default SignUp;