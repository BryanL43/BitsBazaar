"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'

import Verifycode from './Verifycode';
import Changepwd from './Changepwd';

import { forgotpwd } from '../utils/user';

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [isEmailNotFound, setIsEmailNotFound] = useState(false);
    const [emailResponseData, setEmailResponseData] = useState(null);

    const [codeResponseData, setCodeResponseData] = useState(false);
    const [changedResponseData, setChangedResponseData] = useState(false);

    const forgotPwdFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const responseData = await forgotpwd(email);
            if (responseData.success === true) {
                setIsEmailNotFound(false);
                setEmailResponseData(responseData.email);
            } else {
                setIsEmailNotFound(true);
            }
        } catch (error) {
            console.log("Error occurred when searching for email:", error)
        }
    }

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
            {emailResponseData && !codeResponseData && ( //Render verify-code if email is valid
                <React.Fragment><Verifycode resetEmail={emailResponseData} onCodeVerification={setCodeResponseData} /></React.Fragment>
            )}
            {codeResponseData && !changedResponseData && ( //Render change-pwd page if code is valid
                    <React.Fragment><Changepwd resetEmail={emailResponseData} onChangePwd={setChangedResponseData}/></React.Fragment>
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