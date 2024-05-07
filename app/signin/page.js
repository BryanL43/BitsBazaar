"use client"

import Link from 'next/link';
import React, { useState } from 'react'
//import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'

const Signin = () => {
    //const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoginNotFound, setIsLoginNotFound] = useState(false);

    //Password visibility toggle handler
    const [pwdVis, setPwdVis] = useState(false);
    const togglePwdVis = () => {
        setPwdVis(prevVisible => !prevVisible);
    };

    const [password, setPassword] = useState('');
    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
    };

    //Cookie handler:
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    const signInFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const url = `/api?type=signin&email=${email}&password=${password}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.user === "Not found") {
                    setIsLoginNotFound(true);
                } else {
                    setIsLoginNotFound(false);
                    setCookie("userData", JSON.stringify(responseData), 1); //Expire time of 1 day

                    if (window.sessionStorage.getItem("to-add-to-cart")) {
                        window.location.href = "/product?id=" + window.sessionStorage.getItem("to-add-to-cart");
                        window.sessionStorage.removeItem("to-add-to-cart");
                    } else {
                        window.location.href = '/catalogue?search=all';
                    }
                }
            } else {
                console.log("Sign in failed");
            }
        } catch (error) {
            console.log("Error occured during sign in:", error)
        }
    }

    return (
        <main>
            <div className="signin-screen">
                <div className="signin-container">
                    <h1>Sign In</h1>
                    {isLoginNotFound && (
                        <div className="emailNotFound">
                            <FontAwesomeIcon icon={faCircleExclamation} id="emailNotFoundIcons" />
                            <p>Incorrect/Invalid Credentials</p>
                            <FontAwesomeIcon icon={faXmark} id="emailNotFoundIconsClose" onClick={() => setIsLoginNotFound(false)} />
                        </div>
                    )}
                    <form className="signin-form" action="/signin" method="GET" onSubmit={signInFormSubmission}>
                        <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div className="password-container">
                            <input id="passwordBar" type={pwdVis ? "text" : "password"} placeholder="Password" value={password} onChange={handlePasswordChange} required />
                            <button id="passwordVis" type="button" onClick={togglePwdVis}>
                                <FontAwesomeIcon icon={pwdVis ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <p>Forgot your password? <Link href="/forgotpassword">Click here</Link></p>
                        <button id="submitBtn" type="submit">Sign In</button>
                        <p>Don&apos;t have a BitsBazaar account? <Link href="/register">Create an account</Link></p>
                    </form>
                    <p id="extra-signin-text">By continuing, you agree to BitBazaar&apos;s Conditions of Use and Privacy Notice.</p>
                </div>
            </div>
        </main>
    )
}

export default Signin