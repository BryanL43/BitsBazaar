"use client"

import React from 'react'

const ChangeEmailPg = ({ currEmail, sendCode, newEmail, setNewEmail }) => {

    //React cannot read on DOM level from fragmented files
    const handleSendCode = async (event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            await sendCode();
        } catch (error) {
            console.error("Error occurred when sending verification code:", error);
        }
    };

    const handleSetNewEmail = (newEmail) => {
        setNewEmail(newEmail);
    };

    return (
        <div className="forgotpwd-screen">
            <div className="forgotpwd-container">
                <h1>Change Your Email Address</h1>
                <form className="signin-form" onSubmit={handleSendCode}>
                    <p>Current email address: <strong>{currEmail}</strong></p>
                    <p style={{ width: "80%" }}>Enter the new email address you would like to associate with your account below. We will send a verification code to your current address for confirmation.</p>
                    <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={newEmail} onChange={(e) => handleSetNewEmail(e.target.value)} required />
                    <button id="submitBtn" type="submit">Continue</button>
                </form>
            </div>
        </div>
    )
}

export default ChangeEmailPg