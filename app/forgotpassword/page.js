"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [isEmailNotFound, setIsEmailNotFound] = useState(true);

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
                console.log("Email Found Successful!");
                const responseData = await response.json();
                console.log("Response:", responseData.email);
            } else {
                console.log("Email Found failed");
            }
        } catch (error) {
            console.log("Error occured when searching for email:", error)
        }
    }

    return (
        <main>
            <div className="forgotpwd-screen">
                <div className="forgotpwd-container">
                    <h1>Account Verification</h1>
                    <form className="signin-form" action="/forgotpassword" method="GET" onSubmit={forgotPwdFormSubmission}>
                        <p>Enter your BitsBazaar-associated email for a password reset</p>
                        <div className="emailNotFound" {...(isEmailNotFound === true ? {hidden: true} : {})}>
                            <FontAwesomeIcon icon={faCircleExclamation} id="emailNotFoundIcons" />
                            <p>Email is not found in our records</p>
                            <FontAwesomeIcon icon={faXmark} id="emailNotFoundIconsClose" onClick={() => setIsEmailNotFound(false)} />
                        </div>
                        <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button id="submitBtn" type="submit">Continue</button>
                        <p><br></br></p>
                        <p id="alrHaveAccP">Remember your password? <Link href="/signin">Sign In</Link></p>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Forgotpassword