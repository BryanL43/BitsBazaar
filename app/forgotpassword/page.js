"use client"

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [isEmailNotFound, setIsEmailNotFound] = useState(false);
    const [emailResponseData, setEmailResponseData] = useState(null);
    const [codeResponseData, setCodeResponseData] = useState(null);
    const [changedResponseData, setChangedResponseData] = useState(null);
    const codeInputs = useRef([]);
    const [verificationCode, setVerificationCode] = useState("");

    const forgotPwdFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const url = `/api?type=forgotpassword&email=${email}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.email === "Not found") {
                    setIsEmailNotFound(true);
                } else {
                    setIsEmailNotFound(false);
                    setEmailResponseData(responseData);
                }
            } else {
                console.log("Error when reading response");
            }
        } catch (error) {
            console.log("Error occurred when searching for email:", error)
        }
    }

    const handleChange = (i, event) => {
        const { value } = event.target;
        const preventLetter = value.replace(/\D/g, "");
        event.target.value = preventLetter;

        if (!isNaN(parseInt(value, 10)) && value !== "") {
            if (i < codeInputs.current.length - 1) {
                codeInputs.current[i + 1].focus();
            }
        }

        const updatedCode = codeInputs.current.map(input => input.value).join("");
        setVerificationCode(updatedCode);
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData('text/plain');
        const digits = pastedText.replace(/\D/g, "").slice(0, 6);
        
        for (let i = 0; i < digits.length; i++) {
            codeInputs.current[i].value = digits[i];
            if (i < codeInputs.current.length - 1) {
                codeInputs.current[i + 1].focus();
            }
        }
    
        const updatedCode = codeInputs.current.map(input => input.value).join("");
        setVerificationCode(updatedCode);
    };

    const verifyFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const url = `/api?type=verifycode&code=${verificationCode}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.code === "Not found") {
                    console.log("Code not Found");
                } else {
                    console.log("Code Found: " + responseData.code);
                    setCodeResponseData(responseData);
                }
            } else {
                console.log("Error when reading response");
            }
        } catch (error) {
            console.log("Error occurred when verifying code:", error)
        }
    }

    //Merge changepwd contents
    //Password visibility toggle handler
    const [pwdVis, setPwdVis] = useState(false);
    const togglePwdVis = () => {
        setPwdVis(prevVisible => !prevVisible);
    };

    //Confirm password visibility toggle handler
    const [confirmPwdVis, setconfirmPwdVis] = useState(false);
    const toggleConfirmPwdVis = () => {
        setconfirmPwdVis(prevVisible2 => !prevVisible2);
    };

    //Password strength handler
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        updatePWDStrength(newPassword);
    };

    const handleConfirmPasswordChange = (event) => {
        const newConfirmPassword = event.target.value;
        setConfirmPassword(newConfirmPassword);
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
    const [registerNoteText, setRegisterNoteText] = useState("Passwords must be at least 8 characters in length and contain 1 upper case letter, 1 lower case letter, 1 number, and 1 special character.");

    const validateChangePwdForm = () => {
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

        if (password !== confirmPassword) {
            document.getElementById("confirmPwdNote").textContent = "Passwords do not match.";
            return false;
        } else {
            document.getElementById("confirmPwdNote").textContent = "";
        }

        return true;
    };

    const changePwdFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        if (validateChangePwdForm()) {
            try {
                const url = "/api?type=changepwd";

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        newPassword: password
                    })
                })

                if (response.ok) {
                    console.log("Change Password Successful!");
                    setChangedResponseData(true);
                } else {
                    console.log("Change password failed");
                }
            } catch (error) {
                console.log("Error occured during password change:", error)
            }
        }
    };

    return (
        <main>
            {!emailResponseData && ( //Default render email response
                <React.Fragment>
                    <div className="forgotpwd-screen">
                        <div className="forgotpwd-container">
                                <h1>Account Verification</h1>
                                <form className="signin-form" action="/forgotpassword" method="GET" onSubmit={forgotPwdFormSubmission}>
                                    <p>Enter your BitsBazaar-associated email for a password reset</p>
                                    {isEmailNotFound && (
                                        <div className="emailNotFound">
                                            <FontAwesomeIcon icon={faCircleExclamation} id="emailNotFoundIcons" />
                                            <p>Email is not found in our records</p>
                                            <FontAwesomeIcon icon={faXmark} id="emailNotFoundIconsClose" onClick={() => setIsEmailNotFound(false)} />
                                        </div>
                                    )}
                                    <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <button id="submitBtn" type="submit">Continue</button>
                                    <p><br></br></p>
                                    <p id="alrHaveAccP">Remember your password? <Link href="/signin">Sign In</Link></p>
                                </form>
                        </div>
                    </div>
                </React.Fragment>
            )}
            {emailResponseData && ( // Render verify-code if email is valid
                !codeResponseData && ( // Render verify-code
                    <React.Fragment>
                        <div className="verify-screen">
                            <div className="verify-container">
                                <h1>Verify One-Time Code</h1>
                                <form className="verify-form" action="/forgotpassword" method="GET" onSubmit={verifyFormSubmission}>
                                    <p>Enter the one-time code we sent to <br></br><strong>{emailResponseData.email}</strong></p>
                                    <div className="code-input-container">
                                        {[...Array(6)].map((_, i) => (
                                            <input
                                                ref={el => codeInputs.current[i] = el}
                                                key={i}
                                                className="code-input"
                                                type="text"
                                                maxLength="1"
                                                onChange={(e) => handleChange(i, e)}
                                                onPaste={handlePaste}
                                            />
                                        ))}
                                    </div>
                                    <p><br></br>Didn&apos;t receive a one-time code? <Link href="#" onClick={forgotPwdFormSubmission}>Resend now</Link></p>
                                    <button id="submitBtn" type="submit">Verify</button>
                                </form>
                            </div>
                        </div>
                    </React.Fragment>
                )
            )}
            {codeResponseData && ( //Render change-pwd page if code is valid
                !changedResponseData && ( //Render change-pwd page
                    <div className="changepwd-screen">
                        <div className="changepwd-container">
                            <h1>Create a new password</h1>
                            <form className="changepwd-form" action="/forgotpassword" method="GET" onSubmit={changePwdFormSubmission}>
                                <div className="password-container">
                                    <input id="passwordBar" type={pwdVis ? "text" : "password"} placeholder="New password" value={password} onChange={handlePasswordChange} required />
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
                                <div className="password-container">
                                    <input id="passwordBar" type={confirmPwdVis ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
                                    <button id="passwordVis" type="button" onClick={toggleConfirmPwdVis}>
                                        <FontAwesomeIcon icon={confirmPwdVis ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                <p id="confirmPwdNote"></p>
                                <button id="submitBtn" type="submit">Save</button>
                            </form>
                        </div>
                    </div>
                )
            )}
            {changedResponseData && ( //Render redirect page
                <div className="redirect-screen">
                    <div className="redirect-container">
                        <h1>Password Changed Successfully</h1>
                        <div className="redirectContent">
                            <FontAwesomeIcon id="checkIcon" icon={faCheckCircle} />
                            <p id="redirectNote">You can now use your new password to sign in to your BitsBazaar account.</p>
                        </div>
                        <Link href="/signin" id="returnToSignIn">
                            <button id="submitBtn" type="button">Sign in</button>
                        </Link>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Forgotpassword;