"use client"

import Link from 'next/link';
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Edit2 = () => {

    return (
        <main>
            <div className="verify-screen">
                <div className="verify-container">
                    <h1>Verify One-Time Code</h1>
                    <form className="verify-form" action="/forgotpassword" method="GET">
                        <p>Enter the one-time code we sent to <br></br><strong></strong></p>
                        {/* {isCodeNotFound && ( */}
                            <div className="emailNotFound">
                                <FontAwesomeIcon icon={faCircleExclamation} id="emailNotFoundIcons" />
                                <p>Invalid Code</p>
                                <FontAwesomeIcon icon={faXmark} id="emailNotFoundIconsClose" />
                            </div>
                        {/* )} */}
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
                        <p><br></br>Didn&apos;t receive a one-time code? <Link href="#">Resend now</Link></p>
                        <button id="submitBtn" type="submit">Verify</button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Edit2