import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { resetPwd } from '../utils/user';

const Changepwd = ({ resetEmail, onChangePwd }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const [pwdVis, setPwdVis] = useState(false);
    const [confirmPwdVis, setconfirmPwdVis] = useState(false);

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
                const responseData = await resetPwd(resetEmail, password);
                if (responseData.success === true) {
                    console.log("Change Password Successful!");
                    onChangePwd(true);
                } else {
                    console.log("Change Password failed!");
                }
            } catch (error) {
                console.log("Error occurred when verifying code:", error)
            }
        }
    }
    
    return (
        <div className="changepwd-screen">
            <div className="changepwd-container">
                <h1>Create a new password</h1>
                <form className="changepwd-form" action="/forgotpassword" method="GET" onSubmit={changePwdFormSubmission}>
                    <div className="password-container">
                        <input id="passwordBar" type={pwdVis ? "text" : "password"} placeholder="New password" value={password} onChange={(e) => {setPassword(e.target.value); updatePWDStrength(e.target.value);}} required />
                        <button id="passwordVis" type="button" onClick={() => setPwdVis(prevVisible => !prevVisible)}>
                            <FontAwesomeIcon icon={pwdVis ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    {passwordStrength && (
                        <div className="progressBar" {...(passwordStrength === "no password" ? { hidden: true } : {})}>
                            <div className="redPWDStrength" {...(passwordStrength === "weak password" ? {} : {})}></div>
                            <div className="yellowPWDStrength" {...(passwordStrength === "medium password" || passwordStrength === "strong password" ? {} : { hidden: true })}></div>
                            <div className="greenPWDStrength" {...(passwordStrength === "strong password" ? {} : { hidden: true })}></div>
                            <p id="pwdStatus">{passwordStrength}</p>
                        </div>
                    )}
                    <p id="registerNote">{registerNoteText}</p>
                    <div className="password-container">
                        <input id="passwordBar" type={confirmPwdVis ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} required />
                        <button id="passwordVis" type="button" onClick={() => setconfirmPwdVis(prevVisible => !prevVisible)}>
                            <FontAwesomeIcon icon={confirmPwdVis ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <p id="confirmPwdNote"></p>
                    <button id="submitBtn" type="submit">Save</button>
                </form>
            </div>
        </div>
    )
}

export default Changepwd