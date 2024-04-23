"use client"

import Link from 'next/link';
import React, { useState } from 'react'
//import Navbar from '../components/Navbar';

const Signin = () => {
  const [email, setEmail] = useState("");

  //Password visibility toggle handler
  const [pwdVis, setPwdVis] = useState(false);
  const togglePwdVis = () => {
      setPwdVis(prevVisible => !prevVisible);
  };

  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <div className="signin-screen">
            <div className="signin-container">
              <h1>Sign In</h1>
              <form className="signin-form">
                  <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div className="password-container">
                      <input id="passwordBar" type={pwdVis ? "text" : "password"} placeholder="Password" required />
                      <button id="passwordVis" type="button" onClick={togglePwdVis}>
                        <i id="visIcon" className={`glyphicon glyphicon-eye-${pwdVis ? 'close' : 'open'}`}></i>
                      </button>
                  </div>
                  <p>Forgot your password? <Link href="/forgotpassword">Click here</Link></p>
                  <button id="submitBtn" type="submit">Sign In</button>
                  <p>Don't have a BitsBazaar account? <Link href="/register">Create an account</Link></p>
              </form>
              <p id="extra-signin-text">By continuing, you agree to BitBazaar's Conditions of Use and Privacy Notice.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Signin