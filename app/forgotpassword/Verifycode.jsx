import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import { verifycode } from '../utils/verifycode';
import { forgotpwd } from '../utils/user';
import { deleteCookie } from '../utils/cookies';

const Verifycode = ({ resetEmail, onCodeVerification }) => {
    const codeInputs = useRef([]);
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeNotFound, setIsCodeNotFound] = useState(false);
    
    //The following 2 functions handle code inputs
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
            const responseData = await verifycode(verificationCode);
            if (responseData.success === true) {
                setIsCodeNotFound(false);
                deleteCookie("userData");
                onCodeVerification(true);
            } else {
                setIsCodeNotFound(true);
            }
        } catch (error) {
            console.log("Error occurred when verifying code:", error)
        }
    }

    const reSendCode = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            await forgotpwd(resetEmail);
        } catch (error) {
            console.log("Error occurred when searching for email:", error)
        }
    }

    return (
        <div className="verify-screen">
            <div className="verify-container">
                <h1>Verify One-Time Code</h1>
                <form className="verify-form" action="/forgotpassword" method="GET" onSubmit={verifyFormSubmission}>
                    <p>Enter the one-time code we sent to <br></br><strong>{resetEmail}</strong></p>
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
                    <p><br></br>Didn&apos;t receive a one-time code? <Link href="#" onClick={reSendCode}>Resend now</Link></p>
                    <button id="submitBtn" type="submit">Verify</button>
                </form>
            </div>
        </div>
    )
}

export default Verifycode