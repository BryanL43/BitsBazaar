"use client"

import React, { useState } from 'react'
import Link from 'next/link';

import { changeLastName } from '../utils/user';
import { getCookie, setCookie } from '../utils/cookies';

const ChangeFirstNamePg = ({ closePages, pageChange }) => {
    const [newLastName, setNewLastName] = useState("");

    //React cannot read on DOM level from fragmented files
    const handlePageChange = (page) => {
        pageChange(page);
    };

    const handleClosePages = () => {
        closePages();
    }

    //Change last name form handler
    const changeLastNameForm = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const responseData = await changeLastName(JSON.parse(getCookie("userData")).id, newLastName);
            if (responseData.success === true) {
                setCookie("userData", JSON.stringify(responseData.user), 1);
                console.log("Change Last Name Successful!");
                window.location.href = "/profile" //Hard refresh to ensure data accuracy
            } else {
                console.log("Change Last Name Failed");
            }
        } catch (error) {
            console.log("Error occured when changing last name:", error)
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
                    <p>Change your last name</p>
                </li>
            </ol>
            <h1>Change your last name</h1>
            <ul className="change-name-card-container">
                <li>
                    <div className="change-name-card-padding">
                        <p>If you want to change the last name associated with your BitsBazaar customer account, you may do so below. be sure to click the <strong>Save</strong> button when you are done.</p>
                        <label><strong>New last name</strong></label>
                        <input type="text" className="new-name-input" value={newLastName} onChange={(e) => setNewLastName(e.target.value)}></input>
                        <button onClick={changeLastNameForm}>Save</button>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default ChangeFirstNamePg