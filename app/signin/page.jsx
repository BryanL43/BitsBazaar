"use client"

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

import { signIn } from '../utils/auth';
import { setCookie, getCookie } from '../utils/cookies';

const SignInMenu = () => {
    const router = useRouter()

    //Already logged in so redirect
    if (getCookie("userData")) {
        router.push("/catalogue?search=all");
    }

    const [isLoginNotFound, setIsLoginNotFound] = useState(false);
    const [pwdVis, setPwdVis] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');

    const signInFormSubmission = async (event) => {
        event.preventDefault(); //Prevent default form submission
        try {
            const responseData = await signIn(email, password);
            if (responseData.success === false) {
                setIsLoginNotFound(true);
            } else {
                setIsLoginNotFound(false);
                setCookie("userData", JSON.stringify(responseData.user), 1); //Expire time of 1 day

                if (window.sessionStorage.getItem("to-add-to-cart")) {
                    window.location.href = "/product?id=" + window.sessionStorage.getItem("to-add-to-cart");
                    window.sessionStorage.removeItem("to-add-to-cart");
                } else {
                    router.push("/catalogue?search=all");
                }
            }
        } catch (error) {
            console.log("Error occurred during sign in:", error);
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
                    <form className="signin-form" onSubmit={signInFormSubmission}>
                        <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div className="password-container">
                            <input id="passwordBar" type={pwdVis ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} required />
                            <button id="passwordVis" type="button" onClick={() => {setPwdVis(prevVisible => !prevVisible)}}>
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

export default SignInMenu