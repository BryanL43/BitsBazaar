"use client"

import React from 'react'
import Link from 'next/link';
import { getCookie } from '../utils/cookies';
import { useRouter } from 'next/navigation';

const InfoEditPg = ({ closePages, pageChange }) => {
    const router = useRouter();

    //React cannot read on DOM level from fragmented files
    const handlePageChange = (page) => {
        pageChange(page);
    };

    const handleClosePages = () => {
        closePages();
    }

    return (
        <div className="edit-container">
            <ol className="custom-list">
                <li>
                    <Link href="/profile" id="backToProfile" onClick={handleClosePages}>Your Account</Link>
                </li>
                <li>
                    <p>Personal Information</p>
                </li>
            </ol>
            <h1>Personal Information</h1>
            <ul className="info-card-container">
                <li>
                    <div className="info-card-padding">
                        <h1><strong>First Name</strong></h1>
                        <p>{JSON.parse(getCookie("userData")).firstName}</p>
                        <button onClick={() => handlePageChange("changeFirstName")}>Edit</button>
                    </div>
                </li>
                <li>
                    <div className="info-card-padding">
                        <h1><strong>Last Name</strong></h1>
                        <p>{JSON.parse(getCookie("userData")).lastName}</p>
                        <button onClick={() => handlePageChange("changeLastName")}>Edit</button>
                    </div>
                </li>
                <li>
                    <div className="info-card-padding">
                        <h1><strong>Email</strong></h1>
                        <p>{JSON.parse(getCookie("userData")).email}</p>
                        <button onClick={() => handlePageChange("changeEmail")}>Edit</button>
                    </div>
                </li>
                <li>
                    <div className="info-card-padding">
                        <h1><strong>Password</strong></h1>
                        <p>**********</p>
                        <button onClick={() => router.push('/forgotpassword')}>Edit</button>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default InfoEditPg