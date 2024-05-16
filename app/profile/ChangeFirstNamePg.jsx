"use client"

import React, { useState } from 'react'
import Link from 'next/link';

import { changeFirstName } from '../utils/user';
import { getCookie, setCookie } from '../utils/cookies';

const ChangeFirstNamePg = ({ closePages, pageChange }) => {
    const [newFirstName, setNewFirstName] = useState("");

    //React cannot read on DOM level from fragmented files
    const handlePageChange = (page) => {
        pageChange(page);
    };

    const handleClosePages = () => {
        closePages();
    }

    //Change first name form handler
    const changeFirstNameForm = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const responseData = await changeFirstName(JSON.parse(getCookie("userData")).id, newFirstName);
            if (responseData.success === true) {
                setCookie("userData", JSON.stringify(responseData.user), 1);
                console.log("Change First Name Successful!");
                window.location.href = "/profile" //Hard refresh to ensure data accuracy
            } else {
                console.log("Change First Name Failed");
            }
        } catch (error) {
            console.log("Error occured when changing first name:", error)
        }
    }

    return (
        <div className="edit-container">
            <ol className="custom-list">
                <li>
                    <Link href="/profile" id="backToProfile" onClick={handleClosePages}>Your Account</Link>
                </li>
                <li>
                    <Link href="/profile" id="backToProfile" onClick={() => handlePageChange("infoEdit")}>Personal Information</Link>
                </li>
                <li>
                    <p>Change your first name</p>
                </li>
            </ol>
            <h1>Change your first name</h1>
            <ul className="change-name-card-container">
                <li>
                    <div className="change-name-card-padding">
                        <p>If you want to change the first name associated with your BitsBazaar customer account, you may do so below. be sure to click the <strong>Save</strong> button when you are done.</p>
                        <label><strong>New first name</strong></label>
                        <input type="text" className="new-name-input" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)}></input>
                        <button onClick={changeFirstNameForm}>Save</button>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default ChangeFirstNamePg