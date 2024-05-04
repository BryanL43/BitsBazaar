"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const Register = () => {
    //Password visibility toggle handler
    const [pwdVis, setPwdVis] = useState(false);
    const togglePwdVis = () => {
        setPwdVis(prevVisible => !prevVisible);
    };

    //Password strength handler
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        updatePWDStrength(newPassword);
    };

    const updatePWDStrength = (password) => {
        let hasUpperCase = /[A-Z]/.test(password);
        let hasLowerCase = /[a-z]/.test(password);
        let hasNumber = /\d/.test(password);
        let hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        let hasLength = password.length >= 8;

        let strength = 0;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumber) strength++;
        if (hasSpecialChar) strength++;
        if (hasLength) strength++;

        if (strength === 0) {
            setPasswordStrength('no password');
        } else if (strength >= 1 && strength <= 3) {
            setPasswordStrength('weak password');
        } else if (strength === 4) {
            setPasswordStrength('medium password');
        } else {
            setPasswordStrength('strong password');
        }
    };

    //Submission validation handler
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [registerNoteText, setRegisterNoteText] = useState("Passwords must be at least 8 characters in length and contain 1 upper case letter, 1 lower case letter, 1 number, and 1 special character.");

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const validateRegistrationForm = () => {
        if (!firstName || !lastName || !email || !password) {
            setRegisterNoteText("Please fill in all fields.");
            return false;
        }

        if (password.includes(" ")) {
            setRegisterNoteText("Password cannot contain spaces.");
            return false;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        const hasLength = password.length >= 8;

        if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasLength)) {
            setRegisterNoteText("Passwords must be at least 8 characters in length and contain 1 upper case letter, 1 lower case letter, 1 number, and 1 special character.");
            return false;
        }

        return true;
    };

    const registerFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        if (validateRegistrationForm()) {
            try {
                const url = "/api?type=register";

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password
                    })
                })

                if (response.ok) {
                    console.log("Registeration Successful!");
                } else {
                    console.log("Registeration failed");
                }
            } catch (error) {
                console.log("Error occured during registeration:", error)
            }
            document.querySelector(".signin-form").submit();
        }
    };

    return (
        <main>
            <div className="register-screen">
                <div className="register-container">
                    <h1>Create Your Account</h1>
                    <p id="alrHaveAccP">Already have an account? <Link href="/signin">Sign In</Link></p>
                    <div className="nameBars-container">
                        <input id="firstNameBar" type="text" placeholder="First Name" autoComplete="off" value={firstName} onChange={handleFirstNameChange} required />
                        <input id="lastNameBar" type="text" placeholder="Last Name" autoComplete="off" value={lastName} onChange={handleLastNameChange} required />
                    </div>
                    <form className="signin-form" action="/signin" method="POST" onSubmit={registerFormSubmission}>
                        <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={email} onChange={handleEmailChange} required />
                        <div className="password-container">
                            <input id="passwordBar" type={pwdVis ? "text" : "password"} placeholder="Password" value={password} onChange={handlePasswordChange} required />
                            <button id="passwordVis" type="button" onClick={togglePwdVis}>
                                <FontAwesomeIcon icon={pwdVis ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {passwordStrength && (
                            <div className="progressBar" {...(passwordStrength === "no password" ? {hidden: true} : {})}>
                                <div className="redPWDStrength" {...(passwordStrength === "weak password" ? {} : {})}></div>
                                <div className="yellowPWDStrength" {...(passwordStrength === "medium password" || passwordStrength === "strong password" ? {} : {hidden: true})}></div>
                                <div className="greenPWDStrength" {...(passwordStrength === "strong password" ? {} : {hidden: true})}></div>
                                <p id="pwdStatus">{passwordStrength}</p>
                            </div>
                        )}
                        <p id="registerNote">{registerNoteText}</p>
                        <button id="submitBtn" type="submit">Create Account</button>
                        <p><br></br></p>
                        <p id="extra-signin-text">By continuing, you agree to BitBazaar&apos;s Conditions of Use and Privacy Notice.</p>
                    </form>
                </div>
            </div>
        </main>

    )
}

export default Register
