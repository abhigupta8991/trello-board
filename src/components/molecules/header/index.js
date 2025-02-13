import React from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthContext } from '../../../firebase/AuthProvider';

import "./header.css";

const Header = () => {
  const { user, logOut, loading } = useAuthContext();
  const navigate = useNavigate();
  const handleSignOut = () => {
    logOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <nav className='header-bar'>
        <div className='left-items'>
          <div className='title'>
            Trello Board
          </div>
          {user && !loading && (
            <div>
              <ul>
                <li className='header-links'>
                  <Link to="/">Your Projects</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        {!loading && (
          user ? (
            <button className='header-cta' onClick={handleSignOut}>Log Out</button>
          ) : (
            <button className='header-cta'>
              <Link to="/login">Log In</Link>
            </button>
          )
        )}
      </nav>
      <Outlet />
    </>
  )
}

export default Header
