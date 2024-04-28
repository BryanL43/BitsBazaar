"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [isEmailNotFound, setIsEmailNotFound] = useState(false);

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
                
                if (responseData.email == "Not found") {
                    setIsEmailNotFound(true);
                } else {
                    setIsEmailNotFound(false);
                    document.querySelector(".signin-form").submit();
                }
            } else {
                console.log("Error when reading response");
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
                        {isEmailNotFound && (
                            <div className="emailNotFound" {...(isEmailNotFound ? {} : {hidden: true})}>
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
        </main>
    )
}

export default Forgotpassword