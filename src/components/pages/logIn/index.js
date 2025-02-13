import React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../firebase/AuthProvider";
import LoadingIndicator from "../../../assets/loading";

import "./login.css";

const Login = () => {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const { loginUser, loading, user, setLoading } = useAuthContext();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingIndicator />
  }

  if (user) {
    navigate("/");
  }

  const onSubmit = (formData) => {
    const email = formData.email;
    const password = formData.password;
    loginUser(email, password)
      .then((result) => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error.message);
        navigate('/signup')
        setLoading(false)
      })
  };

  return (
    <div className="signin-container">
      <h2>Sign in to your account</h2>
      <div>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper">
            <label htmlFor="email">Email address</label>
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
              render={({ message }) => <p className="text-red">{message}</p>}
            />
          </div>

          <div className="input-wrapper">
            <div>
              <label htmlFor="password">Password</label>
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
              render={({ message }) => <p className="text-red">{message}</p>}
            />
          </div>

          <div className="sign-in-btn">
            <button type="submit" className="register-btn">
              Sign in
            </button>
          </div>
        </form>
      </div>
      <div className="signup-route">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
