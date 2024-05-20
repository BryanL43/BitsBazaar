"use client"

import React, { useState, useRef } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import { getCookie, deleteCookie } from '../utils/cookies';
import { changeEmail } from '../utils/user';

const CodeVerifyPg = ({ newEmail, sendCode }) => {
    const router = useRouter();

    const codeInputs = useRef([]);
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeNotFound, setIsCodeNotFound] = useState(false);
    
    const handleSendCode = async (event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            await sendCode();
        } catch (error) {
            console.error("Error occurred when sending verification code:", error);
        }
    };

    //Code Input Handler
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

    //Code paste Input Handler
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

    //Verify Change email code
    const verifyFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const responseData = await changeEmail(verificationCode, JSON.parse(getCookie("userData")).email, newEmail);
            if (responseData.success === true) {
                deleteCookie("userData");
                setIsCodeNotFound(false);
                router.push("/signin");
            } else {
                setIsCodeNotFound(true);
            }
        } catch (error) {
            console.log("Error occured when changing email address:", error)
        }
    }

    return (
        <div className="verify-screen">
            <div className="verify-container">
                <h1>Verify One-Time Code</h1>
                <form className="verify-form" onSubmit={verifyFormSubmission}>
                    <p>Enter the one-time code we sent to <br></br><strong>{JSON.parse(getCookie("userData")).email}</strong></p>
                    {isCodeNotFound && (
                        <div className="emailNotFound">
                            <FontAwesomeIcon icon={faCircleExclamation} id="emailNotFoundIcons" />
                            <p>Invalid Code</p>
                            <FontAwesomeIcon icon={faXmark} id="emailNotFoundIconsClose" onClick={() => setIsCodeNotFound(false)} />
                        </div>
                    )}
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
                    <p><br></br>Didn&apos;t receive a one-time code? <Link href="#" onClick={handleSendCode}>Resend now</Link></p>
                    <button id="submitBtn" type="submit">Verify</button>
                </form>
            </div>
        </div>
    )
}

export default CodeVerifyPg