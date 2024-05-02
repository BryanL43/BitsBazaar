"use client"

import Link from 'next/link';
import React, { useState } from 'react'

const Edit2 = () => {


    return (
        <main>
            <div className="profile-screen">
                <div className="edit-container">
                    <ol className="custom-list">
                        <li>
                            <Link href="/profile" id="backToProfile">Your Account</Link>
                        </li>
                        <li>
                            <Link href="/profile" id="backToProfile">Personal Information</Link>
                        </li>
                        <li>
                            <p>Change your first name</p>
                        </li>
                    </ol>
                    <h1>Change your name</h1>
                    <ul className="change-name-card-container">
                        <li>
                            <div className="change-name-card-padding">
                                <p>If you want to change the name associated with your BitsBazaar customer account, you may do so below. be sure to click the <strong>Save</strong> button when you are done.</p>
                                <label><strong>New first name</strong></label>
                                <input type="text" className="new-name-input"></input>
                                <button>Save</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    )
}

export default Edit2